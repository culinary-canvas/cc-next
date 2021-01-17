import React, { useCallback, useEffect, useState } from 'react'
import { ArticleModel } from '../../../../../../../article/Article.model'
import s from './CompanyArticleControl.module.scss'
import { LookupSelect } from '../../../../../../../form/lookupSelect/LookupSelect'
import { runInAction } from 'mobx'
import { useAutorun } from '../../../../../../../hooks/useAutorun'
import { useAuth } from '../../../../../../../services/auth/Auth'
import removeIcon from '../../../../../../../../public/assets/icons/streamline-icon-remove-bold@140x140.svg'
import { Button } from '../../../../../../../form/button/Button'
import { CompanyModel } from '../../../../../../../company/Company.model'
import { CompanyApi } from '../../../../../../../company/Company.api'
import { observer } from 'mobx-react'

interface Props {
  article: ArticleModel
}

export const CompaniesArticleControl = observer((props: Props) => {
  const { article } = props
  const auth = useAuth()
  const [all, setAll] = useState<CompanyModel[]>([])
  const [inArticle, setInArticle] = useState<CompanyModel[]>([])
  const [notSelected, setNotSelected] = useState<CompanyModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const load = useCallback(async () => {
    const result = await CompanyApi.all()
    setAll(result)
  }, [])

  useEffect(() => {
    if (!all.length) {
      load()
    }
  }, [all, load])

  useAutorun(() => {
    if (!!all.length) {
      setInArticle(article.companyIds.map((id) => all.find((c) => c.id === id)))
      setNotSelected(all.filter((c) => !article.companyIds.includes(c.id)))
    }
  }, [all])

  return (
    <>
      <div className={s.inArticleContainer}>
        <ul>
          {inArticle.map((c) => (
            <li key={c.id}>
              <figure>{!!c.image && <img src={c.image.cropped.url} />}</figure>

              <a
                className={s.companyLink}
                href={`/admin/companies/${c.id}`}
                target="_blank"
              >
                {c.name}
              </a>

              <Button
                onClick={() =>
                  runInAction(
                    () =>
                      (article.companyIds = article.companyIds.filter(
                        (id) => id !== c.id,
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

      <LookupSelect<CompanyModel>
        id="companies"
        onSelect={(c) =>
          runInAction(() => {
            article.companyIds.push(c.id)
          })
        }
        displayField="name"
        onInput={(v) => notSelected.filter((c) => c.name.includes(v))}
        onCreate={async (v) => {
          setLoading(true)
          const company = new CompanyModel()
          company.name = v
          const companyId = await CompanyApi.save(company, auth.userId)
          await load()
          runInAction(() => article.companyIds.push(companyId))
          setLoading(false)
        }}
        disabled={loading}
      />
    </>
  )
})