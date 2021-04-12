import React from 'react'
import { observer } from 'mobx-react-lite'
import { classnames } from '../../services/importHelpers'
import { SectionEdit } from './section/SectionEdit'
import s from './ArticleForm.module.scss'
import { useAdmin } from '../../admin/Admin.context'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import { ArticlePreview } from '../preview/ArticlePreview'

interface Props {}

export const ArticleForm = observer((props: Props) => {
  const admin = useAdmin()
  const { article } = admin

  if (!article) {
    return null
  }

  return (
    <>
      {admin.mode === 'preview' ? (
        <div className={s.previewContainer}>
          <div className={s.previewGrid}>
            <div className={classnames(s.articleContainer, s.promoted)}>
              <ArticlePreview article={article} />
            </div>
            <div className={classnames(s.articleContainer)}>
              <ArticlePreview article={article} />
            </div>
            <div className={classnames(s.articleContainer, s.promoted)}>
              <ArticlePreview article={article} />
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </>
  )
})
