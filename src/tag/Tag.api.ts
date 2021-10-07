import { TagModel } from './models/Tag.model'
import { Transformer } from '../services/db/Transformer'
import { firebase } from '../services/firebase/Firebase'
import 'firebase/firestore'
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
import { ModelService } from '../services/db/Model.service'

export class TagApi {
  private static readonly COLLECTION = 'tags'

  static async byId(id: string): Promise<TagModel> {
    const { db } = firebase()
    const response = await getDoc(
      doc(db, this.COLLECTION, id).withConverter<TagModel>(
        Transformer.firestoreConverter(TagModel),
      ),
    )
    return response.exists ? response.data() : null
  }
  static async all(): Promise<TagModel[]> {
    const { db } = firebase()
    const response = await getDocs(
      collection(db, this.COLLECTION).withConverter<TagModel>(
        Transformer.firestoreConverter(TagModel),
      ),
    )
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(tag: TagModel, userId: string): Promise<string> {
    const { db } = firebase()
    ModelService.beforeSave(tag, userId)
    const ref = doc(db, this.COLLECTION, tag?.id).withConverter(
      Transformer.firestoreConverter(TagModel),
    )
    await setDoc(ref, tag)
    return ref.id
  }

  static async delete(tag: TagModel) {
    const { db } = firebase()
    await deleteDoc(doc(db, this.COLLECTION, tag.id))
  }

  static async existsByName(name: string): Promise<boolean> {
    const { db } = firebase()
    const response = await getDocs(
      query(collection(db, this.COLLECTION), where('name', '==', name)),
    )
    return !response.empty
  }
}
