import React, { useEffect, useState } from 'react'
import copyPasteIcon from '../../../../../../../public/assets/icons/streamline-icon-copy-paste@140x140.svg'
import editIcon from '../../../../../../../public/assets/icons/streamline-icon-pencil-write-3-alternate@140x140.svg'
import { Checkbox } from '../../../../../../form/checkbox/Checkbox'
import { Select } from '../../../../../../form/select/Select'
import { runInAction, toJS } from 'mobx'
import { Button } from '../../../../../../form/button/Button'
import { ArticleModel } from '../../../../../../article/Article.model'
import StringUtils from '../../../../../../services/utils/StringUtils'
import { copyTextToClipboard } from '../../../../../../services/utils/Utils'
import { ArticleType } from '../../../../../../article/ArticleType'
import s from './ArticleControls.module.scss'
import { ArticleApi } from '../../../../../../article/Article.api'
import { useAdmin } from '../../../../../Admin'
import { useReaction } from '../../../../../../hooks/useReaction'
import { COLOR } from '../../../../../../styles/_color'
import { useOverlay } from '../../../../../../shared/overlay/OverlayStore'
import { useAuth } from '../../../../../../services/auth/Auth'
import { useRouter } from 'next/router'
import { ColorPicker } from '../shared/colorPicker/ColorPicker'
import { observer } from 'mobx-react'
import { TagsEdit } from '../../../../../../tag/Tags/TagsEdit'

export const ArticleControls = observer(() => {
  const auth = useAuth()
  const router = useRouter()
  const admin = useAdmin()
  const overlay = useOverlay()
  const { article } = admin

  const [otherArticles, setOtherArticles] = useState<ArticleModel[]>([])
  const [editingSlug, editSlug] = useState<boolean>(false)

  const [title, setTitle] = useState<string>(article.title)
  const [deleting, setDeleting] = useState<boolean>(false)

  useEffect(() => {
    if (article.title !== title) {
      runInAction(() => (article.titleContent.value = title))
    }
  }, [title])

  useReaction(
    () => article.title,
    (t) => setTitle(t),
  )

  useEffect(() => {
    if (!!article) {
      ArticleApi.all().then((all) => {
        const other = all.filter((a) => a.id !== article.id && !a.parentId)
        setOtherArticles(other)
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
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="url">URL</label>
      <span className={s.urlContainer}>
        <input
          disabled={!editingSlug}
          title="URL can be shared for unpublished article"
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

      <label htmlFor="article-background-color">Background color</label>
      {article.format.backgroundColor}
      <ColorPicker
        id="article-background-color"
        value={article.format.backgroundColor}
        onSelect={(c) =>
          runInAction(() => (article.format.backgroundColor = c))
        }
        additionalColors={article.colors}
        showTransparent
      />

      <label htmlFor="tags">Tags</label>
      <TagsEdit
        selected={toJS(article.tagNames)}
        onAdd={(tag) => article.tagNames.push(tag)}
        onRemove={(tag) =>
          (article.tagNames = article.tagNames.filter((id) => id !== tag))
        }
      />
      {!!admin.article?.id && (
        <Button
          loading={deleting}
          color={COLOR.RED}
          loadingText="Deleting"
          onClick={onDelete}
        >
          Delete article...
        </Button>
      )}
    </section>
  )
  async function onDelete() {
    const goodToGo = window.confirm(
      'Are you really, really sure want to delete this article?',
    )
    if (goodToGo) {
      setDeleting(true)
      overlay.toggle()
      await ArticleApi.delete(admin.article, auth.userId, onProgress)
      setTimeout(() => overlay.toggle(), 1000)
      router.replace('/admin/articles')
    }
  }

  const onProgress = (progress, message) => {
    message && overlay.setText(message)
    overlay.setProgress(progress)
  }
})
