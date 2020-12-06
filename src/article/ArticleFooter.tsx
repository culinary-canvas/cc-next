import React from 'react'
import s from './Article.module.scss'
import { Tags } from '../tag/Tags/Tags'
import { COLOR } from '../styles/color'
import { Share } from './shared/share/Share'
import { ArticleModel } from './Article.model'
import { observer } from 'mobx-react'

interface Props {
  article: ArticleModel
}

export const ArticleFooter = observer(({ article }: Props) => {
  return (
    <footer className={s.footer}>
      <Tags
        selected={article.tagNames}
        containerClassName={s.tags}
        backgroundColor={COLOR.WHITE}
      />

      <Share article={article} containerClassName={s.share} />
    </footer>
  )
})
