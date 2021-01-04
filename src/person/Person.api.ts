import { Transformer } from '../services/db/Transformer'
import { ModelService } from '../services/db/Model.service'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
import { PersonModel } from './Person.model'

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

  static async save(
    person: PersonModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { firestore } = initFirebase()

    onProgress(0.33)
    ModelService.beforeSave(person, userId)
    console.log(person)
    onProgress(0.66)
    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(PersonModel))

    const doc = !!person.id ? collectionRef.doc(person.id) : collectionRef.doc()
    await doc.set(person)
    console.log(doc)
    onProgress(1, 'Done!')
    return doc.id
  }

  static async delete(
    person: PersonModel,
    userId: string,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${person.name || 'person with no name'}`)
    const { firestore } = initFirebase()
    onProgress(0.5, '')
    await firestore().collection(this.COLLECTION).doc(person.id).delete()
    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }
}
