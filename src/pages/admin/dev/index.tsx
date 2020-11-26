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
            setRunning('setArticleSlug')
            await setArticleSlug(auth.user)
            setRunning(null)
          }}
          loading={running === 'setArticleSlug'}
        >
          Set articles' slug
        </Button>

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
            setRunning('changeArticleTagIdsToTagNames')
            await changeArticleTagIdsToTagNames(auth.user)
            setRunning(null)
          }}
          loading={running === 'changeArticleTagIdsToTagNames'}
        >
          Set articles' tag names
        </Button>
      </div>
    </div>
  )
})

export default AdminDevArea
