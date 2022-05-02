import { collection, getDocs, query, where } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'
import { useAdmin } from '../../../../admin/Admin.context'
import { ArticleForm } from '../../../../article/form/ArticleForm'
import { ArticleModel } from '../../../../article/models/Article.model'
import { useAuthGuard } from '../../../../hooks/useAuthGuard'
import { useTransformToModel } from '../../../../hooks/useTransformToModel'
import { useUnmount } from '../../../../hooks/useUnmount'
import { firebase } from '../../../../services/firebase/Firebase'
import { useFormControl } from '../../../../services/formControl/useFormControl'
import s from './articleEdit.module.scss'

interface Props {
  articleData: any
}

export default function ArticleEdit({ articleData }) {
  const admin = useAdmin()
  const article = useTransformToModel(articleData, ArticleModel)
  const allowed = useAuthGuard()

  const [formControl] = useFormControl(article, [
    { field: 'title', required: true },
  ])
  useEffect(() => {
    if (!!formControl) {
      admin.setSidebar(true)
      admin.setSidebarOpen(true)
      admin.setFormControl(formControl)
      admin.setSection(formControl.mutable.titleSection)
      admin.setContent(formControl.mutable.titleSection.contents[0])
    }
  }, [formControl])

  useUnmount(() => admin.reset())

  if (!allowed) {
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

export const getServerSideProps: GetServerSideProps<
  Props,
  { slug: string }
> = async ({ params }) => {
  const { db } = firebase()

  const response = await getDocs(
    query(collection(db, 'articles'), where('slug', '==', params.slug)),
  )

  const articleData = !!response.size
    ? { id: response.docs[0].id, ...response.docs[0].data() }
    : []

  return {
    props: {
      articleData: JSON.parse(JSON.stringify(articleData)),
    },
  }
}
