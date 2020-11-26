import React, { useState } from 'react'
import { ArticleModel } from '../../../article/Article.model'
import Link from 'next/link'
import { dateTimeService } from '../../../services/dateTime/DateTime.service'
import s from './ArticleListRow.module.scss'
import { SortOrder } from './SortOrder'
import StringUtils from '../../../services/utils/StringUtils'
import { ArticleService } from '../../../article/Article.service'
import { Button } from '../../../form/button/Button'
import { ArticleApi } from '../../../article/Article.api'
import { useAuth } from '../../../services/auth/Auth'

interface Props {
  article: ArticleModel
  all: ArticleModel[]
  listSortOrder: SortOrder
}

export const ArticleListRow = (props: Props) => {
  const { article, all, listSortOrder } = props
  const auth = useAuth()
  const [isSaving, saving] = useState<boolean>(false)

  return (
    <tr key={article.id}>
      <td>
        <section className={s.sortOrderContainer}>
          <Button
            disabled={
              isSaving ||
              listSortOrder.key !== 'sortOrder' ||
              article.sortOrder - 1 < 0
            }
            onClick={async () => {
              saving(true)
              const toSave = ArticleService.changeSortOrderDown(article, all)
              await Promise.all(
                toSave.map(async (a) => await ArticleApi.save(a, auth.user)),
              )
              saving(false)
            }}
          >
            -
          </Button>

          <Button
            disabled={
              isSaving ||
              listSortOrder.key !== 'sortOrder' ||
              article.sortOrder + 2 > all.length
            }
            onClick={async () => {
              saving(true)
              const toSave = ArticleService.changeSortOrderUp(article, all)
              await Promise.all(
                toSave.map(async (a) => await ArticleApi.save(a, auth.user)),
              )
              saving(false)
            }}
          >
            +
          </Button>
          {article.sortOrder}
        </section>
      </td>
      <td className={s.title}>
        <Link
          href="/admin/articles/[slug]"
          as={`/admin/articles/${article.slug}`}
        >
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
