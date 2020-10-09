import { ArticleApi } from '../../domain/Article/Article.api'
import { ArticleService } from '../../domain/Article/Article.service'
import { Transformer } from '../db/Transformer'
import { Article } from '../../domain/Article/Article'

export async function setArticleSlug(user) {
  const articles = (await ArticleApi.all()).map((a) =>
    Transformer.toApp(a, Article),
  )
  return Promise.all(
    articles.map(async (a) => {
      a.slug = ArticleService.createSlug(a)
      await ArticleApi.save(a, user)
    }),
  )
}
