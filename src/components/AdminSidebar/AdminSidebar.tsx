import React, { useState } from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { MenuButton } from '../MenuButton/MenuButton'
import { Button } from '../Button/Button'
import { Controls } from './Controls/Controls'
import { useEnv } from '../../services/AppEnvironment'
import { ArticleApi } from '../../domain/Article/Article.api'
import { COLOR } from '../../styles/color'
import { useAuth } from '../../services/auth/Auth'
import s from './AdminSidebar.module.scss'
import { useRouter } from 'next/router'

interface Props {}

const AdminSidebar = observer((props: Props) => {
  const env = useEnv()
  const auth = useAuth()
  const router = useRouter()

  const [saving, setSaving] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const onProgress = (progress, message) => {
    message && env.overlayStore.setText(message)
    env.overlayStore.setProgress(progress)
  }

  return (
    <>
      <div
        className={classnames([
          s.sidebarButton,
          { [s.open]: env.adminStore.sidebarOpen },
        ])}
      >
        <MenuButton
          onClick={() => env.adminStore.toggleSidebar()}
          className={s.menuButton}
        />
      </div>

      <aside
        className={classnames([
          s.container,
          s.sidebar,
          { [s.open]: env.adminStore.sidebarOpen },
        ])}
      >
        <article className={s.content}>
          <section className={s.buttons}>
            <Button
              color={COLOR.GREY_DARK}
              onClick={() => {
                let goodToGo = true
                if (env.adminStore.formControl.isDirty) {
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
                env.adminStore.formControl.isClean ||
                env.adminStore.formControl.isInvalid
              }
              loading={saving}
              loadingText="Saving"
              onClick={onSave}
            >
              Save
            </Button>

            {!!env.adminStore.formControl.mutable.id && (
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
    env.overlayStore.toggle()
    const id = await ArticleApi.save(
      env.adminStore.article,
      auth.user,
      onProgress,
    )

    setTimeout(async () => {
      const { slug } = await ArticleApi.byId(id)
      env.adminStore.formControl.reset()
      await router.replace(`/admin/articles/${slug}`)
      router.reload()
      env.overlayStore.toggle()
    }, 1000)

    setSaving(false)
  }

  async function onDelete() {
    const goodToGo = window.confirm(
      'Are you really, really sure want to delete this article?',
    )
    if (goodToGo) {
      setDeleting(true)
      env.overlayStore.toggle()
      await ArticleApi.delete(env.adminStore.article, auth.user, onProgress)
      setTimeout(() => env.overlayStore.toggle(), 1000)
      router.replace('/admin/articles')
    }
  }
})

export default AdminSidebar
