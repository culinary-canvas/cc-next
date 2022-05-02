import Link from 'next/link'
import React, { useState } from 'react'
import {IssueService} from '../../issue/Issue.service'
import { useAuth } from '../../services/auth/Auth'
import StringUtils from '../../services/utils/StringUtils'
import { Button } from '../../shared/button/Button'
import { ArticleApi } from '../Article.api'
import { ArticleService } from '../Article.service'
import { ArticleModel } from '../models/Article.model'
import s from './ArticleListRow.module.scss'
import { SortOrder } from './SortOrder'

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
                toSave.map(async (a) => await ArticleApi.save(a, auth.userId)),
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
                toSave.map(async (a) => await ArticleApi.save(a, auth.userId)),
              )
              saving(false)
            }}
          >
            +
          </Button>
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
      <td>{IssueService.toDisplayText(article.issue)}</td>
      <td>{StringUtils.toDisplayText(article.type)}</td>
      <td>{article.published ? 'Published' : 'WIP'}</td>
      <td>{article.created.toLocaleDateString()}</td>
      <td>{article.modified.toLocaleDateString()}</td>
    </tr>
  )
}
