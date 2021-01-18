import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { PersonModel } from '../Person.model'
import { useAuth } from '../../services/auth/Auth'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { useFormControl } from '../../form/formControl/useFormControl'
import { PersonApi } from '../Person.api'
import { Button } from '../../form/button/Button'
import s from './PersonForm.module.scss'
import { CompanyModel } from '../../company/Company.model'
import { CompanyApi } from '../../company/Company.api'
import { OverlayConfirm } from '../../shared/overlay/OverlayConfirm'
import ArticleApi from '../../article/Article.api'
import { ArticleModel } from '../../article/Article.model'
import { COLOR } from '../../styles/_color'
import { runInAction } from 'mobx'
import { LookupSelect } from '../../form/lookupSelect/LookupSelect'
import { ImageEdit } from '../../form/imageEdit/ImageEdit'
import { ImageSet } from '../../article/content/image/ImageSet'
import { ImageFormat } from '../../article/content/image/ImageFormat'

interface Props {
  person: PersonModel
}

export const PersonForm = observer((props: Props) => {
  const { person: _person } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const auth = useAuth()

  const [formControl, person] = useFormControl(_person, [
    { field: 'name', required: true },
  ])

  const [companies, setCompanies] = useState<CompanyModel[]>([])
  const [articles, setArticles] = useState<ArticleModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const load = useCallback(async () => {
    setLoading(true)
    const c = await CompanyApi.all()
    setCompanies(c)
    if (person.id) {
      const a = await ArticleApi.byPersonId(person.id)
      setArticles(a)
    }
    setLoading(false)
  }, [person])

  useEffect(() => void load(), [load])
  useEffect(() => {
    if (!!companies.length && !!person.companyId) {
      person.company = companies.find((c) => c.id === person.companyId)
    }
  }, [person, companies])

  if (!formControl) {
    return null
  }

  return (
    <article className={s.container}>
      <div className={s.buttonsContainer}>
        <Button
          disabled={formControl.isClean || !formControl.isValid || loading}
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

        <Button
          onClick={() => {
            if (formControl.isDirty) {
              overlay.setChildren(
                <OverlayConfirm
                  title="Are you sure?"
                  message="You have unsaved changes. Are you sure you want to leave this page?"
                  onOk={() => router.back()}
                />,
              )
              overlay.setVisible(true)
            } else {
              router.back()
            }
          }}
        >
          {formControl.isDirty ? 'Cancel' : 'Back'}
        </Button>

        {!!person.id && (
          <Button
            disabled={loading}
            onClick={async () => {
              overlay.setChildren(
                <OverlayConfirm
                  title={`Delete ${person.name}?`}
                  onOk={async () => {
                    overlay.toggle()
                    overlay.setProgress(0.1, 'Removing reference from articles')
                    await Promise.all(
                      articles.map(async (a) => {
                        a.personIds.filter((id) => id !== person.id)
                        await ArticleApi.save(a, userId)
                      }),
                    )
                    await PersonApi.delete(
                      person,
                      auth.userId,
                      (v, t) => overlay.setProgress(v, t),
                      0.2,
                    )
                    setTimeout(() => {
                      overlay.toggle(false)
                      router.replace('/admin/persons')
                    }, 1000)
                  }}
                >
                  <p>
                    Are you really, really sure want to delete {person.name}?
                  </p>
                  {!!articles.length && (
                    <div>
                      <p>
                        There {articles.length > 1 ? 'are' : 'is'}{' '}
                        {articles.length} article
                        {articles.length > 1 ? 's' : null} that references this
                        person: {articles.map((a) => a.title).join(', ')}
                      </p>
                    </div>
                  )}
                </OverlayConfirm>,
              )
              overlay.toggle()
            }}
            color={COLOR.RED}
          >
            Delete
          </Button>
        )}
      </div>

      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        value={person.name}
        onChange={(e) =>
          runInAction(() => (formControl.mutable.name = e.target.value))
        }
      />

      <label htmlFor="company">Company</label>
      <LookupSelect<CompanyModel>
        id="company"
        selected={person.company}
        onSelect={(c) =>
          runInAction(() => {
            person.companyId = !!c ? c.id : null
            person.company = c
          })
        }
        url={!!person.companyId && `/admin/companies/${person.companyId}`}
        displayField="name"
        showEmptyOption
        onInput={(v) =>
          companies.filter(
            (c) =>
              c.name.includes(v) &&
              (!person.companyId || person.companyId !== c.id),
          )
        }
        onCreate={async (v) => {
          setLoading(true)
          const company = new CompanyModel()
          company.name = v
          const id = await CompanyApi.save(company, auth.userId)
          person.companyId = id
          await load()
          setLoading(false)
        }}
        disabled={loading}
      />

      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        value={person.title}
        onChange={(e) => runInAction(() => (person.title = e.target.value))}
      />

      <label htmlFor="web">Web site</label>
      <input
        type="text"
        id="web"
        value={person.web}
        onChange={(e) => runInAction(() => (person.web = e.target.value))}
      />

      <label htmlFor="image" style={{ marginBottom: '1rem' }}>
        Image
      </label>
      <ImageEdit
        set={person.image}
        format={person.imageFormat}
        onFocus={() => {
          person.image = new ImageSet()
          person.imageFormat = new ImageFormat()
        }}
        onChange={(imageSet) => runInAction(() => (person.image = imageSet))}
      />
    </article>
  )
})
