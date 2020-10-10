import React, { useState } from 'react'
import copyPasteIcon from '../../../../../public/assets/icons/streamline-icon-copy-paste@140x140.svg'
import editIcon from '../../../../../public/assets/icons/streamline-icon-pencil-write-3-alternate@140x140.svg'
import { observer } from 'mobx-react'
import { Checkbox } from '../../../Checkbox/Checkbox'
import { Select } from '../../../Select/Select'
import { useAutorun } from '../../../../hooks/useAutorun'
import { runInAction, toJS } from 'mobx'
import { Tags } from '../../../Tags/Tags'
import { Button } from '../../../Button/Button'
import { Tooltip } from '../../../Tooltip/Tooltip'
import { Article } from '../../../../domain/Article/Article'
import StringUtils from '../../../../services/utils/StringUtils'
import { copyTextToClipboard } from '../../../../services/utils/Utils'
import { ArticleType } from '../../../../domain/Article/ArticleType'
import s from './ArticleControls.module.scss'
import { ArticleApi } from '../../../../domain/Article/Article.api'
import { Transformer } from '../../../../services/db/Transformer'
import { useAdmin } from '../../../../services/admin/Admin.store'

export const ArticleControls = observer(() => {
  const admin = useAdmin()
  const [otherArticles, setOtherArticles] = useState<Article[]>([])
  const [article, setArticle] = useState<Article>()
  const [editingSlug, editSlug] = useState<boolean>(false)

  useAutorun(() => setArticle(admin.article))

  useAutorun(() => {
    if (!!article) {
      ArticleApi.all().then((all) => {
        const other = all.filter((a) => a.id !== article.id && !a.parentId)
        const transformed = other.map((a) => Transformer.toApp(a, Article))
        setOtherArticles(transformed)
      })
    }
  }, [article])

  if (!article) {
    return null
  }

  return (
    <section className={s.controls}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        placeholder="Article title (required)"
        value={article.title}
        onChange={(event) =>
          runInAction(() => (article.titleContent.value = event.target.value))
        }
      />

      <label htmlFor="url">URL</label>
      <span
        className={s.urlContainer}
        data-tip="URL can be shared for unpublished article"
        data-for="url-tooltip"
      >
        <Tooltip id="url-tooltip" />
        <input
          disabled={!editingSlug}
          type="text"
          id="url"
          placeholder="Article page URL"
          value={!editingSlug ? `/${article.slug || ''}` : article.slug}
          onChange={(event) => (article.slug = event.target.value)}
          onBlur={() => {
            editSlug(false)
            article.slug = StringUtils.toLowerKebabCase(article.slug)
          }}
        />

        <Button
          unsetStyle
          onClick={() => editSlug(!editingSlug)}
          onKeyPress={() => editSlug(!editingSlug)}
        >
          <img src={editIcon} alt="Edit" />
        </Button>

        <Button
          unsetStyle
          onClick={() =>
            copyTextToClipboard(
              `https://culinary-canvas.com/articles/${article.slug}`,
            )
          }
          onKeyPress={() =>
            copyTextToClipboard(
              `https://culinary-canvas.com/articles/${article.slug}`,
            )
          }
        >
          <img src={copyPasteIcon} alt="Copy" />
        </Button>
      </span>

      <Checkbox
        label="Published"
        checked={article.published}
        onChange={(v) => (article.published = v)}
      />

      <Checkbox
        label="Promoted"
        checked={article.promoted}
        onChange={(v) => (article.promoted = v)}
      />

      <label htmlFor="type">Type</label>
      <Select
        id="type"
        value={article.type}
        options={Object.values(ArticleType)}
        onChange={(v) => (article.type = v)}
        displayFormatter={(v) => StringUtils.toDisplayText(v)}
      />

      <label htmlFor="parent">Parent article</label>
      <Select
        id="parent"
        value={article.parentId}
        options={otherArticles.map((a) => a.id)}
        onChange={(v) => (article.parentId = v)}
        displayFormatter={(v) => otherArticles.find((a) => a.id === v).title}
        showEmptyOption
      />

      <label htmlFor="tags">Tags</label>
      <Tags
        selected={toJS(article.tagNames)}
        edit
        onAdd={(tag) => article.tagNames.push(tag)}
        onRemove={(tag) =>
          (article.tagNames = article.tagNames.filter((id) => id !== tag))
        }
      />
    </section>
  )
})
