import React from 'react'
import s from './Toc.module.scss'
import { ArticleModel } from '../../Article.model'
import { observer } from 'mobx-react'

interface Props {
  article: ArticleModel
}

export const Toc = observer(({ article }: Props) => {
  return <div className={s.container}>TOC in construction</div>
})
