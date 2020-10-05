import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Article } from '../../../domain/Article/Article'
import { useEnv } from '../../../services/AppEnvironment'
import { ArticleService } from '../../../domain/Article/Article.service'
import { useFormControl } from '../../../hooks/useFormControl'
import { useUnmount } from '../../../hooks/useUnmount'
import { classnames } from '../../../services/importHelpers'
import { AddSection } from '../../../components/AddSection/AddSection'
import { Section } from '../../../components/Section/Section'
import { useRouter } from 'next/router'

const ArticleForm = observer(() => {
  const env = useEnv()
  // TODO nav
  const router = useRouter()
  const urlTitle = router.query.urlTitle as string
  console.log(urlTitle)

  const [article, setArticle] = useState<Article>()

  useEffect(() => {
    if (!article) {
      if (!!urlTitle) {
        env.articleStore.getByTitleForUrl(urlTitle).then((a) => setArticle(a))
      } else {
        setArticle(ArticleService.create())
      }
    }
  }, [article, env.articleStore, urlTitle])

  const formControl = useFormControl(article, [
    { field: 'title', required: true },
  ])
  useEffect(() => {
    !!formControl && env.adminSidebarStore.init(formControl)
  }, [env.adminSidebarStore, formControl])

  useEffect(() => {
    env.adminSidebarStore.open()
  }, [env.adminSidebarStore])

  useEffect(() => {}, [article])

  useUnmount(() => {
    env.adminSidebarStore.onDestroy()
  })

  return (
    <main className={classnames('container', 'article')}>
      <article
        className={classnames('content', 'article', `type-${article?.type}`)}
      >
        {article?.sortedSections.map((section, i) => (
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
          ArticleService.addSection(section, article)
          env.adminSidebarStore.setSection(section)
        }}
      />
    </main>
  )
})

export default ArticleForm
