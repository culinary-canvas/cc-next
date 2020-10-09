import { ArticleApi } from '../../domain/Article/Article.api'
import { Transformer } from '../db/Transformer'
import { Article } from '../../domain/Article/Article'
import { Tag } from '../../domain/Tag/Tag'
import { TagApi } from '../../domain/Tag/Tag.api'

export async function changeArticleTagIdsToTagNames(user) {
  const articles = Transformer.allToApp(await ArticleApi.all(), Article)
  const tags = Transformer.allToApp(await TagApi.all(), Tag)

  articles.forEach(
    (a) =>
      (a.tagNames = tags
        .filter((t) => a.tagIds.includes(t.id))
        .map((t) => t.name)),
  )

  return Promise.all(articles.map(async (a) => ArticleApi.save(a, user)))
}
