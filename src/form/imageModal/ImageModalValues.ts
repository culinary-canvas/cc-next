import { ImageCropValues } from '../../article/content/image/ImageCropValues'

export interface ImageModalValues {
  url?: string
  cropValues?: ImageCropValues
  fileName?: string
  mimeType?: string
}
