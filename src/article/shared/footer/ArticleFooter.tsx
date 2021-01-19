import React, { useRef } from 'react'
import s from './ArticleFooter.module.scss'
import { TagsView } from '../../../tag/Tags/TagsView'
import { Share } from '../share/Share'
import { ArticleModel } from '../../Article.model'
import { observer } from 'mobx-react'
import { Person } from '../../../person/Person'
import Link from 'next/link'
import { Company } from '../../../company/Company'

interface Props {
  article: ArticleModel
}

export const ArticleFooter = observer(({ article }: Props) => {
  const gridRow = useRef(
    article.sections.reduce(
      (row, section) =>
        section.format.gridPosition.endRow > row
          ? section.format.gridPosition.endRow
          : row,
      0,
    ),
  ).current

  return (
    <>
      <div className={s.background} style={{ gridRow }} />
      <footer className={s.footer} style={{ gridRow }}>
        <div className={s.row}>
          <Share article={article} />
          <TagsView tagNames={article.tagNames} containerClassName={s.tags} />
        </div>
        <div className={s.inThisArticle}>
          <h3>In this article</h3>
          <div className={s.cardsWrapper}>
            {article.persons.map((person) => (
              <Link href={`/persons/${person.slug}`} key={person.id}>
                <a>
                  <Person person={person} />
                </a>
              </Link>
            ))}
            {article.companies.map((company) => (
              <Link href={`/companies/${company.slug}`} key={company.id}>
                <a>
                  <Company company={company} />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
})
