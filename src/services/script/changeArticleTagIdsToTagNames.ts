import { ArticleApi } from '../../article/Article.api'
import { TagApi } from '../../tag/Tag.api'

export async function changeArticleTagIdsToTagNames(userId: string) {
  const articles = await ArticleApi.all()
  const tags = await TagApi.all()

  articles
    .filter((a) => !a.tagNames.length)
    .forEach(
      (a) =>
        (a.tagNames = tags
          .filter((t) => a.tagIds.includes(t.id))
          .map((t) => t.name)),
    )

  return Promise.all(articles.map(async (a) => ArticleApi.save(a, userId)))
}
