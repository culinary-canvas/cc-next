import { ArticleApi } from '../../article/Article.api'
import { Transformer } from '../db/Transformer'
import { ArticleModel } from '../../article/Article.model'
import { TagModel } from '../../tag/Tag.model'
import { TagApi } from '../../tag/Tag.api'
import firebase from 'firebase/app'

export async function changeArticleTagIdsToTagNames(user: firebase.User) {
  const articles = Transformer.allToApp(await ArticleApi.all(), ArticleModel)
  const tags = Transformer.allToApp(await TagApi.all(), TagModel)

  articles.forEach(
    (a) =>
      (a.tagNames = tags
        .filter((t) => a.tagIds.includes(t.id))
        .map((t) => t.name)),
  )

  return Promise.all(articles.map(async (a) => ArticleApi.save(a, user)))
}
