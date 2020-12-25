import React, { useCallback, useEffect, useState } from 'react'
import s from './TextEditMenu.module.scss'
import { Button } from '../../../../../form/button/Button'
import { TextContentModel } from '../../../../../article/content/text/TextContent.model'
import { runInAction } from 'mobx'
import { classnames } from '../../../../../services/importHelpers'
import { TextEditService } from './TextEdit.service'

interface Props {
  content: TextContentModel
  selectionStart: number
  selectionEnd: number
}

export function TextEditMenu(props: Props) {
  const { content, selectionStart: start, selectionEnd: end } = props

  const [existingUrl, setExistingUrl] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [linkAction, setLinkAction] = useState<'link' | 'unlink' | 'update'>()

  useEffect(() => {
    setLinkAction(
      (existingUrl !== '' && url === '') ||
        (existingUrl !== '' && existingUrl === url)
        ? 'unlink'
        : existingUrl !== '' && url !== ''
        ? 'update'
        : 'link',
    )
  }, [existingUrl, url])

  useEffect(() => {
    setUrl('')
    setExistingUrl(TextEditService.getLinkInPosition(content.value, start, end))
  }, [content.value, start, end])

  const insertLink = useCallback(
    () =>
      runInAction(
        () =>
          (content.value = TextEditService.insertLinkMarkupAtPosition(
            content.value,
            url,
            start,
            end,
          )),
      ),
    [content, content.value, url, start, end],
  )

  const updateLink = useCallback(
    () =>
      runInAction(
        () =>
          (content.value = TextEditService.replaceLinkUrl(
            content.value,
            url,
            existingUrl,
          )),
      ),
    [content, content.value, url],
  )

  const removeLink = useCallback(
    () =>
      runInAction(
        () =>
          (content.value = TextEditService.removeLinkInPosition(
            content.value,
            start,
            end,
          )),
      ),
    [content, content.value, url, start, end],
  )

  return (
    <div className={s.container}>
      <input
        type="url"
        className={s.linkInput}
        value={url || existingUrl}
        onChange={(e) => setUrl(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            linkAction === 'link'
              ? insertLink()
              : linkAction === 'update'
              ? updateLink()
              : removeLink()
          }
        }}
        onFocus={(e) => {
          if (existingUrl === '' && url === '') {
            setUrl('https://')
          } else {
            e.target.select()
          }
        }}
        disabled={existingUrl === '' && start === end}
        placeholder="https://"
      />
      <Button
        disabled={
          (url !== '' && !TextEditService.validURL(url)) ||
          (linkAction === 'link' && url === '')
        }
        className={classnames(s.linkButton, {
          [s.unlinkButton]: linkAction === 'unlink',
        })}
        onClick={() =>
          linkAction === 'link'
            ? insertLink()
            : linkAction === 'update'
            ? updateLink()
            : removeLink()
        }
      >
        {linkAction === 'link'
          ? 'Link'
          : linkAction === 'update'
          ? 'Update'
          : 'Unlink'}
      </Button>
    </div>
  )
}
