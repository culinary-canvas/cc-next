import React from 'react'
import { observer } from 'mobx-react'
import { ArticleService } from '../../../article/Article.service'
import { classnames } from '../../../services/importHelpers'
import { SectionEdit } from './section/SectionEdit'
import { AddSection } from './addSection/AddSection'
import s from './ArticleForm.module.scss'
import { useAdmin } from '../../Admin'

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
          <SectionEdit
            first={i === 0}
            key={section.sortOrder}
            section={section}
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
