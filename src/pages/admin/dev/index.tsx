import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../../form/button/Button'
import { fixSortOrders } from '../../../services/script/fixSortOrders'
import { deleteUnusedTags } from '../../../services/script/deleteUnusedTags'
import s from './dev.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useAuth } from '../../../services/auth/Auth'
import { changeSectionPresetNames } from '../../../services/script/changeSectionPresetNames'
import { transformToGridPositions } from '../../../services/script/transformToGridPositions'
import { GetStaticProps } from 'next'
import { updateImageFormats } from '../../../services/script/updateImageFormats'
import { changeArticleTagIdsToTagNames } from '../../../services/script/changeArticleTagIdsToTagNames'
import { changeArticleTypeHOW_TOToRECIPE } from '../../../services/script/changeArticleTypeHOW_TOToRECIPE'

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
            setRunning('fixSortOrders')
            await fixSortOrders(auth.userId)
            setRunning(null)
          }}
          loading={running === 'fixSortOrders'}
        >
          Fix sort orders of Articles
        </Button>

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
            setRunning('transformToGridPositions')
            await transformToGridPositions(auth.userId)
            setRunning(null)
          }}
          loading={running === 'transformToGridPositions'}
        >
          transformToGridPositions
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
            setRunning('changeArticleTagIdsToTagNames')
            await changeArticleTagIdsToTagNames(auth.userId)
            setRunning(null)
          }}
          loading={running === 'changeArticleTagIdsToTagNames'}
        >
          Update articles' tag reference from ID to names
        </Button>

        <Button
          onClick={async () => {
            setRunning('changeArticleTypeHOW_TOToRECIPE')
            await changeArticleTypeHOW_TOToRECIPE(auth.userId)
            setRunning(null)
          }}
          loading={running === 'changeArticleTypeHOW_TOToRECIPE'}
        >
          Change articles' type from HOW_TO to RECIPE
        </Button>
      </div>
    </div>
  )
})

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}

export default AdminDevArea
