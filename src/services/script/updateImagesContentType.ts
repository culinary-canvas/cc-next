import { ArticleApi } from '../../article/Article.api'
import { initFirebase } from '../firebase/Firebase'
import { ImageFile } from '../../image/models/ImageFile'
import firebase from 'firebase/app'
import { StorageService } from '../storage/Storage.service'
import { ArticleModel } from '../../article/models/Article.model'
import { FileService } from '../file/FileService'

export async function updateImagesContentType(userId: string) {
  const storage = initFirebase().storage()
  const articles = await ArticleApi.all()
  for (let article of articles) {
    for (let imageContent of article.imageContents) {
      if (
        !!imageContent.set.original?.fileName &&
        StorageService.isThisStorage(imageContent.set.original?.url)
      ) {
        await update(imageContent.set.original, article, storage)
      }
      if (
        !!imageContent.set.image?.fileName &&
        StorageService.isThisStorage(imageContent.set.image?.url)
      ) {
        await update(imageContent.set.image, article, storage)
      }
    }

    if (
      !!article.preview.imageSet?.original?.fileName &&
      StorageService.isThisStorage(article.preview.imageSet.original?.url)
    ) {
      await update(article.preview.imageSet.original, article, storage)
    }

    if (
      !!article.preview.imageSet?.image?.fileName &&
      StorageService.isThisStorage(article.preview.imageSet.original?.url)
    ) {
      await update(article.preview.imageSet.image, article, storage)
    }
  }
  console.log('Done!')
}

async function update(
  image: ImageFile,
  article: ArticleModel,
  storage: firebase.storage.Storage,
) {
  try {
    const contentType = FileService.getContentType(image.url)
    if (!!contentType) {
      const imageRef = storage.refFromURL(image.url)

      const currentContentType = (await imageRef.getMetadata()).contentType
      const alreadySet = Object.values(FileService.CONTENT_TYPES).includes(
        currentContentType,
      )
      if (alreadySet) {
        console.debug(`${image.url} is already set to ${currentContentType}`)
        return
      }

      console.log(
        `setting contentType ${contentType} for image ${image.url} (had ${currentContentType}`,
      )
      await imageRef.updateMetadata({ contentType })
    } else {
      console.warn("couldn't figure this one out...", image.url)
    }
  } catch (e) {
    console.warn('problems with', image)
    console.error(e)
  }
}
