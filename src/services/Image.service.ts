import { ImageCropValues } from '../image/models/ImageCropValues'
import { ImageFile } from '../image/models/ImageFile'
import { FileService } from './file/FileService'

export class ImageService {
  static async getImageElement(url: string) {
    const imageEl = new Image()
    imageEl.crossOrigin = 'anonymous'

    let resolver
    const promise = new Promise<HTMLImageElement>(
      (resolve) => (resolver = resolve),
    )
    imageEl.onload = () => {
      resolver()
    }
    imageEl.src = url

    await promise
    return imageEl
  }

  static async crop(
    image: ImageFile,
    cropValues: ImageCropValues,
  ): Promise<ImageFile> {
    const cropUrl = await this.getCroppedUrl(image, cropValues)
    const cropFile = await FileService.getFile(
      cropUrl,
      `cropped_${image.fileName}`,
      image.mimeType,
    )
    return await this.getImage(cropFile)
  }

  private static async getCroppedUrl(image: ImageFile, crop: ImageCropValues) {
    const x = (crop.x / 100) * image.width
    const y = (crop.y / 100) * image.height
    const width = (crop.width / 100) * image.width
    const height = (crop.height / 100) * image.height
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = Math.ceil(width)
    tmpCanvas.height = Math.ceil(height)

    const ctx = tmpCanvas.getContext('2d')
    const imageEl = await this.getImageElement(image.url)
    ctx.drawImage(imageEl, x, y, width, height, 0, 0, width, height)

    return tmpCanvas.toDataURL(image.mimeType)
  }

  static async getImage(file: File): Promise<ImageFile> {
    const url = await FileService.getUrl(file)
    const imageEl = await this.getImageElement(url)

    const image = new ImageFile()
    image.fileName = file.name
    image.mimeType = file.type
    image.url = url
    image.width = imageEl.naturalWidth
    image.height = imageEl.naturalHeight
    return image
  }
}
