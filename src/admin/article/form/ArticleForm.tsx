import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { classnames } from '../../../services/importHelpers'
import { SectionEdit } from './section/SectionEdit'
import s from './ArticleForm.module.scss'
import { useAdmin } from '../../Admin'
import { ArticleFooter } from '../../../article/shared/footer/ArticleFooter'

interface Props {}

export const ArticleForm = observer((props: Props) => {
  const admin = useAdmin()
  const { article } = admin

  if (!article) {
    return null
  }

  return (
    <>
      <article
        className={classnames(s.content, `type-${article?.type}`)}
        style={{ backgroundColor: article.format.backgroundColor }}
      >
        {article.sections.map((section, i) => (
          <SectionEdit
            key={section.uid}
            section={section}
            first={section.format.gridPosition.startRow === 1}
          />
        ))}
        <ArticleFooter article={article} />
      </article>
    </>
  )
})
