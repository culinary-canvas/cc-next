import React from 'react'
import { SortOrderButtons } from '../../components/AdminSidebar/Buttons/SortOrderButtons'
import { Article } from '../../domain/Article/Article'
import { useEnv } from '../../services/AppEnvironment'
import { classnames } from '../../services/importHelpers'
import Link from 'next/Link'
import StringUtils from '../../services/utils/StringUtils'
import { dateTimeService } from '../../domain/DateTime/DateTime.service'

interface Props {
  article: Article
  all: Article[]
  child?: boolean
  currentSort: { key: keyof Article; asc: boolean }
  onSortChange: () => any
}

export const ArticleListRow = (props: Props) => {
  const env = useEnv()
  const { article, all, child = false, currentSort, onSortChange } = props

  return (
    <tr key={article.id} className={classnames({ child })}>
      <td className="sort-order">
        <SortOrderButtons
          target={article}
          list={all}
          onChange={async ([target, other]) => {
            //await env.articleStore.save(target)
            //await env.articleStore.save(other)
            env.articleStore.setArticles(all)
            onSortChange()
          }}
          disabled={currentSort.key !== 'sortOrder'}
        />
      </td>
      <td className="title">
        <Link href={`admin/articles/${article.titleForUrl}`}>
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
