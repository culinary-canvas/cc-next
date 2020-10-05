import React from 'react'
import { observer } from 'mobx-react'
import { useEnv } from '../services/AppEnvironment'
import { useAutorun } from '../hooks/useAutorun'
import { ArticleGrid } from '../components/ArticleGrid/ArticleGrid'
import './start.module.scss'

const Start = observer(() => {
  const env = useEnv()

  useAutorun(() => {
    if (!env.articleStore.loaded) {
      env.articleStore.load()
    }
  })

  return (
    <main className="container grid">
      <ArticleGrid
        articles={
          env.adminStore.showUnpublishedOnStartPage
            ? env.articleStore.articles
            : env.articleStore.published
        }
      />
    </main>
  )
})

export default Start
