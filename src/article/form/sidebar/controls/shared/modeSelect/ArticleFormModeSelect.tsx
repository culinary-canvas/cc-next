import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAdmin } from '../../../../../../admin/Admin.context'
import { Button } from '../../../../../../shared/button/Button'
import s from './ArticleFormModeSelect.module.scss'

export const ArticleFormModeSelect = observer(() => {
  const admin = useAdmin()

  return (
    <div className={s.container}>
      <Button
        toggleable
        onClick={() => admin.setMode('article')}
        selected={admin.mode === 'article'}
      >
        Article
      </Button>
      <Button
        toggleable
        onClick={() => admin.setMode('preview')}
        selected={admin.mode === 'preview'}
      >
        Preview
      </Button>
    </div>
  )
})
