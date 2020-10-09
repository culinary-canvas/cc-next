import React, { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import s from './articleEdit.module.scss'
import { useEnv } from '../../../../services/AppEnvironment'
import { useFormControl } from '../../../../hooks/useFormControl'
import { ArticleForm } from '../../../../components/ArticleForm/ArticleForm'
import { ArticleService } from '../../../../domain/Article/Article.service'

export default function ArticleEdit({ articleData }) {
  const env = useEnv()

  const formControl = useFormControl(ArticleService.create(), [
    { field: 'title', required: true },
  ])

  useEffect(() => {
    if (!!formControl) {
      env.adminStore.renderSidebar()
      env.adminStore.openSidebar()
      env.adminStore.setFormControl(formControl)
      env.adminStore.setSection(formControl.mutable.titleSection)
      env.adminStore.setContent(
        formControl.mutable.titleSection.sortedContents[0],
      )
    }
  }, [formControl])

  if (!formControl) {
    return null
  }

  return (
    <>
      <main className={s.container}>
        <ArticleForm />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}
