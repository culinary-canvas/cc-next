import {Tag} from '../../domain/Tag/Tag'
import {TagApi} from '../../domain/Tag/Tag.api'
import {ArticleApi} from '../../domain/Article/Article.api'
import {Article} from '../../domain/Article/Article'
import {Transformer} from '../db/Transformer'

export async function deleteUnusedTags() {
  const tags = Transformer.allToApp(await TagApi.all(), Tag)
  const articles = Transformer.allToApp(await ArticleApi.all(), Article)

  const articlesWithTags = articles.filter((a) => a.tagNames.length)
  console.log(
    'articles with tags',
    articlesWithTags.map((a) => a.title),
  )

  const usedtagNames = articles.flatMap((a) => a.tagNames)
  console.log('used tag names', usedtagNames)

  const unusedTags = tags.filter((t) => !usedtagNames.includes(t.name))
  console.log(
    'unused tags',
    unusedTags.map((t) => t.name),
  )

  const usedTags = tags.filter((t) => usedtagNames.includes(t.name))
  console.log(
    'used tags',
    usedTags.map((t) => t.name),
  )

  await Promise.all(unusedTags.map(async (t) => TagApi.delete(t.id)))
}
