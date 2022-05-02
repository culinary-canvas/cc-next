import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { CompanyModel } from '../models/Company.model'
import { useAuth } from '../../services/auth/Auth'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { useFormControl } from '../../services/formControl/useFormControl'
import { CompanyApi } from '../Company.api'
import { Button } from '../../shared/button/Button'
import s from './CompanyForm.module.scss'
import { OverlayConfirm } from '../../shared/overlay/OverlayConfirm'
import { PersonModel } from '../../person/models/Person.model'
import { ArticleModel } from '../../article/models/Article.model'
import { PersonApi } from '../../person/Person.api'
import ArticleApi from '../../article/Article.api'
import { COLOR } from '../../styles/_color'
import { runInAction, toJS } from 'mobx'
import { ImageEdit } from '../../image/imageEdit/ImageEdit'
import { ImageSet } from '../../image/models/ImageSet'
import { ImageFormat } from '../../article/models/ImageFormat'
import { Select } from '../../shared/select/Select'
import StringUtils from '../../services/utils/StringUtils'
import { CompanyType } from '../models/CompanyType'
import { isNil } from '../../services/importHelpers'
import TextareaAutosize from 'react-textarea-autosize'
import { useErrorModal } from '../../shared/error/useErrorModal'
import { TextEditMenu } from '../../article/form/text/TextEditMenu'
import { Checkbox } from '../../shared/checkbox/Checkbox'

interface Props {
  company: CompanyModel
}

export const CompanyForm = observer((props: Props) => {
  const { company: _company } = props
  const { userId } = useAuth()
  const overlay = useOverlay()
  const router = useRouter()
  const auth = useAuth()
  const { showError } = useErrorModal()
  const [formControl, company] = useFormControl(_company, [
    { field: 'name', required: true },
  ])

  const textareaRef = useRef<HTMLTextAreaElement>()

  const [loading, setLoading] = useState<boolean>(true)
  const [persons, setPersons] = useState<PersonModel[]>([])
  const [articles, setArticles] = useState<ArticleModel[]>([])
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  })

  const load = useCallback(async () => {
    if (company.id) {
      const p = await PersonApi.byCompanyId(company.id)
      setPersons(p)
      const a = await ArticleApi.byCompanyId(company.id)
      setArticles(a)
    }
    setLoading(false)
  }, [company])

  useEffect(() => {
    load()
  }, [load])

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
              const id = await CompanyApi.save(company, userId, (v, t) =>
                overlay.setProgress(v, t),
              )
              setTimeout(() => overlay.toggle(false), 1000)
              router.replace(
                !!router.query.id
                  ? `/admin/companies`
                  : `/admin/companies/${id}`,
              )
            } catch (e) {
              showError(e)
              console.error(e)
            } finally {
              setLoading(false)
            }
          }}
        >
          Save
        </Button>

        <Button
          onClick={async () => {
            if (formControl.isDirty) {
              overlay.setChildren(
                <OverlayConfirm
                  title="Are you sure?"
                  message={`You have unsaved changes. Are you sure you want to leave this page?`}
                  onOk={() => router.back()}
                />,
              )
              overlay.toggle()
            } else {
              router.back()
            }
          }}
        >
          {formControl.isDirty ? 'Cancel' : 'Back'}
        </Button>

        {!!company.id && (
          <Button
            disabled={loading}
            onClick={async () => {
              overlay.setChildren(
                <OverlayConfirm
                  title={`Delete ${company.name}?`}
                  onOk={async () => {
                    overlay.toggle()
                    overlay.setProgress(0.1, 'Removing reference from persons')
                    await Promise.all(
                      persons.map(async (p) => {
                        p.companyId = null
                        await PersonApi.save(p, userId)
                      }),
                    )
                    overlay.setProgress(0.2, 'Removing reference from articles')
                    await Promise.all(
                      articles.map(async (c) => {
                        c.companyIds.filter((id) => id !== company.id)
                        await ArticleApi.save(c, userId)
                      }),
                    )
                    await CompanyApi.delete(
                      company,
                      auth.userId,
                      (v, t) => overlay.setProgress(v, t),
                      0.3,
                    )
                    setTimeout(() => {
                      overlay.toggle(false)
                      router.replace('/admin/companies')
                    }, 1000)
                  }}
                >
                  <p>
                    Are you really, really sure want to delete {company.name}?
                  </p>
                  {!!persons.length && (
                    <div>
                      <p>
                        There {persons.length > 1 ? 'are' : 'is'}{' '}
                        {persons.length} person{persons.length > 1 ? 's' : null}{' '}
                        that references this company:{' '}
                        {persons.map((p) => p.name).join(', ')}
                      </p>
                    </div>
                  )}
                  {!!articles.length && (
                    <div>
                      <p>
                        There {articles.length > 1 ? 'are' : 'is'}{' '}
                        {articles.length} article
                        {articles.length > 1 ? 's' : null} that references this
                        company: {articles.map((a) => a.title).join(', ')}
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

        {!!company.id && (
          <a
            className={s.link}
            href={`/companies/${company.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            {`/companies/${company.slug}`}
          </a>
        )}
      </div>

      <label htmlFor="name">Name*</label>
      <input
        type="text"
        id="name"
        value={company.name}
        onFocus={(e) => e.target.select()}
        onChange={(e) =>
          runInAction(() => (formControl.mutable.name = e.target.value))
        }
      />

      <Checkbox
        checked={company.partner}
        onChange={(v) => runInAction(() => (company.partner = v))}
        label="Partner"
        containerClassName={s.buttonsContainer}
      />

      <label htmlFor="type">Type</label>
      <Select
        value={company.type}
        options={Object.values(CompanyType).sort((t1, t2) =>
          t1.localeCompare(t2),
        )}
        displayFormatter={(v) => StringUtils.toDisplayText(v)}
        onChange={(v) => runInAction(() => (company.type = v))}
      />

      <label htmlFor="web">Web site</label>
      <input
        type="url"
        id="web"
        value={company.web}
        placeholder={'https://'}
        onFocus={(e) => {
          if (company.web === '' || isNil(company.web)) {
            runInAction(() => (company.web = 'https://www.facebook.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (company.web = e.target.value))}
      />

      <label htmlFor="facebook">Facebook</label>
      <input
        type="url"
        id="facebook"
        value={company.facebook}
        placeholder={'https://www.facebook.com/'}
        onFocus={(e) => {
          if (company.facebook === '' || isNil(company.facebook)) {
            runInAction(() => (company.facebook = 'https://www.facebook.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (company.facebook = e.target.value))}
      />

      <label htmlFor="instagram">Instagram</label>
      <input
        type="url"
        id="instagram"
        value={company.instagram}
        placeholder={'https://www.instagram.com/'}
        onFocus={(e) => {
          if (company.instagram === '' || isNil(company.instagram)) {
            runInAction(
              () => (company.instagram = 'https://www.instagram.com/'),
            )
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) =>
          runInAction(() => (company.instagram = e.target.value))
        }
      />

      <label htmlFor="twitter">Twitter</label>
      <input
        type="url"
        id="twitter"
        value={company.twitter}
        placeholder={'https://twitter.com/'}
        onFocus={(e) => {
          if (company.twitter === '' || isNil(company.twitter)) {
            runInAction(() => (company.twitter = 'https://twitter.com/'))
          }
          setTimeout(() => e.target.select(), 100)
        }}
        onChange={(e) => runInAction(() => (company.twitter = e.target.value))}
      />

      <label htmlFor="description" style={{ marginTop: '3rem' }}>
        Description
      </label>
      <TextEditMenu
        text={company.description}
        selectionStart={selection.start}
        selectionEnd={selection.end}
        onTextChange={(text) => runInAction(() => (company.description = text))}
      />
      <TextareaAutosize
        ref={textareaRef}
        id="description"
        onChange={(e) =>
          runInAction(() => (company.description = e.target.value))
        }
        value={company.description}
        placeholder="Write a short presentation"
        onBlur={(e) => {
          e.target.setSelectionRange(selection.start, selection.end)
        }}
        onMouseUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
        onKeyUp={() =>
          setSelection({
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          })
        }
      />

      <label htmlFor="image" style={{ marginBottom: '1rem' }}>
        Image
      </label>
      <ImageEdit
        set={company.imageSet}
        format={company.imageFormat}
        onFocus={() => {
          company.imageSet = new ImageSet()
          company.imageFormat = new ImageFormat()
        }}
        onChange={(imageSet) =>
          runInAction(() => (company.imageSet = imageSet))
        }
      />
    </article>
  )
})
