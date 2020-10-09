import React, { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { Article } from '../../domain/Article/Article'
import { ArticleListRow } from './ArticleListRow'
import s from './ArticleList.module.scss'
import { SortOrderIcon } from '../SortOrderIcon/SortOrderIcon'
import { useSortOrder } from '../../hooks/useSortOrder'
import { Button } from '../Button/Button'

interface Props {
  articles: Article[]
}

export const ArticleList = observer(({ articles }: Props) => {
  const router = useRouter()

  const [sorted, setSorted] = useState<Article[]>(articles.slice())
  const [sortOrder, setSortOrder] = useSortOrder<Article>({
    key: 'sortOrder',
    order: 'desc',
  })

  const getSorted = useCallback(() => {
    return articles.slice().sort((a1, a2) => {
      const smaller = a1[sortOrder.key] < a2[sortOrder.key]
      return sortOrder.order === 'asc' ? (smaller ? -1 : 1) : smaller ? 1 : -1
    })
  }, [sortOrder, articles])

  useEffect(() => {
    setSorted(getSorted())
  }, [sortOrder, articles])

  return (
    <article className={s.list}>
      <div className={s.title}>
        <h1>
          Articles{' '}
          <Button onClick={() => router.push('/admin/articles/create')}>
            +
          </Button>
        </h1>
      </div>
      <table summary="List of articles for admin purposes">
        <thead>
          <tr>
            <th role="button" onClick={() => setSortOrder('sortOrder')}>
              <span>Sort order</span>
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
                onSortChange={() => setSorted(getSorted())}
              />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </article>
  )
})
