import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '../../../shared/button/Button'
import { deleteUnusedTags } from '../../../services/script/deleteUnusedTags'
import s from './dev.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useAuth } from '../../../services/auth/Auth'
import { changeSectionPresetNames } from '../../../services/script/changeSectionPresetNames'
import { GetStaticProps } from 'next'
import { updateImageFormats } from '../../../services/script/updateImageFormats'
import { setArticleTypeAsTag } from '../../../services/script/setArticleTypeAsTag'
import { setPersonAndCompanySlugs } from '../../../services/script/setPersonAndCompanySlugs'
import { setShowOnStartPage } from '../../../services/script/setShowOnStartPage'

const AdminDevArea = observer(() => {
  const [running, setRunning] = useState<string>()
  const auth = useAuth()
  const allowed = useAuthGuard()

  if (!allowed) {
    return null
  }

  return (
    <div className={s.container}>
      <div className={s.content}>
        <Button
          onClick={async () => {
            setRunning('deleteUnusedTags')
            await deleteUnusedTags()
            setRunning(null)
          }}
          loading={running === 'deleteUnusedTags'}
        >
          Delete unused tags
        </Button>

        <Button
          onClick={async () => {
            setRunning('changeSectionPresetNames')
            await changeSectionPresetNames(auth.userId)
            setRunning(null)
          }}
          loading={running === 'changeSectionPresetNames'}
        >
          Update articles' section presets to new names
        </Button>

        <Button
          onClick={async () => {
            setRunning('updateImageFormats')
            await updateImageFormats(auth.userId)
            setRunning(null)
          }}
          loading={running === 'updateImageFormats'}
        >
          Update image formats
        </Button>

        <Button
          onClick={async () => {
            setRunning('setArticleTypeAsTag')
            await setArticleTypeAsTag(auth.userId)
            setRunning(null)
          }}
          loading={running === 'setArticleTypeAsTag'}
        >
          Set article type as tag
        </Button>

        <Button
          onClick={async () => {
            setRunning('setPersonAndCompanySlugs')
            await setPersonAndCompanySlugs(auth.userId)
            setRunning(null)
          }}
          loading={running === 'setPersonAndCompanySlugs'}
        >
          Set Person and Company slugs
        </Button>

        <Button
          onClick={async () => {
            setRunning('setShowOnStartPage')
            await setShowOnStartPage(auth.userId)
            setRunning(null)
          }}
          loading={running === 'setShowOnStartPage'}
        >
          Set show on start page
        </Button>

      </div>
    </div>
  )
})

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

export default AdminDevArea
