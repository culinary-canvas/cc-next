import { ArticleApi } from '../../domain/Article/Article.api'
import { ArticleService } from '../../domain/Article/Article.service'

export async function setTitleForUrl() {
  const articles = await ArticleApi.all()
  return Promise.all(
    articles.map(async (a) => {
      a.titleForUrl = ArticleService.createTitleForUrl(a)
      await ArticleApi.save(a)
    }),
  )
}
