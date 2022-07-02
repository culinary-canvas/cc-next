import classNames from 'classnames'
import { runInAction } from 'mobx'
import React, { useCallback, useEffect, useState } from 'react'
import { classnames } from '../../../services/importHelpers'
import { Button } from '../../../shared/button/Button'
import { TextEditService } from './TextEdit.service'
import s from './TextEditMenu.module.scss'

interface Props {
  text: string
  selectionStart: number
  selectionEnd: number
  onTextChange: (text: string) => any
}

export function TextEditMenu(props: Props) {
  const { text, selectionStart: start, selectionEnd: end, onTextChange } = props

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
    if (!!text) {
      setExistingUrl(TextEditService.getLinkInPosition(text, start, end))
    }
  }, [text, start, end])

  const insertLink = useCallback(
    () =>
      runInAction(() =>
        onTextChange(
          TextEditService.insertLinkAtPosition(text, url, start, end),
        ),
      ),
    [text, url, start, end],
  )

  const updateLink = useCallback(
    () =>
      runInAction(() =>
        onTextChange(TextEditService.replaceLinkUrl(text, url, existingUrl)),
      ),
    [text, url],
  )

  const removeLink = useCallback(
    () =>
      runInAction(() =>
        onTextChange(TextEditService.removeLinkInPosition(text, start, end)),
      ),
    [text, url, start, end],
  )

  return (
    <div className={classNames(s.container, start === end && s.hidden)}>
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
