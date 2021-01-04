import React from 'react'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { runInAction } from 'mobx'
import { CompanyModel } from '../Company.model'
import { useAuth } from '../../services/auth/Auth'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { useFormControl } from '../../form/formControl/useFormControl'
import { CompanyApi } from '../Company.api'
import { Button } from '../../form/button/Button'
import s from './CompanyForm.module.scss'
import { ImageEdit } from '../../form/imageEdit/ImageEdit'

interface Props {
  company: CompanyModel
}

export const CompanyForm = observer((props: Props) => {
  const { company: _company } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const [formControl, company] = useFormControl(_company, [
    { field: 'name', required: true },
  ])

  if (!formControl) {
    return null
  }

  return (
    <article className={s.container}>
      <Button
        type="submit"
        disabled={formControl.isClean || !formControl.isValid}
        onClick={async () => {
          overlay.toggle()
          const id = await CompanyApi.save(company, userId, (v, t) =>
            overlay.setProgress(v, t),
          )
          setTimeout(() => overlay.setVisible(false), 1000)
          router.replace(
            !!router.query.id ? `/admin/companies` : `/admin/companies/${id}`,
          )
        }}
      >
        Save
      </Button>

      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={company.name}
        onChange={(e) => {
          console.log(e.target.value)
          runInAction(() => (formControl.mutable.name = e.target.value))
        }}
      />

      <label htmlFor="type">Type</label>
      <input type="text" id="type" value={company.type} disabled />

      <label htmlFor="web">Web site</label>
      <input
        type="text"
        id="web"
        value={company.web}
        onChange={(e) => runInAction(() => (company.web = e.target.value))}
      />

      <label htmlFor="image" style={{ marginBottom: '1rem' }}>
        Image
      </label>
      <ImageEdit
        set={company.image}
        format={company.imageFormat}
        onChange={(imageSet) => runInAction(() => (company.image = imageSet))}
      />
    </article>
  )
})
