import { ImageCropValues } from '../image/models/ImageCropValues'
import { ImageFile } from '../image/models/ImageFile'
import { FileService } from './file/FileService'
import Compressor from 'compressorjs'
import { Overlay } from '../shared/overlay/OverlayStore'
import { ImageSet } from '../image/models/ImageSet'
import { isNil } from './importHelpers'

export class ImageService {
  static readonly NEXTJS_DEVICE_SIZES = [
    172,
    248,
    344,
    496,
    688,
    992,
    1024,
    1312,
    2048,
    4096,
  ]

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

  static async getWidthAndHeight(blob: Blob, image: ImageFile)
  static async getWidthAndHeight(url: string)
  static async getWidthAndHeight(
    urlOrBlob: string | Blob,
    image?: ImageFile,
  ): Promise<{ width: number; height: number }> {
    let url
    if (!!image) {
      const file = new File([urlOrBlob], image.fileName, {
        type: image.mimeType,
      })
      url = await FileService.getUrl(file)
    } else {
      url = urlOrBlob
    }

    const imageEl = await this.getImageElement(url)
    return { width: imageEl.naturalWidth, height: imageEl.naturalHeight }
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

  static async resize(image: ImageFile, maxSize: number): Promise<ImageFile>
  static async resize(
    image: Readonly<ImageFile>,
    maxWidth = 3000,
    maxHeight = maxWidth,
    quality = 0.9,
  ): Promise<ImageFile> {
    const blob = await FileService.getFile(
      image.url,
      image.fileName,
      image.mimeType,
    )
    let resolver
    const promise = new Promise<ImageFile>((resolve) => (resolver = resolve))

    new Compressor(blob, {
      quality,
      maxWidth,
      maxHeight,
      mimeType: image.mimeType,
      success: async (blob: Blob) => {
        const { width, height } = await this.getWidthAndHeight(blob, image)
        const name = this.fileNameWithSize(image.fileName, width, height)

        const file = new File([blob], name, {
          type: image.mimeType,
        })
        const url = await FileService.getUrl(file)

        const resizedImage = new ImageFile()
        resizedImage.url = url
        resizedImage.fileName = file.name
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

  private static fileNameWithSize(
    fileName: string,
    width: number,
    height: number,
  ): string {
    const { name, extension } = this.getFileNameAndExtensionParts(fileName)
    return `${name}_${width}x${height}.${extension}`
  }

  private static getFileNameAndExtensionParts(
    fileName: string,
  ): { name: string; extension: string } {
    const periodPosition = fileName.lastIndexOf('.')
    const name = fileName.substring(0, periodPosition)
    const extension = fileName.substring(periodPosition + 1)
    return { name, extension }
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

  static async createNewSet(
    overlay: Overlay,
    alt: string,
    newImage: ImageFile,
    newCropValues: ImageCropValues,
  ) {
    overlay.setProgress(0, 'Crunching image sizes...')

    const newSet = new ImageSet()
    newSet.alt = alt

    newSet.original = newImage
    newSet.cropValues = newCropValues

    overlay.setProgress(0.2, 'Cropping image...')
    newSet.image = await ImageService.crop(newSet.original, newSet.cropValues)

    overlay.setProgress(1, 'Done!')
    return newSet
  }

  static getImageSizeByVw(vw: number): number {
    const pixels = (vw / 100) * window.innerWidth
    return this.getDeviceSize(pixels)
  }

  static determineImageSizeByLargestDimension(
    url: string,
    wOriginal: number,
    hOriginal: number,
    wContainer: number,
    hContainer: number,
  ): number {
    if (isNil(wContainer) || isNil(hContainer)) {
      return null
    }
    const wByContainerW = this.getDeviceSize(wContainer)
    const hByContainerW = hOriginal * (wContainer / wOriginal)

    if (hByContainerW >= hContainer) {
      return wByContainerW
    }
    const exactWByContainerH = wOriginal * (hContainer / hOriginal)
    return this.getDeviceSize(exactWByContainerH)
  }

  static getDeviceSize(size: number): number {
    for (let deviceSize of this.NEXTJS_DEVICE_SIZES) {
      if (deviceSize >= size) {
        return deviceSize
      }
    }
  }
}
