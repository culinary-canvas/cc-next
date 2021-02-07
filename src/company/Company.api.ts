import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { CompanyModel } from './Company.model'
import { StorageService } from '../services/storage/Storage.service'
import { CompanyService } from './Company.service'
import slugify from 'voca/slugify'

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

  static async byIds(ids: string[]): Promise<CompanyModel[]> {
    return (await Promise.all(ids.map(async (id) => this.byId(id)))).filter(
      (m) => !!m,
    )
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

  static async existsBySlug(slug: string) {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .where('slug', '==', slug)
      .get()
    return !response.empty
  }

  static async save(
    company: CompanyModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { firestore } = initFirebase()

    onProgress(0.05)
    ModelService.beforeSave(company, userId)
    company.slug = slugify(company.name)
    CompanyService.ensureHttpInUrls(company)

    onProgress(0.1, 'Validating')
    if (!(await CompanyService.validate(company))) {
      throw new Error(
        "Duplicate not allowed. There's already a company in the database with the same name/slug",
      )
    }

    if (!!company.image) {
      onProgress(0.25, 'Uploading images')
      await this.uploadNewImages(company, onProgress)
    }

    onProgress(0.8)
    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(CompanyModel))

    const doc = !!company.id
      ? collectionRef.doc(company.id)
      : collectionRef.doc()
    await doc.set(company)

    onProgress(1, 'Done!')
    return doc.id
  }

  static async delete(
    company: CompanyModel,
    userId: string,
    onProgress?: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    onProgress(
      initialProgress,
      `Deleting ${company.name || 'company with no name'}`,
    )
    const { firestore } = initFirebase()
    onProgress(0.5, '')
    await firestore().collection(this.COLLECTION).doc(company.id).delete()
    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }

  private static async uploadNewImages(
    company: CompanyModel,
    onProgress: (progress: number, message: string) => any,
  ) {
    if (StorageService.isLocal(company.image.cropped.url)) {
      company.image.cropped.url = await StorageService.storeFileFromLocalUrl(
        company.image.cropped.url,
        company.image.cropped.fileName,
        `companies/${company.id}`,
        (p) => onProgress(0.25 + p * 0.25, 'Uploading cropped image'),
      )
    }

    if (StorageService.isLocal(company.image.original.url)) {
      company.image.original.url = await StorageService.storeFileFromLocalUrl(
        company.image.original.url,
        company.image.original.fileName,
        `companies/${company.id}`,
        (p) => onProgress(0.5 + p * 0.25, 'Uploading original image'),
      )
    }
  }
}
