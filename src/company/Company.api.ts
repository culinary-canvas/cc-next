import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { CompanyModel } from './Company.model'

export class CompanyApi {
  private static readonly COLLECTION = 'companies'

  static async byId(id: string): Promise<CompanyModel> {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(CompanyModel))
      .doc(id)
      .get()
    return response.exists ? response.data() : null
  }

  static async all(): Promise<CompanyModel[]> {
    const { firestore } = initFirebase()

    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(CompanyModel))
      .get()

    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async allNoTransform(): Promise<{ [key: string]: any }[]> {
    const { firestore } = initFirebase()

    const response = await firestore().collection(this.COLLECTION).get()

    return !!response.size
      ? response.docs.map((d) => ({ id: d.id, ...d.data() }))
      : []
  }

  static async save(
    company: CompanyModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { firestore } = initFirebase()

    onProgress(0.33)
    ModelService.beforeSave(company, userId)
    console.log(company)
    onProgress(0.66)
    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(CompanyModel))

    const doc = !!company.id
      ? collectionRef.doc(company.id)
      : collectionRef.doc()
    await doc.set(company)
    console.log(doc)
    onProgress(1, 'Done!')
    return doc.id
  }

  static async delete(
    company: CompanyModel,
    userId: string,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${company.name || 'company with no name'}`)
    const { firestore } = initFirebase()
    onProgress(0.5, '')
    await firestore().collection(this.COLLECTION).doc(company.id).delete()
    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }
}
