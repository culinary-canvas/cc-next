import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../../form/button/Button'
import { fixSortOrders } from '../../../services/script/fixSortOrders'
import { deleteUnusedTags } from '../../../services/script/deleteUnusedTags'
import { setArticleSlug } from '../../../services/script/setArticleSlug'
import { changeArticleTagIdsToTagNames } from '../../../services/script/changeArticleTagIdsToTagNames'
import s from './dev.module.scss'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import { useAuth } from '../../../services/auth/Auth'
import {changeSectionPresetNames} from '../../../services/script/changeSectionPresetNames'
import {transformToGridPositions} from '../../../services/script/transformToGridPositions'

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
            await fixSortOrders(auth.user)
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
            await changeSectionPresetNames(auth.user)
            setRunning(null)
          }}
          loading={running === 'changeSectionPresetNames'}
        >
          Update articles' section presets to new names
        </Button>

        <Button
          onClick={async () => {
            setRunning('transformToGridPositions')
            await transformToGridPositions(auth.user)
            setRunning(null)
          }}
          loading={running === 'transformToGridPositions'}
        >
          transformToGridPositions
        </Button>
      </div>
    </div>
  )
})

export default AdminDevArea
