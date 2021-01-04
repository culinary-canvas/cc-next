import React from 'react'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { runInAction } from 'mobx'
import { PersonModel } from '../Person.model'
import { useAuth } from '../../services/auth/Auth'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { useFormControl } from '../../form/formControl/useFormControl'
import { PersonApi } from '../Person.api'
import { Button } from '../../form/button/Button'
import s from './PersonForm.module.scss'

interface Props {
  person: PersonModel
}

export const PersonForm = observer((props: Props) => {
  const { person: _person } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const [formControl, person] = useFormControl(_person, [
    { field: 'name', required: true },
  ])

  if (!formControl) {
    return null
  }

  return (
    <article className={s.container}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        value={person.name}
        onChange={(e) => {
          console.log(e.target.value)
          runInAction(() => (formControl.mutable.name = e.target.value))
        }}
      />

      <label htmlFor="web">Web site</label>
      <input
        type="text"
        id="web"
        value={person.web}
        onChange={(e) => runInAction(() => (person.web = e.target.value))}
      />

      <Button
        type="submit"
        disabled={formControl.isClean || !formControl.isValid}
        onClick={async () => {
          overlay.toggle()
          const id = await PersonApi.save(person, userId, (v, t) =>
            overlay.setProgress(v, t),
          )
          setTimeout(() => overlay.setVisible(false), 1000)
          router.replace(
            !!router.query.id ? `/admin/persons` : `/admin/persons/${id}`,
          )
        }}
      >
        Save
      </Button>
    </article>
  )
})
