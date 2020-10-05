import { Section } from '../Section/Section'
import kebabCase from 'voca/kebab_case'
import { ApplicableFormat } from './ApplicableFormat'
import { ImageContent } from '../Image/ImageContent'
import { Format } from './Format'
import { TextContent } from '../Text/TextContent'
import { Fit } from '../Section/Fit'

export class FormatService {
  static getApplicableSectionFormat(section: Section): ApplicableFormat {
    const gridTemplateColumns = section.columns
      .map((c) => `${c[0].format.gridColumnWidth}fr`)
      .join(' ')

    return {
      classNames: [this.getClassName(section.format, 'fit')],
      style: { gridTemplateColumns },
    }
  }

  static getApplicableImageFormat(
    image: ImageContent,
    section: Section,
  ): ApplicableFormat {
    const format = image.format

    let height: string
    if (section.format.fit === Fit.FULL_SCREEN) {
      height = '100vh'
    } else if (!!image.set.image.height && !!format.size) {
      height = `${(format.size / 100) * image.set.image.height}px`
    }

    const width =
      !!image.set.image.width && !!format.size
        ? `${(format.size / 100) * image.set.image.width}px`
        : null

    return {
      style: {
        paddingTop: `${format.padding.top}px`,
        paddingBottom: `${format.padding.bottom}px`,
        paddingLeft: `${format.padding.left}px`,
        paddingRight: `${format.padding.right}px`,
        height,
        width,
      },
      classNames: [
        this.getClassName(format, 'verticalAlign'),
        this.getClassName(format, 'horizontalAlign'),
        format.background ? 'background' : '',
      ],
    }
  }

  static getApplicableTextFormat(text: TextContent): ApplicableFormat {
    const format = text.format
    return {
      style: {
        color: format.color,
        fontWeight: format.fontWeight,
        fontSize: `${format.fontSize}px`,
        fontFamily: format.fontFamily,
        paddingTop: `${format.padding.top}px`,
        paddingBottom: `${format.padding.bottom}px`,
        paddingLeft: `${format.padding.left}px`,
        paddingRight: `${format.padding.right}px`,
      },
      classNames: [
        this.getClassName(format, 'verticalAlign'),
        this.getClassName(format, 'horizontalAlign'),
        format.emphasize ? 'emphasize' : '',
        format.italic ? 'italic' : '',
        format.uppercase ? 'uppercase' : '',
      ],
    }
  }

  private static getClassName<T extends Format>(format: T, property: keyof T) {
    return `${kebabCase(property as string)}-${format[property]}`
  }
}
