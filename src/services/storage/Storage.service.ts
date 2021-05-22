import 'firebase/storage'
import { initFirebase } from '../firebase/Firebase'

export class StorageService {
  static async storeFile(
    file: File,
    contentType: string,
    path?: string,
    progressCallback?: (progress: number) => any,
  ): Promise<string> {
    const { storage } = initFirebase()

    const uploadTask = storage()
      .ref()
      .child(`${path}/${file.name}`)
      .put(file, { contentType })

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>
          !!progressCallback &&
          progressCallback(snapshot.bytesTransferred / snapshot.totalBytes),
        (error) => reject(error),
        async () => resolve(await uploadTask.snapshot.ref.getDownloadURL()),
      )
    })
  }

  static async storeFileFromLocalUrl(
    localUrl: string,
    fileName: string,
    path?: string,
    progressCallback?: (progress: number) => any,
  ) {
    const result = await fetch(localUrl)
    const blob = await result.blob()
    const file = new File([blob], fileName)
    return StorageService.storeFile(file, blob.type, path, progressCallback)
  }

  static isRemote(url: string) {
    return (
      !!url &&
      (url.substring(0, 8) === 'https://' || url.substring(0, 7) === 'http://')
    )
  }

  static isLocal(url: string) {
    if (!url) {
      return false
    }
    return !this.isRemote(url)
  }

  static isThisStorage(url: string) {
    return url.includes(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  }
}
