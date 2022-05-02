import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useAdmin } from '../../admin/Admin.context'
import { classnames } from '../../services/importHelpers'
import { ArticleService } from '../Article.service'
import { ArticlePreview } from '../preview/ArticlePreview'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import s from './ArticleForm.module.scss'
import { SectionEdit } from './section/SectionEdit'

export const ArticleForm = observer(() => {
  const admin = useAdmin()
  const { article } = admin

  useEffect(() => {
    !!article && ArticleService.populateIssues([article])
  }, [article])

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
          className={classnames(
            s.content,
            `type-${article?.type}`,
            article.sponsored && s.sponsored,
          )}
          style={{ backgroundColor: article.format.backgroundColor }}
        >
          {article.sections.map((section, i) => (
            <SectionEdit
              article={article}
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
