import { SectionModel } from '../../section/Section.model'
import kebabCase from 'voca/kebab_case'
import { ImageContentModel } from '../../content/image/ImageContent.model'
import { Format } from './Format'

export class FormatService {
  static imageWidth(image: ImageContentModel) {
    if (!!image.format.fixedWidth) {
      return `${image.format.fixedWidth}px`
    }
    return null
  }

  static imageHeight(section: SectionModel, image: ImageContentModel) {
    if (!!image.format.fixedHeight) {
      return `${image.format.fixedHeight}px`
    }
    return null
  }

  static className<T extends Format>(format: T, property: keyof T) {
    return `${kebabCase(property as string)}-${format[property]}`
  }
}
