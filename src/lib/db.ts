import { IconsDoc } from '@/types/icons'
import { NotepadDoc, NotepadHistoryDoc } from '@/types/notepad'
import { CategoriesDoc, NoteDoc, QueryFilters, UpdateNoteFields } from '@/types/notes'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { AppConfig } from './config'
import { auth, db, storage } from "./firebase"

const maxHistoryRecords = 10
const NOTES = "notes"
const CATEGORIES = "notes-categories"
const NOTEPAD = "notepad"
const ICONS = "notepad"

export const DEFAULT_ICON = "TriangleAlert"

const notesCollection = collection(db, NOTES)
const notepadDoc = doc(db, NOTEPAD, "content")
const categoriesDoc = doc(db, CATEGORIES, "categories")
const historyDoc = doc(db, NOTEPAD, "history")
const iconsDoc = doc(db, ICONS, "icons")

/** NOTEPAD */

export const GetNotepadContent = async () => {
  const notepadContent = await getDoc(notepadDoc)
  const exists = notepadContent.exists()

  if (exists) {
    return notepadContent.data() as NotepadDoc
  } else {
    const data: NotepadDoc = {
      content: "",
      timestamp: Date.now(),
    }
    await setDoc(notepadDoc, data)
    return data
  }
}

export const SubscribeToNotepadHistory = (callback: (doc: NotepadHistoryDoc) => void) => {
  const unsubscribe = onSnapshot(historyDoc, (doc) => {
    callback(doc.data() as NotepadHistoryDoc)
  })
  return unsubscribe
}

export const DeleteHistoryRecord = async (docs: NotepadDoc[], timestamp: number) => {
  const records = docs.filter(rec => rec.timestamp !== timestamp)
  await updateDoc(historyDoc, { records })
}

export const RecoverContentHistory = async (docs: NotepadDoc[], toDelete: number, toReplace: NotepadDoc, newContent: string) => {
  await UpdateNotepad(newContent, false)
  const historyRecords = docs.map(rec => rec.timestamp === toDelete ? toReplace : rec)
  await updateDoc(historyDoc, { records: historyRecords })
}

export const UpdateNotepad = async (content: string, updateHistory = true) => {
  const currentContent = await GetNotepadContent()

  await updateDoc(notepadDoc, {
    content,
    timestamp: Date.now(),
  })

  if (!updateHistory || currentContent.content === "") return

  const notepadHistory = await getDoc(historyDoc)
  const historyExists = notepadHistory.exists()

  if (historyExists) {
    const currentHistory = notepadHistory.data() as NotepadHistoryDoc
    let records = currentHistory.records

    const newestRecord = records.reduce((oldest, current) =>
      current.timestamp > oldest.timestamp ? current : oldest, records[0])

    if (newestRecord && currentContent.content.includes(newestRecord.content)) {
      records = records.filter(obj => obj !== newestRecord)
    } else {
      if (records.length >= maxHistoryRecords) {
        const oldestRecord = records.reduce((oldest, current) =>
          current.timestamp < oldest.timestamp ? current : oldest)
        records = records.filter(obj => obj !== oldestRecord)
      }
    }

    records.push(currentContent)
    await updateDoc(historyDoc, { records } as NotepadHistoryDoc)
  } else {
    await setDoc(historyDoc, {
      records: [currentContent]
    } as NotepadHistoryDoc)
  }
}

/** NOTES */

const UploadFile = async (file: File, isLoggedIn: boolean) => {
  const array = file.name.split(".")
  const ext = array.pop()
  const name = array.join(".")
  const fileName = array.length !== 0 ? `${name}.${ext}` : file.name

  const metadata = {
    customMetadata: {
      "isPublic": String(!isLoggedIn),
    }
  }

  const imageRef = ref(storage, `${NOTES}/${fileName}`)
  const res = await uploadBytes(imageRef, file, metadata)
  const url = await getDownloadURL(res.ref)
  return url
}

export const DownloadFile = async (url: string, name: string) => {
  var xhr = new XMLHttpRequest()
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const blob = xhr.response
    const file = new File([blob], name, { type: blob.type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  xhr.open('GET', url)
  xhr.send()
}

export const GetFileName = (url: string) => {
  const storage = getStorage()
  const fileRef = ref(storage, url)
  return fileRef.name
}

export const AddNote = async (content: string, files: File[], isLoggedIn: boolean, categoryId: string) => {
  const fileUrls = await Promise.all(
    files.map(async file => {
      const url = await UploadFile(file, isLoggedIn)
      return url
    })
  )

  await addDoc(notesCollection, {
    content,
    files: fileUrls,
    timestamp: Date.now(),
    isPublic: !isLoggedIn,
    categoryId
  } as NoteDoc)
}

export const UpdateNote = async (noteId: string, updatedNote: UpdateNoteFields) => {
  const noteRef = doc(db, NOTES, noteId)

  await updateDoc(noteRef, {
    ...updatedNote,
    timestamp: Date.now()
  })
}

export const UpdateCompleteNote = async (noteId: string, content: string, filesToRemove: string[], prevFiles: string[], filesToUpload: File[], isLoggedIn: boolean, categoryId: string) => {
  let finalFiles = []
  for (const value in prevFiles) {
    if (!filesToRemove.includes(prevFiles[value]))
      finalFiles.push(prevFiles[value])
  }

  filesToRemove.map(file => {
    const fileRef = ref(storage, file)
    deleteObject(fileRef)
  })

  const newFiles = await Promise.all(
    filesToUpload.map(async file => {
      const url = await UploadFile(file, isLoggedIn)
      return url
    })
  )

  await UpdateNote(noteId, {
    content,
    categoryId,
    files: finalFiles.concat(newFiles)
  })
}

export const DeleteNote = async (id: string, files: string[]) => {
  const noteRef = doc(db, NOTES, id)

  files.map(file => {
    const fileRef = ref(storage, file)
    deleteObject(fileRef)
  })

  await deleteDoc(noteRef)
}

export const SubscribeToNotes = (callback: (docs: NoteDoc[]) => void, categoriesMap: Map<string, number>, categoryFilter: string, isPublic?: boolean) => {
  const isPublicUnset = isPublic === undefined
  const filters: QueryFilters = [orderBy("timestamp", "desc")];

  if (isPublic !== undefined)
    filters.push(where("isPublic", "==", isPublic));
  if (categoryFilter !== "all")
    filters.push(where("categoryId", "==", categoryFilter === AppConfig.defaultFilters(true, true) ? "" : categoryFilter));

  const initialQuery = query(notesCollection, ...filters);
  const unsubscribe = onSnapshot(initialQuery, (snapshot) => {
    const notes = snapshot.docs.map(doc => {
      const data = doc.data()
      return { ...data, id: doc.id } as NoteDoc
    })

    let finalNotes = undefined
    if ((isPublicUnset || !isPublic) && categoryFilter === AppConfig.defaultFilters(true)) {
      finalNotes = notes.sort((a, b) =>
        (categoriesMap.get(a.categoryId) ?? Infinity) - (categoriesMap.get(b.categoryId) ?? Infinity)
      )
    }
    callback(finalNotes ?? notes)
  })
  return unsubscribe
}

/** LOGIN */

export const SignInUser = async (email: string, password: string) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  return credentials.user
}

export const SignOutUser = async () => await signOut(auth)

export const CheckSignedInUserAndSign = async () => {
  try {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    const resCheck = await fetch('/api/check-cookie');
    const cookieCheck = await resCheck.json()

    if (!cookieCheck.authenticated && token) {
      const res = await fetch('/api/sign-user-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      const passkey = await res.json()
      if (passkey.success) {
        console.log("Valid")
      } else {
        console.error("Invalid")
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/** CATEGORIES */

export const GetCategories = async () => {
  const categoriesContent = await getDoc(categoriesDoc)
  const exists = categoriesContent.exists()

  if (exists) {
    return categoriesContent.data() as CategoriesDoc
  } else {
    const data: CategoriesDoc = {
      categories: [{
        id: "critical",
        content: "critical",
        icon: DEFAULT_ICON
      }]
    }
    await setDoc(categoriesDoc, data)
    return data
  }
}

export const UpdateCategories = async (categories: CategoriesDoc) => {
  await updateDoc(categoriesDoc, categories)
}

/** ICONS */

export const GetIcons = async () => {
  const icons = await getDoc(iconsDoc)
  const exists = icons.exists()

  if (exists) {
    return icons.data() as IconsDoc
  } else {
    const data: IconsDoc = {
      icons: [{
        name: DEFAULT_ICON,
        color: "#ff3838"
      }]
    }
    await setDoc(iconsDoc, data)
    return data
  }
}

export const UpdateIcons = async (icons: IconsDoc) => {
  await updateDoc(iconsDoc, icons)
}