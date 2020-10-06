import { Article } from './Article'
import DbService from '../../services/db/Db.service'
import { User } from 'firebase'
import { initFirebase } from '../../services/firebase/Firebase.service'
import { getFirstAsJson, getListAsJson } from '../../services/db/DbHelper'

export class ArticleApi {
  private static readonly COLLECTION = 'articles'
  private static readonly db = new DbService(Article)

  static async byId(id: string) {
    return ArticleApi.db.getById(id)
  }

  static async byTitleForUrl(titleForUrl: string): Promise<Partial<Article>> {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('titleForUrl', '==', titleForUrl)
      .get()

    return getFirstAsJson(snapshot)
  }

  static async all(
    orderByField: keyof Article = 'sortOrder',
  ): Promise<Partial<Article>[]> {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .orderBy(orderByField, 'desc')
      .get()

    return getListAsJson(snapshot)
  }

  static async save(article: Article, user: User): Promise<Article> {
    return ArticleApi.db.save(article, user)
  }

  static async delete(id: string) {
    return ArticleApi.db.delete(id)
  }
}
