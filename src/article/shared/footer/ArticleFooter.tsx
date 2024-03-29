import React, { useEffect, useState } from 'react'
import { useAutorun } from '../../../hooks/useAutorun'
import s from './ArticleFooter.module.scss'
import { TagsView } from '../../../tag/view/TagsView'
import { Share } from '../share/Share'
import { ArticleModel } from '../../models/Article.model'
import { observer } from 'mobx-react-lite'
import { PersonView } from '../../../person/view/PersonView'
import { CompanyView } from '../../../company/view/CompanyView'
import { Button } from '../../../shared/button/Button'
import { useRouter } from 'next/router'

interface Props {
  article: ArticleModel
}

export const ArticleFooter = observer(({ article }: Props) => {
  const router = useRouter()

  const [gridRow, setGridRow] = useState<number>()

  useAutorun(
    () =>
      setGridRow(
        article.sections.reduce(
          (row, section) =>
            section.format.gridPosition.endRow > row
              ? section.format.gridPosition.endRow
              : row,
          0,
        ),
      ),
    [article.sections],
  )

  return (
    <>
      <div className={s.background} style={{ gridRow }} />
      <footer className={s.footer} style={{ gridRow }}>
        <div className={s.row}>
          <Share article={article} />
          <TagsView tagNames={article.tagNames} containerClassName={s.tags} />
        </div>
        {!!article.persons.length || article.companies.length ? (
          <div className={s.inThisArticle}>
            <h2>In this article</h2>
            <div className={s.cardsContainer}>
              {article.persons.map((person) => (
                <Button
                  unsetStyle
                  onClick={() => router.push(`/persons/${person.slug}`)}
                  key={person.id}
                >
                  <PersonView person={person} card />
                </Button>
              ))}
              {article.companies.map((company) => (
                <Button
                  unsetStyle
                  onClick={() => router.push(`/companies/${company.slug}`)}
                  key={company.id}
                >
                  <CompanyView company={company} card />
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </footer>
    </>
  )
})
