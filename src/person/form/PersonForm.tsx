import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { PersonModel } from '../models/Person.model'
import { useAuth } from '../../services/auth/Auth'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { useFormControl } from '../../services/formControl/useFormControl'
import { PersonApi } from '../Person.api'
import { Button } from '../../shared/button/Button'
import s from './PersonForm.module.scss'
import { CompanyModel } from '../../company/models/Company.model'
import { CompanyApi } from '../../company/Company.api'
import { OverlayConfirm } from '../../shared/overlay/OverlayConfirm'
import ArticleApi from '../../article/Article.api'
import { ArticleModel } from '../../article/models/Article.model'
import { COLOR } from '../../styles/_color'
import { runInAction } from 'mobx'
import { LookupSelect } from '../../shared/lookupSelect/LookupSelect'
import { ImageEdit } from '../../image/imageEdit/ImageEdit'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from '../../article/models/ImageFormat'
import { isNil } from '../../services/importHelpers'
import TextareaAutosize from 'react-textarea-autosize'
import { useErrorModal } from '../../shared/error/useErrorModal'

interface Props {
  person: PersonModel
}

export const PersonForm = observer((props: Props) => {
  const { person: _person } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const auth = useAuth()
  const { showError } = useErrorModal()

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
      runInAction(
        () =>
          (person.company = companies.find((c) => c.id === person.companyId)),
      )
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
            try {
              setLoading(true)
              overlay.toggle()
              const id = await PersonApi.save(person, userId, (v, t) =>
                overlay.setProgress(v, t),
              )
              setTimeout(() => overlay.toggle(false), 1000)
              router.replace(
                !!router.query.id ? `/admin/persons` : `/admin/persons/${id}`,
              )
            } catch (e) {
              showError(e)
            } finally {
              setLoading(false)
            }
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
              overlay.toggle(true)
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

        {!!person.id && (
          <a
            className={s.link}
            href={`/persons/${person.slug}`}
            target="_blank"
          >
            {`/persons/${person.slug}`}
          </a>
        )}
      </div>

      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        value={person.name}
        onFocus={(e) => e.target.select()}
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
        onInput={(v) => companies.filter((c) => c.name.includes(v))}
        onCreate={async (v) => {
          try {
            setLoading(true)
            const company = new CompanyModel()
            company.name = v
            const id = await CompanyApi.save(company, auth.userId)
            person.companyId = id
            await load()
          } catch (e) {
            showError(e)
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
      />

      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        value={person.title}
        onFocus={(e) => e.target.select()}
        onChange={(e) => runInAction(() => (person.title = e.target.value))}
      />

      <label htmlFor="web">Web site</label>
      <input
        type="url"
        id="web"
        value={person.web}
        placeholder={'https://'}
        onFocus={(e) => {
          if (person.web === '' || isNil(person.web)) {
            runInAction(() => (person.web = 'https://www.facebook.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (person.web = e.target.value))}
      />

      <label htmlFor="facebook">Facebook</label>
      <input
        type="url"
        id="facebook"
        value={person.facebook}
        placeholder={'https://www.facebook.com/'}
        onFocus={(e) => {
          if (person.facebook === '' || isNil(person.facebook)) {
            runInAction(() => (person.facebook = 'https://www.facebook.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (person.facebook = e.target.value))}
      />

      <label htmlFor="instagram">Instagram</label>
      <input
        type="url"
        id="instagram"
        value={person.instagram}
        placeholder={'https://www.instagram.com/'}
        onFocus={(e) => {
          if (person.instagram === '' || isNil(person.instagram)) {
            runInAction(() => (person.instagram = 'https://www.instagram.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (person.instagram = e.target.value))}
      />

      <label htmlFor="twitter">Twitter</label>
      <input
        type="url"
        id="twitter"
        value={person.twitter}
        placeholder={'https://twitter.com/'}
        onFocus={(e) => {
          if (person.twitter === '' || isNil(person.twitter)) {
            runInAction(() => (person.twitter = 'https://twitter.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (person.twitter = e.target.value))}
      />

      <label htmlFor="description">Description</label>
      <TextareaAutosize
        id="description"
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          runInAction(() => (person.description = e.target.value))
        }
        value={person.description}
        placeholder="Write a short presentation"
      />

      <label htmlFor="image" style={{ marginBottom: '1rem' }}>
        Image
      </label>
      <ImageEdit
        set={person.imageSet}
        format={person.imageFormat}
        onFocus={() => {
          person.imageSet = new ImageSet()
          person.imageFormat = new ImageFormat()
        }}
        onChange={(imageSet) => runInAction(() => (person.imageSet = imageSet))}
      />
    </article>
  )
})
