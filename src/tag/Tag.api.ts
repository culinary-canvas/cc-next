import { TagModel } from './Tag.model'
import { Transformer } from '../services/db/Transformer'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'

export class TagApi {
  private static readonly COLLECTION = 'tags'

  static async byId(id: string): Promise<TagModel> {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter<TagModel>(Transformer.firestoreConverter(TagModel))
      .doc(id)
      .get()
    return response.exists ? response.data() : null
  }
  static async all(): Promise<TagModel[]> {
    const { firestore } = initFirebase()

    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter<TagModel>(Transformer.firestoreConverter(TagModel))
      .get()

    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(tag: TagModel, userId: string): Promise<string> {
    const { firestore } = initFirebase()

    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(TagModel))

    const doc = !!tag.id ? collectionRef.doc(tag.id) : collectionRef.doc()

    await doc.set(tag)
    return doc.id
  }

  static async delete(tag: TagModel) {
    const { firestore } = initFirebase()
    await firestore().collection(this.COLLECTION).doc(tag.id).delete()
  }
}
