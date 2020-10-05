import { ArticleApi } from '../../domain/Article/Article.api'
import { TagApi } from '../../domain/Tag/Tag.api'

export async function deleteUnusedTags() {
  const tags = await TagApi.all()
  const articles = await ArticleApi.all('id')

  const articlesWithTags = articles.filter((a) => a.tagIds.length)
  console.log(
    'articles with tags',
    articlesWithTags.map((a) => a.title),
  )

  const usedTagIds = articles.flatMap((a) => a.tagIds)
  console.log('used tag ids', usedTagIds)

  const unusedTags = tags.filter((t) => !usedTagIds.includes(t.id))
  console.log(
    'unused tags',
    unusedTags.map((t) => t.name),
  )

  const usedTags = tags.filter((t) => usedTagIds.includes(t.id))
  console.log(
    'used tags',
    usedTags.map((t) => t.name),
  )

  await Promise.all(unusedTags.map(async (t) => TagApi.delete(t.id)))
}
