import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { IssueModel } from './models/Issue.model'
import { ModelService } from '../services/db/Model.service'
import { Transformer } from '../services/db/Transformer'
import { firebase } from '../services/firebase/Firebase'
import { StorageService } from '../services/storage/Storage.service'
import { IssueService } from './Issue.service'

export class IssueApi {
  static readonly COLLECTION = 'issues'

  static async byId(id: string): Promise<IssueModel> {
    const { db } = firebase()
    const response = await getDoc(
      doc(db, this.COLLECTION, id).withConverter(
        Transformer.firestoreConverter(IssueModel),
      ),
    )
    return response.exists ? response.data() : null
  }

  static async byIds(ids: string[]): Promise<IssueModel[]> {
    return (await Promise.all(ids.map(async (id) => this.byId(id)))).filter(
      (m) => !!m,
    )
  }

  static async all(): Promise<IssueModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      collection(db, this.COLLECTION).withConverter(
        Transformer.firestoreConverter(IssueModel),
      ),
    )
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async allNoTransform(): Promise<{ [key: string]: any }[]> {
    const { db } = firebase()
    const response = await getDocs(collection(db, this.COLLECTION))
    return !!response.size
      ? response.docs.map((d) => ({ id: d.id, ...d.data() }))
      : []
  }

  static async save(
    issue: IssueModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { db } = firebase()

    onProgress(0.05)
    ModelService.beforeSave(issue, userId)

    onProgress(0.1, 'Validating')
    if (!(await IssueService.validate(issue))) {
      throw new Error(
        "Duplicate not allowed. There's already an issue in the database for that year and month",
      )
    }

    if (!!issue.imageSet) {
      onProgress(0.25, 'Uploading images')
      await this.uploadNewImages(issue, onProgress)
    }

    onProgress(0.8)
    let ref: DocumentReference
    if (!!issue.id) {
      ref = doc(db, this.COLLECTION, issue.id).withConverter(
        Transformer.firestoreConverter(IssueModel),
      )
      await setDoc(ref, issue)
    } else {
      const collRef = collection(db, this.COLLECTION).withConverter(
        Transformer.firestoreConverter(IssueModel),
      )
      ref = await addDoc(collRef, issue)
    }

    onProgress(1, 'Done!')
    return ref.id
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }

  private static async uploadNewImages(
    issue: IssueModel,
    onProgress: (progress: number, message: string) => any,
  ) {
    if (StorageService.isLocal(issue.imageSet.image.url)) {
      issue.imageSet.image.url = await StorageService.storeFileFromLocalUrl(
        issue.imageSet.image.url,
        issue.imageSet.image.fileName,
        `issues/${issue.id}`,
        (p) => onProgress(0.25 + p * 0.25, 'Uploading cropped image'),
      )
    }

    if (StorageService.isLocal(issue.imageSet.original.url)) {
      issue.imageSet.original.url = await StorageService.storeFileFromLocalUrl(
        issue.imageSet.original.url,
        issue.imageSet.original.fileName,
        `issues/${issue.id}`,
        (p) => onProgress(0.5 + p * 0.25, 'Uploading original image'),
      )
    }
  }
}
