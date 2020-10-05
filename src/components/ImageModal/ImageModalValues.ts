import { ImageCropValues } from '../../domain/Image/ImageCropValues'

export interface ImageModalValues {
  url?: string
  cropValues?: ImageCropValues
  fileName?: string
  mimeType?: string
}
