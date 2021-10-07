import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { firebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { PersonModel } from './models/Person.model'
import { StorageService } from '../services/storage/Storage.service'
import { PersonService } from './Person.service'
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

export class PersonApi {
  private static readonly COLLECTION = 'persons'

  static async byId(id: PersonModel['id']): Promise<PersonModel> {
    const { db } = firebase()
    const response = await getDoc(
      doc(db, this.COLLECTION, id).withConverter(
        Transformer.firestoreConverter(PersonModel),
      ),
    )
    return response.exists ? response.data() : null
  }

  static async byIds(ids: string[]): Promise<PersonModel[]> {
    return (await Promise.all(ids.map(async (id) => this.byId(id)))).filter(
      (m) => !!m,
    )
  }

  static async byCompanyId(companyId: PersonModel['companyId']) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(PersonModel),
        ),
        where('companyId', '==', companyId),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async all(): Promise<PersonModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      collection(db, this.COLLECTION).withConverter(
        Transformer.firestoreConverter(PersonModel),
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

  static async bySlug(slug: string): Promise<PersonModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(PersonModel),
        ),
        where('slug', '==', slug),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(
    person: PersonModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { db } = firebase()

    onProgress(0.05)
    ModelService.beforeSave(person, userId)
    person.slug = slugify(person.name)
    PersonService.ensureHttpInUrls(person)

    onProgress(0.1, 'validating')
    if (!(await PersonService.validate(person))) {
      throw new Error(
        "Duplicate not allowed. There's already a person in the database with the same name/slug",
      )
    }

    if (!!person.imageSet) {
      onProgress(0.25, 'Uploading images')
      await this.uploadNewImages(person, onProgress)
    }

    onProgress(0.8)
    const ref = doc(db, this.COLLECTION, person?.id).withConverter(
      Transformer.firestoreConverter(PersonModel),
    )
    await setDoc(ref, person)
    onProgress(1, 'Done!')
    return ref.id
  }

  static async delete(
    person: PersonModel,
    userId: string,
    onProgress?: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    onProgress(
      initialProgress,
      `Deleting ${person.name || 'person with no name'}`,
    )
    const { db } = firebase()
    onProgress(0.5, '')
    await deleteDoc(doc(db, this.COLLECTION, person.id))
    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }

  private static async uploadNewImages(
    person: PersonModel,
    onProgress: (progress: number, message: string) => any,
  ) {
    if (StorageService.isLocal(person.imageSet.image.url)) {
      person.imageSet.image.url = await StorageService.storeFileFromLocalUrl(
        person.imageSet.image.url,
        person.imageSet.image.fileName,
        `persons/${person.id}`,
        (p) => onProgress(0.25 + p * 0.25, 'Uploading cropped image'),
      )
    }

    if (StorageService.isLocal(person.imageSet.original.url)) {
      person.imageSet.original.url = await StorageService.storeFileFromLocalUrl(
        person.imageSet.original.url,
        person.imageSet.original.fileName,
        `persons/${person.id}`,
        (p) => onProgress(0.5 + p * 0.25, 'Uploading original image'),
      )
    }
  }
}
