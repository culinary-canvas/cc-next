import React, { useState } from 'react'
import copyPaste from '../../../../public/assets/icons/streamline-icon-copy-paste@140x140.svg'
import { observer } from 'mobx-react'
import { Checkbox } from '../../Checkbox/Checkbox'
import { Select } from '../../Select/Select'
import { useAutorun } from '../../../hooks/useAutorun'
import { runInAction } from 'mobx'
import { Tags } from '../../Tags/Tags'
import { Button } from '../../Button/Button'
import { Tooltip } from '../../Tooltip/Tooltip'
import { Article } from '../../../domain/Article/Article'
import StringUtils from '../../../services/utils/StringUtils'
import { useEnv } from '../../../services/AppEnvironment'
import { copyTextToClipboard } from '../../../services/utils/Utils'
import { ArticleType } from '../../../domain/Article/ArticleType'
import { COLOR } from '../../../styles/color'

export const ArticleControls = observer(() => {
  const env = useEnv()
  const { adminSidebarStore: store } = env
  const article = store.formControl.mutable

  const [otherArticles, setOtherArticles] = useState<Article[]>([])
  const [url, setUrl] = useState<string>()

  useAutorun(() => {
    const possibleParents = env.articleStore.articles.filter(
      (a) => a.id !== article.id && !a.parentId,
    )
    setOtherArticles(possibleParents)
  }, [article])

  useAutorun(() => {
    setUrl(
      !!article.title
        ? `culinary-canvas.com/articles/${StringUtils.toLowerKebabCase(
            article.title,
          )}`
        : '',
    )
  }, [article.title])

  if (!article) {
    return null
  }

  return (
    <section className="controls article">
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
        className="url-container"
        data-tip="URL can be shared for unpublished article"
        data-for="url-tooltip"
      >
        <Tooltip id="url-tooltip" />
        <span id="url">{url}</span>
        <Button
          unsetStyle
          className="copy-to-clipboard"
          onClick={() => copyTextToClipboard(`https://${url}`)}
          onKeyPress={() => copyTextToClipboard(`https://${url}`)}
        >
          <img
            src={copyPaste}
            alt="Facebook"
            className="icon"
          />
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
        displayFormatter={(v) =>
          env.articleStore.articles.find((a) => a.id === v).title
        }
        showEmptyOption
      />

      <label htmlFor="tags">Tags</label>
      <Tags
        selected={article.tagIds}
        onAdd={(tag) => article.tagIds.push(tag.id)}
        onRemove={(tag) =>
          (article.tagIds = article.tagIds.filter((id) => id !== tag.id))
        }
      />
    </section>
  )
})
