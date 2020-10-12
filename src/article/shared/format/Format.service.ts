import {SectionModel} from '../../section/Section.model'
import kebabCase from 'voca/kebab_case'
import {ApplicableFormat} from './ApplicableFormat'
import {ImageContentModel} from '../../content/image/ImageContent.model'
import {Format} from './Format'
import {TextContentModel} from '../../content/text/TextContent.model'
import {Fit} from '../Fit'

export class FormatService {
  static gridTemplateColumns(section: SectionModel) {
    return section.columns
      .map((c) => `${c[0].format.gridColumnWidth}fr`)
      .join(' ')
  }

  static imageWidth(image: ImageContentModel) {
    return !!image.set?.image?.width && !!image.format.size
      ? `${(image.format.size / 100) * image.set.image.width}px`
      : null
  }

  static imageHeight(
    section: SectionModel,
    image: ImageContentModel,
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
