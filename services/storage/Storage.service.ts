import firebase from 'firebase/app'
import 'firebase/storage'

export class StorageService {
  static async storeFile(
    file: File,
    path?: string,
    progressCallback?: (progress: number) => any,
  ): Promise<string> {
    const uploadTask = firebase
      .storage()
      .ref()
      .child(`${path}/${file.name}`)
      .put(file)

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
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
    return StorageService.storeFile(file, path, progressCallback)
  }

  static isRemote(url: string) {
    return (
      !!url &&
      (url.substring(0, 8) === 'https://' || url.substring(0, 7) === 'http://')
    )
  }

  static isLocal(url: string) {
    return !this.isRemote(url)
  }
}
