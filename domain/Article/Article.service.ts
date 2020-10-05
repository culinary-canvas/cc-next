import { Article } from './Article'
import { ArticleType } from './ArticleType'
import { Section } from '../Section/Section'
import { action } from 'mobx'
import { SectionService } from '../Section/Section.service'
import { SectionPreset } from '../Section/SectionPreset'
import StringUtils from '../../services/utils/StringUtils'

export class ArticleService {
  @action
  static create(type = ArticleType.DISH) {
    const article = new Article()
    article.type = type

    const section = new Section()
    section.sortOrder = 0
    SectionService.applyPreset(
      SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE,
      section,
    )

    article.sections = [section]

    return article
  }

  @action
  static addSection(section: Section, article: Article) {
    section.sortOrder = article.sections.length
    article.sections.push(section)
  }

  static moveSection(section: Section, newSortOrder: number, article: Article) {
    article.sections.find(
      (s) => s.uid !== section.uid && s.sortOrder === newSortOrder,
    ).sortOrder = section.sortOrder
    section.sortOrder = newSortOrder
  }

  static removeSection(section: Section, article: Article) {
    article.sections = article.sections
      .sort((s1, s2) => s1.sortOrder - s2.sortOrder)
      .filter((s) => s.uid !== section.uid)
      .map((s, i) => {
        s.sortOrder = i
        return s
      })
  }

  static createTitleForUrl(article: Article) {
    return StringUtils.toLowerKebabCase(article.titleContent?.value)
  }
}
