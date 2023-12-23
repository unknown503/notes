import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { auth, db, storage } from "./firebase"
import { SaveOnLocalStorage, prefix } from './utils'
import { NoteDoc, UpdateNoteFields } from '@/types/notes'
import { ref as dbRef, getDatabase, onDisconnect, onValue } from "firebase/database";

const NOTES = "notes"
const NOTEPAD = "notepad"

const notesCollection = collection(db, NOTES)
const notepadDoc = doc(db, NOTEPAD, "content")

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

export const UpdateNotepad = async (content: string) => {
  await updateDoc(notepadDoc, {
    content,
    timestamp: Date.now(),
  });
}

export const UploadFile = async (file: File, isLoggedIn: boolean) => {
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
    const file = new File([blob], "image name", { type: blob.type })
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

export const AddNote = async (content: string, files: File[], isLoggedIn: boolean, offline: boolean) => {
  if (offline) {
    const id = Date.now().toString()

    const data: NoteDoc = {
      id,
      content,
      files: [],
      timestamp: Date.now(),
      isPublic: !isLoggedIn,
      isCritical: false,
      offlineSaving: true
    }

    SaveOnLocalStorage(`${prefix}-${id}`, JSON.stringify(data))
    return data
  } else {
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
      isCritical: false
    } as NoteDoc)
  }
}

export const UpdateNote = async (noteId: string, updatedNote: UpdateNoteFields) => {
  const noteRef = doc(db, NOTES, noteId)

  await updateDoc(noteRef, {
    ...updatedNote,
    timestamp: Date.now()
  });
}

export const UpdateCompleteNote = async (noteId: string, content: string, filesToRemove: string[], prevFiles: string[], filesToUpload: File[], isLoggedIn: boolean) => {
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

export const SubscribeToNotes = (callback: (docs: NoteDoc[]) => void, isPublic?: boolean) => {
  const q = isPublic === undefined ?
    query(notesCollection, orderBy("isCritical", "desc"), orderBy("timestamp", "desc")) :
    query(notesCollection, where("isPublic", "==", isPublic), orderBy("isCritical", "desc"), orderBy("timestamp", "desc"))


  const unsubscribe = onSnapshot(q, (snapshot) => {
    const changes = snapshot.docs.map(doc => {
      const data = doc.data()
      return { ...data, id: doc.id } as NoteDoc
    })
    callback(changes)
  })
  return unsubscribe
}

export const SignInUser = async (email: string, password: string) => {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  return credentials.user
}

export const SignOutUser = async () => await signOut(auth)
