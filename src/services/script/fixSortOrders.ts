import { ArticleApi } from '../../article/Article.api'
import { SortableService } from '../sortable/Sortable.service'
import { User } from 'firebase'
import { Transformer } from '../db/Transformer'
import { ArticleModel } from '../../article/Article.model'

export async function fixSortOrders(user: User) {
  const articles = Transformer.allToApp(await ArticleApi.all(), ArticleModel)
  articles.sort((a1, a2) => a1.created.compareTo(a2.created))
  SortableService.fixSortOrders(articles)
  return Promise.all(articles.map(async (a) => await ArticleApi.save(a, user)))
}
