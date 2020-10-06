import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { useEnv } from '../../services/AppEnvironment'
import { Article } from '../../domain/Article/Article'
import { ArticleListRow } from './ArticleListRow'

interface Props {
  articles: Article[]
}

export const ArticleList = observer(({ articles }: Props) => {
  const env = useEnv()
  const router = useRouter()

  const [currentSort, setCurrentSort] = useState<{
    key: keyof Article
    asc: boolean
  }>({ key: 'sortOrder', asc: false })

  return (
    <div className="content list">
      <div className="title">
        <h1>Articles</h1>
        <button
          className="create-article-button"
          onClick={() => router.push('/admin/articles/create')}
        >
          Create
        </button>
      </div>
      <table summary="List of articles for admin purposes">
        <thead>
          <tr>
            <th
              role="button"
              onClick={() =>
                sort(
                  'sortOrder',
                  currentSort.key === 'sortOrder' ? !currentSort.asc : true,
                )
              }
            >
              Sort order
              {currentSort.key === 'sortOrder' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
            <th
              role="button"
              onClick={() =>
                sort(
                  'title',
                  currentSort.key === 'title' ? !currentSort.asc : true,
                )
              }
            >
              Title
              {currentSort.key === 'title' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
            <th
              role="button"
              onClick={() =>
                sort(
                  'type',
                  currentSort.key === 'type' ? !currentSort.asc : true,
                )
              }
            >
              Type
              {currentSort.key === 'type' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
            <th
              role="button"
              onClick={() =>
                sort(
                  'published',
                  currentSort.key === 'published' ? !currentSort.asc : true,
                )
              }
            >
              Status
              {currentSort.key === 'published' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
            <th
              role="button"
              onClick={() =>
                sort(
                  'created',
                  currentSort.key === 'created' ? !currentSort.asc : true,
                )
              }
            >
              Created
              {currentSort.key === 'created' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
            <th
              role="button"
              onClick={() =>
                sort(
                  'modified',
                  currentSort.key === 'modified' ? !currentSort.asc : true,
                )
              }
            >
              Last modified
              {currentSort.key === 'modified' &&
                (currentSort.asc ? '&#8593;' : '&#8595;')}
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <React.Fragment key={article.id}>
              <ArticleListRow
                article={article}
                all={articles}
                currentSort={currentSort}
                onSortChange={() => sort('sortOrder', currentSort.asc)}
              />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )

  function sort(key: keyof Article = 'sortOrder', asc = true) {
    console.log(
      'sorting',
      key,
      articles.map((a) => a[key]),
    )
    /*setArticles(
      articles.slice().sort((a1, a2) => {
        if (asc) {
          return a1[key] < a2[key] ? -1 : 1
        }
        return a1[key] > a2[key] ? -1 : 1
      }),
    )*/
    setCurrentSort({ key, asc })
  }
})
