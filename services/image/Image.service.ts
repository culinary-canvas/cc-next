import { ImageCropValues } from '../../domain/Image/ImageCropValues'
import { ImageFile as _Image } from '../../domain/Image/ImageFile'
import Compressor from 'compressorjs'
import { FileService } from '../file/FileService'

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

  static async getWidthAndHeight(url: string) {
    const imageEl = await this.getImageElement(url)
    return { width: imageEl.naturalWidth, height: imageEl.naturalHeight }
  }

  static async crop(
    image: _Image,
    cropValues: ImageCropValues,
  ): Promise<_Image> {
    const cropUrl = await this.getCroppedUrl(image, cropValues)
    const cropFile = await FileService.getFile(
      cropUrl,
      `cropped_${image.fileName}`,
      image.mimeType,
    )
    return await this.getImage(cropFile)
  }

  private static async getCroppedUrl(image: _Image, crop: ImageCropValues) {
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

  static async resize(
    image: _Image,
    fileNamePrefix = '',
    quality = 0.9,
    maxWidth = 3000,
    maxHeight = maxWidth,
  ): Promise<_Image> {
    const blob = await FileService.getBlob(image.url, image.mimeType)
    let resolver
    const promise = new Promise<_Image>((resolve) => (resolver = resolve))
    // eslint-disable-next-line no-new
    new Compressor(blob, {
      quality,
      maxWidth,
      maxHeight,
      mimeType: image.mimeType,
      success: async (blob: Blob) => {
        const compressedFile = new File([blob], image.fileName, {
          type: image.mimeType,
        })
        const url = await FileService.getUrl(compressedFile)
        const { width, height } = await this.getWidthAndHeight(url)

        const resizedImage = new _Image()
        resizedImage.url = url
        resizedImage.fileName = `${fileNamePrefix}${image.fileName}`
        resizedImage.mimeType = image.mimeType
        resizedImage.width = width
        resizedImage.height = height
        resolver(resizedImage)
      },
      error: (e) => {
        throw e
      },
    })

    return promise
  }

  static async getImage(file: File): Promise<_Image> {
    const url = await FileService.getUrl(file)
    const imageEl = await this.getImageElement(url)

    const image = new _Image()
    image.fileName = file.name
    image.mimeType = file.type
    image.url = url
    image.width = imageEl.naturalWidth
    image.height = imageEl.naturalHeight
    return image
  }
}
