import React from 'react'
import { observer } from 'mobx-react'
import { ArticleService } from '../../domain/Article/Article.service'
import { classnames } from '../../services/importHelpers'
import { Section } from '../Section/Section'
import { AddSection } from '../AddSection/AddSection'
import s from './ArticleForm.module.scss'
import { useAdmin } from '../../services/admin/Admin.store'

interface Props {}

export const ArticleForm = observer((props: Props) => {
  const admin = useAdmin()
  if (!admin.article) {
    return null
  }

  return (
    <>
      <article className={classnames(s.content, `type-${admin.article?.type}`)}>
        {admin.article?.sortedSections.map((section, i) => (
          <Section
            first={i === 0}
            key={section.sortOrder}
            section={section}
            edit
          />
        ))}
      </article>

      <AddSection
        onSelect={(section) => {
          ArticleService.addSection(section, admin.article)
          admin.setSection(section)
        }}
      />
    </>
  )
})
