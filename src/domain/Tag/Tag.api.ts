import DbService from '../../services/db/Db.service'
import { Tag } from './Tag'
import { User } from 'firebase'
import { initFirebase } from '../../services/firebase/Firebase.service'
import { getFirstAsJson, getListAsJson } from '../../services/db/DbHelper'

export class TagApi {
  private static readonly COLLECTION = 'tags'
  private static readonly db = new DbService(Tag)

  static async byId(id: string) {
    return this.db.getById(id)
  }

  static async byIdIn(ids: string[]) {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('id', 'in', ids)
      .orderBy('name')
      .get()

    return getFirstAsJson(snapshot)
  }

  static async all(): Promise<Partial<Tag>[]> {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .orderBy('name')
      .get()

    return getListAsJson(snapshot)
  }

  static async save(tag: Tag, user: User): Promise<Tag> {
    return this.db.save(tag, user)
  }

  static async delete(id: string) {
    return this.db.delete(id)
  }
}
