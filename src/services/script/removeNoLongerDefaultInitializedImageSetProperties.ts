import ArticleApi from '../../article/Article.api'
import { ArticleModel } from '../../article/models/Article.model'
import { toJS } from 'mobx'

export async function removeNoLongerDefaultInitializedImageSetProperties(
  userId: string,
) {
  const articles = await ArticleApi.all()
  for (let article of articles) {
    await updateArticle(article, userId)
  }
  console.log('Done!')
}

async function updateArticle(article: ArticleModel, userId: string) {
  console.group(article.title)
  let updated: boolean
  updated = clearContents(article)
  updated = clearPreview(article) || updated
  if (updated) {
    console.log(`Article ${article.title} updated. Saving...`, toJS(article))
    await ArticleApi.save(article, userId)
  }
  console.groupEnd()
}

function clearContents(article: ArticleModel): boolean {
  let updated = false
  article.imageContents
    .filter(
      (c) =>
        !c.set.original?.fileName &&
        !c.set.cropped?.fileName &&
        !c.set.image?.fileName,
    )
    .forEach((c) => {
      console.log(`Clearing content of ${c.name}...`)
      c.set.original = null
      c.set.image = null
      c.set.cropped = null
      updated = true
    })
  return updated
}

function clearPreview(article: ArticleModel): boolean {
  if (!!article.preview.image && !article.preview.image?.original?.fileName) {
    console.log('Clearing preview')
    article.preview.image = null
    return true
  }
  return false
}
