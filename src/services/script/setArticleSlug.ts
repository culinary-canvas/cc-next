import { ArticleApi } from '../../article/Article.api'
import { ArticleService } from '../../article/Article.service'

export async function setArticleSlug(user) {
  const articles = await ArticleApi.all()
  return Promise.all(
    articles.map(async (a) => {
      a.slug = ArticleService.createSlug(a)
      await ArticleApi.save(a, user)
    }),
  )
}
