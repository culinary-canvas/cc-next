import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { PersonModel } from './models/Person.model'
import { StorageService } from '../services/storage/Storage.service'
import { DocumentChange } from '@firebase/firestore-types'
import { PersonService } from './Person.service'
import slugify from 'voca/slugify'

export class PersonApi {
  private static readonly COLLECTION = 'persons'

  static async byId(id: string): Promise<PersonModel> {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))
      .doc(id)
      .get()
    return response.exists ? response.data() : null
  }

  static async byIds(ids: string[]): Promise<PersonModel[]> {
    return (await Promise.all(ids.map(async (id) => this.byId(id)))).filter(
      (m) => !!m,
    )
  }

  static async byCompanyId(companyId: string) {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))
      .where('companyId', '==', companyId)
      .get()
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async all(): Promise<PersonModel[]> {
    const { firestore } = initFirebase()

    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))
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

  static subscribeAll(
    onChange: (changes: DocumentChange<PersonModel>[]) => any,
  ): () => void {
    const { firestore } = initFirebase()
    return firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))
      .onSnapshot((querySnapshot) => {
        onChange(querySnapshot.docChanges())
      })
  }

  static async bySlug(slug: string): Promise<PersonModel[]> {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))
      .where('slug', '==', slug)
      .get()
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(
    person: PersonModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { firestore } = initFirebase()

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
    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))

    const doc = !!person.id ? collectionRef.doc(person.id) : collectionRef.doc()
    await doc.set(person)

    onProgress(1, 'Done!')
    return doc.id
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
    const { firestore } = initFirebase()
    onProgress(0.5, '')
    await firestore().collection(this.COLLECTION).doc(person.id).delete()
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
