import React from 'react'
import { observer } from 'mobx-react'
import { useEnv } from '../../services/AppEnvironment'
import { ArticleService } from '../../domain/Article/Article.service'
import { classnames } from '../../services/importHelpers'
import { Section } from '../Section/Section'
import { AddSection } from '../AddSection/AddSection'
import s from './ArticleForm.module.scss'

interface Props {}

export const ArticleForm = observer((props: Props) => {
  const env = useEnv()

  if (!env.adminStore.article) {
    return null
  }

  return (
    <>
      <article
        className={classnames(
          s.content,
          `type-${env.adminStore.article?.type}`,
        )}
      >
        {env.adminStore.article?.sortedSections.map((section, i) => (
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
          ArticleService.addSection(section, env.adminStore.article)
          env.adminStore.setSection(section)
        }}
      />
    </>
  )
})
