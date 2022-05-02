import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useState } from 'react'
import slugify from 'voca/slugify'
import addIcon from '../../../../../../../public/assets/icons/streamline-icon-add-bold@140x140.svg'
import removeIcon from '../../../../../../../public/assets/icons/streamline-icon-remove-bold@140x140.svg'
import { useAutorun } from '../../../../../../hooks/useAutorun'
import { PersonModel } from '../../../../../../person/models/Person.model'
import { PersonApi } from '../../../../../../person/Person.api'
import { PersonService } from '../../../../../../person/Person.service'
import { useAuth } from '../../../../../../services/auth/Auth'
import { Button } from '../../../../../../shared/button/Button'
import { useErrorModal } from '../../../../../../shared/error/useErrorModal'
import { LookupSelect } from '../../../../../../shared/lookupSelect/LookupSelect'
import { ArticleService } from '../../../../../Article.service'
import { ArticleModel } from '../../../../../models/Article.model'
import s from './PersonArticleControl.module.scss'

interface Props {
  article: ArticleModel
}

export const PersonsArticleControl = observer((props: Props) => {
  const { article } = props
  const auth = useAuth()
  const { showError } = useErrorModal()

  const [all, setAll] = useState<PersonModel[]>([])
  const [inArticle, setInArticle] = useState<PersonModel[]>([])
  const [notSelected, setNotSelected] = useState<PersonModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const load = useCallback(async () => {
    const result = await PersonApi.all()
    await PersonService.populate(result)
    setAll(result)
  }, [])

  useEffect(() => {
    if (!all.length) {
      load()
    }
  }, [all, load])

  useAutorun(() => {
    if (!!all.length) {
      setInArticle(all.filter((p) => article.personIds.includes(p.id)))
      setNotSelected(all.filter((p) => !article.personIds.includes(p.id)))
    }
  }, [all])

  return (
    <>
      <div className={s.inArticleContainer}>
        <ul>
          {inArticle.map((p) => (
            <li key={p.id}>
              <figure>
                {!!p.imageSet && (
                  <img src={p.imageSet.url} alt={p.imageSet.alt} />
                )}
              </figure>

              <div className={s.info}>
                <a
                  className={s.personLink}
                  href={`/admin/persons/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.name}
                </a>
                <div>
                  <a
                    className={s.companyLink}
                    href={`/admin/companies/${p.companyId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.company?.name}
                  </a>

                  {!article.companyIds.includes(p.companyId) && (
                    <Button
                      onClick={() =>
                        runInAction(() => article.companyIds.push(p.companyId))
                      }
                      title="Add company to article"
                    >
                      <img src={addIcon} alt="Add icon" />
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={() =>
                  runInAction(() => {
                    article.personIds = article.personIds.filter(
                      (id) => id !== p.id,
                    )
                    ArticleService.removeLinks(
                      article,
                      all.find((a) => a.id === p.id).name,
                    )
                  })
                }
                title="Remove"
                className={s.removeButton}
              >
                <img src={removeIcon} alt="Remove icon" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <LookupSelect<PersonModel>
        id="persons"
        onSelect={(p) =>
          runInAction(() => {
            article.personIds.push(p.id)
            ArticleService.addLinks(
              article,
              p.name,
              `/persons/${slugify(p.name)}`,
            )
          })
        }
        displayField="name"
        onInput={(v) =>
          notSelected.filter((p) =>
            p.name.toLowerCase().includes(v.toLowerCase()),
          )
        }
        onCreate={async (v) => {
          try {
            setLoading(true)
            const person = new PersonModel()
            person.name = v
            const personId = await PersonApi.save(person, auth.userId)
            runInAction(() => article.personIds.push(personId))
            await load()
          } catch (e) {
            showError(e)
          } finally {
            setLoading(false)
          }
        }}
        disabled={loading}
      />
    </>
  )
})
