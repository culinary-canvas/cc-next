import { observer } from 'mobx-react'
import { useAdmin } from '../../../../../../Admin'
import { Button } from '../../../../../../../form/button/Button'
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
