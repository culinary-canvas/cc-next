import React from 'react'
import s from '../Article.module.scss'
import { TagsView } from '../../tag/Tags/TagsView'
import { Share } from './share/Share'
import { ArticleModel } from '../Article.model'
import { observer } from 'mobx-react'

interface Props {
  article: ArticleModel
}

export const ArticleFooter = observer(({ article }: Props) => {
  return (
    <footer className={s.footer}>
      <TagsView
        tagNames={article.tagNames}
        containerClassName={s.tags}
      />
      <Share article={article} containerClassName={s.share} />
    </footer>
  )
})
