import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { isLocal } from './config'
import { auth, db, storage } from "./firebase"

const NOTES = "notes"

const notesCollection = collection(db, NOTES)

export const UploadFile = async (file: File) => {
  const array = file.name.split(".")
  const ext = array.pop()
  const name = array.join(".")
  const fileName = array.length !== 0 ? `${name}.${ext}` : file.name

  const imageRef = ref(storage, `${NOTES}/${fileName}`)
  const res = await uploadBytes(imageRef, file)
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

export const AddNote = async (content: string, files: File[]) => {
  const fileUrls = await Promise.all(
    files.map(async file => {
      const url = await UploadFile(file)
      return url
    })
  )

  const res = await addDoc(notesCollection, {
    content,
    files: fileUrls,
    isPublic: !isLocal,
    timestamp: Date.now()
  })

  return res
}

export const UpdateNote = async (noteId: string, updatedNote: UpdateNoteFields) => {
  const noteRef = doc(db, NOTES, noteId)

  await updateDoc(noteRef, {
    ...updatedNote,
    timestamp: Date.now()
  });
}

export const UpdateCompleteNote = async (noteId: string, content: string, filesToRemove: string[], prevFiles: string[], filesToUpload: File[]) => {
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
      const url = await UploadFile(file)
      return url
    })
  )

  await UpdateNote(noteId, {
    content,
    files: finalFiles.concat(newFiles)
  })
}

export const GetNotesByFilter = async (isPublic?: boolean) => {
  const q = isPublic === undefined ?
    query(notesCollection, orderBy("timestamp", "desc")) :
    query(notesCollection, where("isPublic", "==", isPublic), orderBy("timestamp", "desc"))

  const docs = await getDocs(q)
  const notes: NoteDoc[] = []
  docs.docs.map(doc => {
    const data = doc.data()
    notes.push({ ...data, id: doc.id } as NoteDoc)
  })
  return notes
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
    query(notesCollection, orderBy("timestamp", "desc")) :
    query(notesCollection, where("isPublic", "==", isPublic), orderBy("timestamp", "desc"))

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
