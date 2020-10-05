import { ArticleApi } from '../../domain/Article/Article.api'
import { SortableService } from '../sortable/Sortable.service'

export async function fixSortOrders() {
  const articles = await ArticleApi.all('created')
  articles.sort((a1, a2) => a1.created.compareTo(a2.created))
  SortableService.fixSortOrders(articles)
  articles.forEach((a) => {
    SortableService.fixSortOrders(a.sections)
    a.sections.forEach((s) => SortableService.fixSortOrders(s.contents))
  })
  return Promise.all(articles.map(async (a) => await ArticleApi.save(a)))
}
