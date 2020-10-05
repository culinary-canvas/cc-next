import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../../components/Button/Button'
import { setTitleForUrl } from '../../services/script/setTitleForUrl'
import { fixSortOrders } from '../../services/script/fixSortOrders'
import { deleteUnusedTags } from '../../services/script/deleteUnusedTags'

const AdminDevArea = observer(() => {
  const [running, setRunning] = useState<string>()

  return (
    <div className="page container">
      <div className="page content">
        <Button
          onClick={async () => {
            setRunning('setTitleForUrl')
            await setTitleForUrl()
            setRunning(null)
          }}
          loading={running === 'setTitleForUrl'}
        >
          Set articles' title for url
        </Button>

        <Button
          onClick={async () => {
            setRunning('fixSortOrders')
            await fixSortOrders()
            setRunning(null)
          }}
          loading={running === 'fixSortOrders'}
        >
          Fix sort orders of Articles and their sections and contents
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
      </div>
    </div>
  )
})

export default AdminDevArea
