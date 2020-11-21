import { ArticleApi } from '../../article/Article.api'
import { User } from 'firebase'
import { Transformer } from '../db/Transformer'
import { ArticleModel } from '../../article/Article.model'
import { SectionPreset } from '../../article/section/SectionPreset'

export async function changeSectionPresetNames(user: User) {
  const articles = Transformer.allToApp(await ArticleApi.all(), ArticleModel)
  articles.forEach((a) =>
    a.sections.forEach((s) => {
      switch (s.preset) {
        // @ts-ignore
        case 'HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE':
          s.preset = SectionPreset.HALF_SCREEN_TITLE
          break
        // @ts-ignore
        case 'FULL_SCREEN_IMAGE_TITLE_SUB_BYLINE':
          s.preset = SectionPreset.FULL_SCREEN_TITLE
          break
        // @ts-ignore
        case 'INLINE_IMAGE_TITLE_SUB_BYLINE':
          s.preset = SectionPreset.INLINE_TITLE
          break
      }
      /*
      switch (s.preset) {
        case SectionPreset.HALF_SCREEN_TITLE:
          s.preset = SectionPreset.HALF_SCREEN_IMAGE_TITLE_SUB_BYLINE
          break
        case SectionPreset.FULL_SCREEN_TITLE:
          s.preset = SectionPreset.FULL_SCREEN_IMAGE_TITLE_SUB_BYLINE
          break
        case SectionPreset.INLINE_TITLE:
          s.preset = SectionPreset.INLINE_IMAGE_TITLE_SUB_BYLINE
          break
      }*/
    }),
  )
  return Promise.all(articles.map(async (a) => await ArticleApi.save(a, user)))
}
