import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { ArticleModel } from '../models/Article.model'
import { ArticleListRow } from './ArticleListRow'
import s from './ArticleList.module.scss'
import { SortOrderIcon } from '../../shared/sortOrderIcon/SortOrderIcon'
import { useSortOrder } from '../../hooks/useSortOrder'
import { Button } from '../../shared/button/Button'
import { useAutorun } from '../../hooks/useAutorun'

interface Props {
  articles: ArticleModel[]
}

export const ArticleList = observer(({ articles }: Props) => {
  const router = useRouter()

  const [sorted, setSorted] = useState<ArticleModel[]>(articles.slice())
  const [sortOrder, setSortOrder] = useSortOrder<ArticleModel>({
    key: 'sortOrder',
    order: 'desc',
  })

  useAutorun(() => {
    setSorted(
      articles.slice().sort((a1, a2) => {
        const smaller = a1[sortOrder.key] < a2[sortOrder.key]
        return sortOrder.order === 'asc' ? (smaller ? -1 : 1) : smaller ? 1 : -1
      }),
    )
  }, [sortOrder, articles])

  return (
    <article className={s.list}>
      <h1>
        Articles{' '}
        <Button onClick={() => router.push('/admin/articles/create')}>
          Create
        </Button>
      </h1>
      <table summary="List of articles for admin purposes">
        <thead>
          <tr>
            <th role="button" onClick={() => setSortOrder('sortOrder')}>
              <span>#</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'sortOrder'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('title')}>
              <span>Title</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'title'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('type')}>
              <span>Type</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'type'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('published')}>
              <span>Status</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'published'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('promoted')}>
              <span>Promoted</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'promoted'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('created')}>
              <span>Created</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'created'}
              />
            </th>

            <th role="button" onClick={() => setSortOrder('modified')}>
              <span>Last modified</span>
              <SortOrderIcon
                order={sortOrder.order}
                visible={sortOrder.key === 'modified'}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((article) => (
            <React.Fragment key={article.id}>
              <ArticleListRow
                article={article}
                all={articles}
                listSortOrder={sortOrder}
              />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </article>
  )
})
