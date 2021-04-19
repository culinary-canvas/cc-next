import 'firebase/storage'
import { initFirebase } from '../firebase/Firebase'

export class StorageService {
  static async storeFile(
    file: File,
    path?: string,
    progressCallback?: (progress: number) => any,
  ): Promise<string> {
    const { storage } = initFirebase()

    const uploadTask = storage().ref().child(`${path}/${file.name}`).put(file)

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>
          !!progressCallback &&
          progressCallback(snapshot.bytesTransferred / snapshot.totalBytes),
        (error) => reject(error),
        () => resolve(uploadTask.snapshot.ref.getDownloadURL()),
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
    console.log('storing file', file, path)
    return StorageService.storeFile(file, path, progressCallback)
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
}
