import React, { useState } from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { MenuButton } from '../../../../menu/MenuButton/MenuButton'
import { Button } from '../../../../form/button/Button'
import { Controls } from './controls/Controls'
import { ArticleApi } from '../../../../article/Article.api'
import { COLOR } from '../../../../styles/color'
import { useAuth } from '../../../../services/auth/Auth'
import s from './ArticleFormSidebar.module.scss'
import { useRouter } from 'next/router'
import { useAdmin } from '../../../Admin'
import { useOverlay } from '../../../../shared/overlay/OverlayStore'

interface Props {}

const ArticleFormSidebar = observer((props: Props) => {
  const auth = useAuth()
  const router = useRouter()
  const admin = useAdmin()
  const overlay = useOverlay()

  const [saving, setSaving] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const onProgress = (progress, message) => {
    message && overlay.setText(message)
    overlay.setProgress(progress)
  }

  return (
    <>
      <div
        className={classnames([
          s.sidebarButton,
          { [s.open]: admin.sidebarOpen },
        ])}
      >
        <MenuButton
          onClick={() => {
            admin.setSidebarOpen(!admin.sidebarOpen)
          }}
          className={s.menuButton}
        />
      </div>

      <aside
        className={classnames([
          s.container,
          s.sidebar,
          { [s.open]: admin.sidebarOpen },
        ])}
      >
        <article className={s.content}>
          <section className={s.buttons}>
            <Button
              color={COLOR.GREY_DARK}
              onClick={() => {
                let goodToGo = true
                if (admin.formControl.isDirty) {
                  goodToGo = window.confirm(
                    'You have unsaved changes. Are you sure you want to leave this page?',
                  )
                }
                if (goodToGo) {
                  router.back()
                }
              }}
            >
              Back
            </Button>

            <Button
              disabled={
                admin.formControl.isClean || admin.formControl.isInvalid
              }
              loading={saving}
              loadingText="Saving"
              onClick={onSave}
            >
              Save
            </Button>

            {!!admin.article?.id && (
              <Button
                loading={deleting}
                color={COLOR.RED}
                loadingText="Deleting"
                onClick={onDelete}
              >
                Delete...
              </Button>
            )}
          </section>

          <Controls />
        </article>
      </aside>
    </>
  )

  async function onSave() {
    setSaving(true)
    overlay.toggle()
    const id = await ArticleApi.save(admin.article, auth.user, onProgress)

    setTimeout(async () => {
      const { slug } = await ArticleApi.byId(id)
      admin.formControl.reset()
      await router.replace(`/admin/articles/${slug}`)
      router.reload()
      overlay.toggle()
    }, 1000)

    setSaving(false)
  }

  async function onDelete() {
    const goodToGo = window.confirm(
      'Are you really, really sure want to delete this article?',
    )
    if (goodToGo) {
      setDeleting(true)
      overlay.toggle()
      await ArticleApi.delete(admin.article, auth.user, onProgress)
      setTimeout(() => overlay.toggle(), 1000)
      router.replace('/admin/articles')
    }
  }
})

export default ArticleFormSidebar