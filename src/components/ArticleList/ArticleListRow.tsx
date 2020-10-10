import React from 'react'
import { SortOrderButtons } from '../AdminSidebar/Controls/Elements/SortOrderButtons/SortOrderButtons'
import { Article } from '../../domain/Article/Article'
import Link from 'next/Link'
import { dateTimeService } from '../../domain/DateTime/DateTime.service'
import s from './ArticleListRow.module.scss'
import { SortOrder } from './SortOrder'
import StringUtils from '../../services/utils/StringUtils'

interface Props {
  article: Article
  all: Article[]
  listSortOrder: SortOrder
  onSortChange: () => any
}

export const ArticleListRow = (props: Props) => {
  const { article, all, listSortOrder, onSortChange } = props

  return (
    <tr key={article.id}>
      <td>
        <SortOrderButtons
          target={article}
          list={all}
          onChange={async ([target, other]) => {
            // TODO
            //await env.articleStore.save(target)
            //await env.articleStore.save(other)
            // env.articleStore.setArticles(all)
            onSortChange()
          }}
          disabled={listSortOrder.key !== 'sortOrder'}
        />
      </td>
      <td className={s.title}>
        <Link href="/admin/articles/[slug]" as={`/admin/articles/${article.slug}`}>
          <a>{article.title}</a>
        </Link>
      </td>
      <td>{StringUtils.toDisplayText(article.type)}</td>
      <td>{article.published ? 'Published' : 'WIP'}</td>
      <td>{dateTimeService.calendar(article.created)}</td>
      <td>{dateTimeService.calendar(article.modified)}</td>
    </tr>
  )
}
