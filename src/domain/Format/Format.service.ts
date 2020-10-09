import {Section} from '../Section/Section'
import kebabCase from 'voca/kebab_case'
import {ApplicableFormat} from './ApplicableFormat'
import {ImageContent} from '../Image/ImageContent'
import {Format} from './Format'
import {TextContent} from '../Text/TextContent'
import {Fit} from '../Section/Fit'

export class FormatService {
  static gridTemplateColumns(section: Section) {
    return section.columns
      .map((c) => `${c[0].format.gridColumnWidth}fr`)
      .join(' ')
  }

  static imageWidth(image: ImageContent) {
    return !!image.set.image.width && !!image.format.size
      ? `${(image.format.size / 100) * image.set.image.width}px`
      : null
  }

  static imageHeight(
    section: Section,
    image: ImageContent,
  ) {
    if (section.format.fit === Fit.FULL_SCREEN) {
      return '100vh'
    } else if (!!image.set.image.height && !!image.format.size) {
      return `${(image.format.size / 100) * image.set.image.height}px`
    }
    return null
  }

  static className<T extends Format>(format: T, property: keyof T) {
    return `${kebabCase(property as string)}-${format[property]}`
  }
}
