import { runInAction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { isEmpty } from 'voca'
import copyPasteIcon from '../../../../../../public/assets/icons/streamline-icon-copy-paste@140x140.svg'
import editIcon from '../../../../../../public/assets/icons/streamline-icon-pencil-write-3-alternate@140x140.svg'
import { useAdmin } from '../../../../../admin/Admin.context'
import { useReaction } from '../../../../../hooks/useReaction'
import { IssueApi } from '../../../../../issue/Issue.api'
import { IssueService } from '../../../../../issue/Issue.service'
import { IssueModel } from '../../../../../issue/models/Issue.model'
import { useAuth } from '../../../../../services/auth/Auth'
import StringUtils from '../../../../../services/utils/StringUtils'
import { copyTextToClipboard } from '../../../../../services/utils/Utils'
import { Button } from '../../../../../shared/button/Button'
import { Checkbox } from '../../../../../shared/checkbox/Checkbox'
import { DatePicker } from '../../../../../shared/datePIcker/DatePicker'
import { useOverlay } from '../../../../../shared/overlay/OverlayStore'
import { Select } from '../../../../../shared/select/Select'
import { COLOR } from '../../../../../styles/_color'
import { TagsForm } from '../../../../../tag/form/TagsForm'
import { ArticleApi } from '../../../../Article.api'
import { ArticleType } from '../../../../models/ArticleType'
import { ColorPicker } from '../shared/colorPicker/ColorPicker'
import { CompaniesArticleControl } from '../shared/companyArticleControl/CompaniesArticleControl'
import { ControlContainer } from '../shared/controlContainer/ControlContainer'
import { PersonsArticleControl } from '../shared/personsArticleControl/PersonsArticleControl'
import s from './ArticleControls.module.scss'

export const ArticleControls = observer(() => {
  const auth = useAuth()
  const router = useRouter()
  const admin = useAdmin()
  const overlay = useOverlay()
  const { article } = admin

  const [issues, setIssues] = useState<IssueModel[]>([])

  useEffect(() => {
    IssueApi.all().then(setIssues)
  }, [])

  const [editingSlug, editSlug] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(article.title)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [isScheduledPublish, setScheduledPublish] = useState<boolean>(
    !!article.publishDate,
  )

  useEffect(() => {
    if (article.title !== title) {
      runInAction(() => (article.titleContent.value = title))
    }
  }, [title])

  useReaction(
    () => article.title,
    (t) => setTitle(t),
  )

  if (!article) {
    return null
  }

  return (
    <section className={s.controls}>
      <ControlContainer label="Title" id="title">
        <input
          type="text"
          id="title"
          placeholder="ArticleView title (required)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </ControlContainer>

      <ControlContainer
        id="url"
        label="URL"
        labelButtons={() => (
          <>
            <Button
              unsetStyle
              onClick={() => editSlug(!editingSlug)}
              onKeyPress={() => editSlug(!editingSlug)}
            >
              <img src={editIcon} alt="Edit" />
              <span>Edit</span>
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
              <span>Copy</span>
            </Button>
          </>
        )}
      >
        <input
          disabled={!editingSlug}
          title="URL can be shared for unpublished article"
          type="text"
          id="url"
          placeholder="ArticleView page URL"
          value={!editingSlug ? `/${article.slug || ''}` : article.slug}
          onChange={(event) =>
            runInAction(() => (article.slug = event.target.value))
          }
          onBlur={() => {
            editSlug(false)
            article.slug = StringUtils.toLowerKebabCase(article.slug)
          }}
        />
      </ControlContainer>

      <ControlContainer label="Issue" id="issue">
        <Select
          showEmptyOption
          id="issue"
          value={article.issueId}
          options={issues}
          valueGetter={(v) => v?.id ?? null}
          onChange={(v) =>
            runInAction(() => {
              if (isEmpty(v)) {
                article.issueId = null
                article.issue = null
              } else {
                article.issueId = v
                article.issue = issues.find((i) => i.id === v)
              }
            })
          }
          displayFormatter={IssueService.toDisplayText}
        />
      </ControlContainer>

      <ControlContainer label="Type" id="type">
        <Select
          id="type"
          value={article.type}
          options={Object.values(ArticleType)}
          onChange={(v) => runInAction(() => (article.type = v))}
          displayFormatter={(v) => StringUtils.toDisplayText(v)}
        />
        <Checkbox
          label="Sponsored"
          checked={article.sponsored}
          onChange={(v) => runInAction(() => (article.sponsored = v))}
        />
      </ControlContainer>

      <ControlContainer label="Publish settings">
        <Checkbox
          label="Published"
          checked={article.published}
          onChange={(v) => runInAction(() => (article.published = v))}
        />
        <div className={s.publish}>
          <Checkbox
            disabled={!article.published}
            label="Scheduled"
            checked={isScheduledPublish}
            onChange={(v) => setScheduledPublish(v)}
            containerClassName={s.publishCheckbox}
          />
          <DatePicker
            selected={article.publishDate}
            onChange={(d) => runInAction(() => (article.publishDate = d))}
            className={s.datePickerInput}
            containerClassName={s.datePickerContainer}
            disabled={!article.published || !isScheduledPublish}
          />
        </div>
        <Checkbox
          label="Show on start page"
          checked={article.showOnStartPage}
          onChange={(v) => runInAction(() => (article.showOnStartPage = v))}
        />
      </ControlContainer>

      <ControlContainer label="Persons" id="persons">
        <PersonsArticleControl article={article} />
      </ControlContainer>

      <ControlContainer label="Companies" id="companies">
        <CompaniesArticleControl article={article} />
      </ControlContainer>

      <ControlContainer label="Background color" id="article-background-color">
        <ColorPicker
          id="article-background-color"
          value={article.format.backgroundColor}
          onSelect={(c) =>
            runInAction(() => (article.format.backgroundColor = c))
          }
          additionalColors={article.colors}
          showTransparent
        />
      </ControlContainer>

      <ControlContainer label="Tags" id="tags">
        <TagsForm
          selected={toJS(article.tagNames)}
          onAdd={(tag) => article.tagNames.push(tag)}
          onRemove={(tag) =>
            runInAction(
              () =>
                (article.tagNames = article.tagNames.filter(
                  (id) => id !== tag,
                )),
            )
          }
        />
      </ControlContainer>

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
      await ArticleApi.delete(admin.article, auth.userId, (v, t) =>
        overlay.setProgress(v, t),
      )
      setTimeout(() => overlay.toggle(false), 1000)
      router.replace('/admin/articles')
    }
  }
})
