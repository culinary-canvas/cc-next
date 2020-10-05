import {Article} from './Article'
import DbService from '../../services/db/Db.service'
import {OrderBy} from '../../services/db/OrderBy'
import Where from '../../services/db/Where'

export class ArticleApi {
  private static readonly db = new DbService(Article)

  static async byId(id: string) {
    return ArticleApi.db.getById(id)
  }

  static async byTitleForUrl(titleForUrl: string) {
    const result = await ArticleApi.db.get(
      new Where('titleForUrl').is(titleForUrl),
    )
    return !!result.length ? result[0] : null
  }

  static async all(orderByField: keyof Article = 'sortOrder') {
    return ArticleApi.db.get(null, [new OrderBy(orderByField, 'desc')])
  }

  static async save(article: Article): Promise<Article> {
    return ArticleApi.db.save(article)
  }

  static async delete(id: string) {
    return ArticleApi.db.delete(id)
  }
}
