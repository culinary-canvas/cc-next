import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { firebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { CompanyModel } from './models/Company.model'
import { StorageService } from '../services/storage/Storage.service'
import { CompanyService } from './Company.service'
import slugify from 'voca/slugify'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'

export class CompanyApi {
  static readonly COLLECTION = 'companies'

  static async byId(id: string): Promise<CompanyModel> {
    const { db } = firebase()
    const response = await getDoc(
      doc(db, this.COLLECTION, id).withConverter(
        Transformer.firestoreConverter(CompanyModel),
      ),
    )
    return response.exists ? response.data() : null
  }

  static async byIds(ids: string[]): Promise<CompanyModel[]> {
    return (await Promise.all(ids.map(async (id) => this.byId(id)))).filter(
      (m) => !!m,
    )
  }

  static async all(): Promise<CompanyModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      collection(db, this.COLLECTION).withConverter(
        Transformer.firestoreConverter(CompanyModel),
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

  static async bySlug(slug: string): Promise<CompanyModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(CompanyModel),
        ),
        where('slug', '==', slug),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(
    company: CompanyModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { db } = firebase()

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

    if (!!company.imageSet) {
      onProgress(0.25, 'Uploading images')
      await this.uploadNewImages(company, onProgress)
    }

    onProgress(0.8)
    const ref = doc(db, this.COLLECTION, company?.id).withConverter(
      Transformer.firestoreConverter(CompanyModel),
    )
    await setDoc(ref, company)
    onProgress(1, 'Done!')
    return ref.id
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
    const { db } = firebase()
    onProgress(0.5, '')
    await deleteDoc(doc(db, this.COLLECTION, company.id))
    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }

  private static async uploadNewImages(
    company: CompanyModel,
    onProgress: (progress: number, message: string) => any,
  ) {
    if (StorageService.isLocal(company.imageSet.image.url)) {
      company.imageSet.image.url = await StorageService.storeFileFromLocalUrl(
        company.imageSet.image.url,
        company.imageSet.image.fileName,
        `companies/${company.id}`,
        (p) => onProgress(0.25 + p * 0.25, 'Uploading cropped image'),
      )
    }

    if (StorageService.isLocal(company.imageSet.original.url)) {
      company.imageSet.original.url =
        await StorageService.storeFileFromLocalUrl(
          company.imageSet.original.url,
          company.imageSet.original.fileName,
          `companies/${company.id}`,
          (p) => onProgress(0.5 + p * 0.25, 'Uploading original image'),
        )
    }
  }
}
