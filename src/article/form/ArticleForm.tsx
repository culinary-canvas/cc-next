import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useAdmin } from '../../admin/Admin.context'
import { useAutorun } from '../../hooks/useAutorun'
import { useUnmount } from '../../hooks/useUnmount'
import { classnames } from '../../services/importHelpers'
import { useHeader } from '../../shared/header/Header.context'
import { ArticleService } from '../Article.service'
import { ArticlePreview } from '../preview/ArticlePreview'
import { ArticleFooter } from '../shared/footer/ArticleFooter'
import s from './ArticleForm.module.scss'
import { SectionEdit } from './section/SectionEdit'

export const ArticleForm = observer(() => {
  const admin = useAdmin()
  const { article } = admin
  const { setCurrentArticle } = useHeader()

  useEffect(() => {
    !!article && ArticleService.populateIssues([article])
  }, [article])

  useAutorun(() => setCurrentArticle(article), [article])
  useUnmount(() => setCurrentArticle(null))

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
            s[`type-${article?.type}`],
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
