import { ArticleApi } from '../../article/Article.api'
import { ArticleService } from '../../article/Article.service'
import { Transformer } from '../db/Transformer'
import { ArticleModel } from '../../article/Article.model'

export async function setArticleSlug(user) {
  const articles = (await ArticleApi.all()).map((a) =>
    Transformer.toApp(a, ArticleModel),
  )
  return Promise.all(
    articles.map(async (a) => {
      a.slug = ArticleService.createSlug(a)
      await ArticleApi.save(a, user)
    }),
  )
}
