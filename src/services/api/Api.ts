import * as firebase from 'firebase'
import { User } from 'firebase'
import { Transformer } from '../db/Transformer'
import { initFirebase } from '../firebase/Firebase.service'
import { Model } from '../db/Model'
import type { PlainObject } from '../../types/PlainObject'
import { ModelService } from '../db/Model.service'
import { getCollection } from '../db/decorators/collection.decorator'

export class Api {
  static async byId<T extends Model>(
    id: string,
    collection: string,
  ): Promise<PlainObject<T>> {
    const { firestore } = initFirebase()

    const doc: firebase.firestore.DocumentSnapshot = await firestore()
      .collection(collection)
      .doc(id)
      .get()

    if (doc.exists) {
      return Transformer.toJson(doc)
    }
  }

  static async all<T extends Model>(
    collection: string,
    orderByField?: keyof T,
    orderDirection: 'asc' | 'desc' = 'asc',
  ): Promise<PlainObject<T>[]> {
    const { firestore } = initFirebase()

    const collectionRef = firestore().collection(collection)
    if (orderByField) {
      collectionRef.orderBy(orderByField as string, orderDirection)
    }
    const snapshot = await collectionRef.get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async save<T extends Model>(model: T, user: User): Promise<string> {
    const { firestore } = initFirebase()

    ModelService.beforeSave(model, user)

    const collection = getCollection(model).name
    const collectionRef = firestore().collection(collection)
    const doc = model.id ? collectionRef.doc(model.id) : collectionRef.doc()

    const dbObject = Transformer.toDb(model)
    await doc.set(dbObject)
    return doc.id
  }

  static async delete(id: string, collection: string): Promise<void> {
    const { firestore } = initFirebase()
    return firestore().collection(collection).doc(id).delete()
  }
}
