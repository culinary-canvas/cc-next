import { User } from 'firebase'
import { initFirebase } from '../../services/firebase/Firebase.service'
import { Api } from '../../services/api/Api'
import { PlainObject } from '../../types/PlainObject'
import { Transformer } from '../../services/db/Transformer'
import { Tag } from './Tag'

export class TagApi {
  private static readonly COLLECTION = 'tags'

  static async byId(id: string) {
    return Api.byId(id, this.COLLECTION)
  }

  static async byIdIn(ids: string[]) {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('id', 'in', ids)
      .get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async all(): Promise<PlainObject<Tag>[]> {
    return Api.all(this.COLLECTION)
  }

  static async save(tag: Tag, user: User): Promise<string> {
    return Api.save(tag, user)
  }

  static async delete(id: string): Promise<void> {
    return Api.delete(id, this.COLLECTION)
  }
}
