import { ArticleApi } from '../../article/Article.api'
import { ImageFile } from '../../image/models/ImageFile'
import { StorageService } from '../storage/Storage.service'
import {
  FirebaseStorage,
  getMetadata,
  ref,
  updateMetadata,
} from 'firebase/storage'
import { FileService } from '../file/FileService'
import { PersonApi } from '../../person/Person.api'
import { CompanyApi } from '../../company/Company.api'
import { firebase } from '../firebase/Firebase'

export async function updateImagesContentType(userId: string) {
  const { storage } = firebase()
  const articles = await ArticleApi.all()
  for (let article of articles) {
    for (let imageContent of article.imageContents) {
      if (
        !!imageContent.set.original?.fileName &&
        StorageService.isThisStorage(imageContent.set.original?.url)
      ) {
        await update(imageContent.set.original, storage)
      }
      if (
        !!imageContent.set.image?.fileName &&
        StorageService.isThisStorage(imageContent.set.image?.url)
      ) {
        await update(imageContent.set.image, storage)
      }
    }

    if (
      !!article.preview.imageSet?.original?.fileName &&
      StorageService.isThisStorage(article.preview.imageSet.original?.url)
    ) {
      await update(article.preview.imageSet.original, storage)
    }

    if (
      !!article.preview.imageSet?.image?.fileName &&
      StorageService.isThisStorage(article.preview.imageSet.original?.url)
    ) {
      await update(article.preview.imageSet.image, storage)
    }
  }

  const persons = await PersonApi.all()
  for (let person of persons) {
    if (
      !!person.imageSet.original?.fileName &&
      StorageService.isThisStorage(person.imageSet.original?.url)
    ) {
      await update(person.imageSet.original, storage)
    }
    if (
      !!person.imageSet.image?.fileName &&
      StorageService.isThisStorage(person.imageSet.image?.url)
    ) {
      await update(person.imageSet.image, storage)
    }
  }

  const companies = await CompanyApi.all()
  for (let company of companies) {
    if (
      !!company.imageSet.original?.fileName &&
      StorageService.isThisStorage(company.imageSet.original?.url)
    ) {
      await update(company.imageSet.original, storage)
    }
    if (
      !!company.imageSet.image?.fileName &&
      StorageService.isThisStorage(company.imageSet.image?.url)
    ) {
      await update(company.imageSet.image, storage)
    }
  }
  console.log('Done!')
}

async function update(image: ImageFile, storage: FirebaseStorage) {
  try {
    const contentType = FileService.getContentType(image.url)
    if (!!contentType) {
      const imageRef = ref(storage, image.url)

      const currentContentType = (await getMetadata(imageRef)).contentType
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
      await updateMetadata(imageRef, { contentType })
    } else {
      console.warn("couldn't figure this one out...", image.url)
    }
  } catch (e) {
    console.warn('problems with', image)
    console.error(e)
  }
}
