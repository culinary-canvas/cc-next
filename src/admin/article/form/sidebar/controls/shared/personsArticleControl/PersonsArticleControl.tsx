import React, { useCallback, useEffect, useState } from 'react'
import { ArticleModel } from '../../../../../../../article/Article.model'
import { PersonModel } from '../../../../../../../person/Person.model'
import { PersonApi } from '../../../../../../../person/Person.api'
import { PersonService } from '../../../../../../../person/Person.service'
import s from './PersonArticleControl.module.scss'
import { LookupSelect } from '../../../../../../../form/lookupSelect/LookupSelect'
import { runInAction } from 'mobx'
import { useAutorun } from '../../../../../../../hooks/useAutorun'
import { useAuth } from '../../../../../../../services/auth/Auth'
import addIcon from '../../../../../../../../public/assets/icons/streamline-icon-add-bold@140x140.svg'
import removeIcon from '../../../../../../../../public/assets/icons/streamline-icon-remove-bold@140x140.svg'
import { Button } from '../../../../../../../form/button/Button'
import { observer } from 'mobx-react'

interface Props {
  article: ArticleModel
}

export const PersonsArticleControl = observer((props: Props) => {
  const { article } = props
  const auth = useAuth()
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
      setInArticle(article.personIds.map((id) => all.find((p) => p.id === id)))
      setNotSelected(all.filter((p) => !article.personIds.includes(p.id)))
    }
  }, [all])

  return (
    <>
      <div className={s.inArticleContainer}>
        <ul>
          {inArticle.map((p) => (
            <li key={p.id}>
              <figure>{!!p.image && <img src={p.image.cropped.url} />}</figure>

              <div className={s.info}>
                <a
                  className={s.personLink}
                  href={`/admin/persons/${p.id}`}
                  target="_blank"
                >
                  {p.name}
                </a>
                <div>
                  <a
                    className={s.companyLink}
                    href={`/admin/companies/${p.companyId}`}
                    target="_blank"
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
                      <img src={addIcon} />
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={() =>
                  runInAction(
                    () =>
                      (article.personIds = article.personIds.filter(
                        (id) => id !== p.id,
                      )),
                  )
                }
                title="Remove"
                className={s.removeButton}
              >
                <img src={removeIcon} />
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
          })
        }
        displayField="name"
        onInput={(v) => notSelected.filter((p) => p.name.includes(v))}
        onCreate={async (v) => {
          setLoading(true)
          const person = new PersonModel()
          person.name = v
          await PersonApi.save(person, auth.userId)
          await load()
          setLoading(false)
        }}
        disabled={loading}
      />
    </>
  )
})
