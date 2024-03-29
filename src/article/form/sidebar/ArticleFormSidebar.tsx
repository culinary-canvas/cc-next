import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAdmin } from '../../../admin/Admin.context'
import { MenuButton } from '../../../menu/button/MenuButton'
import { useAuth } from '../../../services/auth/Auth'
import { Button } from '../../../shared/button/Button'
import { OverlayConfirm } from '../../../shared/overlay/OverlayConfirm'
import { useOverlay } from '../../../shared/overlay/OverlayStore'
import ArticleApi from '../../Article.api'
import s from './ArticleFormSidebar.module.scss'
import { Controls } from './controls/Controls'

const ArticleFormSidebar = observer(() => {
  const auth = useAuth()
  const router = useRouter()
  const admin = useAdmin()
  const overlay = useOverlay()

  const [saving, setSaving] = useState<boolean>(false)

  return (
    <>
      <div
        className={classnames([
          s.sidebarButton,
          { [s.open]: admin.sidebarOpen },
        ])}
      >
        <MenuButton
          open={admin.sidebarOpen}
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
              onClick={() => {
                if (admin.formControl.isDirty) {
                  overlay.setChildren(
                    <OverlayConfirm
                      onOk={() => router.back()}
                      title="Are you sure?"
                      message="'You have unsaved changes. Are you sure you want to leave this page?'"
                    />,
                  )
                  overlay.toggle()
                } else {
                  router.back()
                }
              }}
            >
              {admin.formControl.isDirty ? 'Cancel' : 'Back'}
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
          </section>

          <Controls />
        </article>
      </aside>
    </>
  )

  async function onSave() {
    setSaving(true)
    overlay.toggle()
    const id = await ArticleApi.save(admin.article, auth.userId, (v, t) =>
      overlay.setProgress(v, t),
    )

    setTimeout(async () => {
      const { slug } = await ArticleApi.byId(id)
      admin.formControl.reset()
      await router.replace(`/admin/articles/${slug}`)
      router.reload()
      overlay.toggle()
    }, 1000)

    setSaving(false)
  }
})

export default ArticleFormSidebar
