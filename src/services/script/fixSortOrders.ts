import { ArticleApi } from '../../article/Article.api'
import { SortableService } from '../sortable/Sortable.service'

export async function fixSortOrders(userId: string) {
  const articles = await ArticleApi.all()
  articles.sort((a1, a2) => a1.created.getTime() - a2.created.getTime())
  SortableService.fixSortOrders(articles)
  return Promise.all(
    articles.map(async (a) => await ArticleApi.save(a, userId)),
  )
}
