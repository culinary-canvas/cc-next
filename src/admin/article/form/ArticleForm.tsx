import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { classnames } from '../../../services/importHelpers'
import { SectionEdit } from './section/SectionEdit'
import s from './ArticleForm.module.scss'
import { useAdmin } from '../../Admin'
import { ArticleFooter } from '../../../article/shared/footer/ArticleFooter'
import { ArticleService } from '../../../article/Article.service'
import { useAutorun } from '../../../hooks/useAutorun'
import { PersonModel } from '../../../person/Person.model'
import { PersonApi } from '../../../person/Person.api'
import { CompanyModel } from '../../../company/Company.model'
import { CompanyApi } from '../../../company/Company.api'

interface Props {}

export const ArticleForm = observer((props: Props) => {
  const admin = useAdmin()
  const { article } = admin
  const [persons, setPersons] = useState<PersonModel[]>([])
  const [companies, setCompanies] = useState<CompanyModel[]>([])

  useAutorun(() => {
    !!article && PersonApi.byIds(article.personIds).then((p) => setPersons(p))
  }, [article])

  useAutorun(() => {
    !!article &&
      CompanyApi.byIds(article.companyIds).then((c) => setCompanies(c))
  }, [article])

  const checkForUnlinkedMentions = useCallback(() => {
    persons.forEach((p) =>
      ArticleService.addLinks(article, p.name, `/persons/${p.slug}`),
    )
    companies.forEach((c) =>
      ArticleService.addLinks(article, c.name, `/companies/${c.slug}`),
    )
  }, [persons, companies, article])

  if (!article) {
    return null
  }

  return (
    <>
      <article
        className={classnames(s.content, `type-${article?.type}`)}
        style={{ backgroundColor: article.format.backgroundColor }}
      >
        {article.sections.map((section, i) => (
          <SectionEdit
            key={section.uid}
            section={section}
            first={section.format.gridPosition.startRow === 1}
          />
        ))}
        <ArticleFooter article={article} />
      </article>
    </>
  )
})
