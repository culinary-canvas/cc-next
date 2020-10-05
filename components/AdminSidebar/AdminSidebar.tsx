import React, { useState } from 'react'
import { observer } from 'mobx-react'
import './AdminSidebar.module.scss'
import classnames from 'classnames'
import { MenuButton } from '../MenuButton/MenuButton'
import { Button } from '../Button/Button'
import { Controls } from './Controls/Controls'
import { useEnv } from '../../services/AppEnvironment'
import { ArticleApi } from '../../domain/Article/Article.api'
import { COLOR } from '../../styles/color'
import { useAuth } from '../../services/auth/Auth'

const AdminSidebar = observer(() => {
  const env = useEnv()
  // TODO nav
  const router: any = null //useRouter()
  const { adminSidebarStore: store } = env
  const auth = useAuth()

  const [saving, setSaving] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  return (
    <>
      <div
        className={classnames([
          'sidebar-button',
          'container',
          { open: store.isOpen },
        ])}
      >
        <MenuButton onClick={() => store.toggle()} />
      </div>
      <aside
        className={classnames(['container', 'sidebar', { open: store.isOpen }])}
      >
        {!!store.formControl && (
          <div className="content sidebar">
            <section className="buttons">
              <Button
                color={COLOR.GREY_DARK}
                onClick={() => {
                  let goodToGo = true
                  if (store.formControl.isDirty) {
                    goodToGo = window.confirm(
                      'You have unsaved changes. Are you sure you want to leave this page?',
                    )
                  }
                  if (goodToGo) {
                    router.history.go(-1)
                  }
                }}
              >
                Back
              </Button>
              <Button
                disabled={
                  store.formControl.isClean || store.formControl.isInvalid
                }
                loading={saving}
                loadingText="Saving"
                onClick={onSave}
              >
                Save
              </Button>

              {!!store.article.id && (
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
          </div>
        )}
      </aside>
    </>
  )

  async function onSave() {
    setSaving(true)
    env.overlayStore.toggle()
    const persisted = await env.articleStore.save(
      store.article,
      auth.user,
      (progress, message) => {
        env.overlayStore.setText(message)
        env.overlayStore.setProgress(progress)
      },
    )
    setTimeout(() => {
      env.overlayStore.toggle()
      store.formControl.reset()
      /*
      router.navigate({
        url: `/admin/articles/${persisted.titleForUrl}`,
        method: 'replace',
      })
*/
    }, 1000)
    setSaving(false)
  }

  async function onDelete() {
    const goodToGo = window.confirm(
      'Are you really really sure want to delete this article?',
    )
    if (goodToGo) {
      setDeleting(true)
      env.overlayStore.toggle()
      await env.articleStore.delete(
        store.article,
        auth.user,
        (progress, message) => {
          env.overlayStore.setText(message)
          env.overlayStore.setProgress(progress)
        },
      )
      await ArticleApi.delete(store.article.id)
      setTimeout(() => env.overlayStore.toggle(), 1000)
      // router.navigate({ url: '/admin/articles' })
    }
  }
})

export default AdminSidebar
