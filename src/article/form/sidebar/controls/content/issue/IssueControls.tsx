import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAdmin } from '../../../../../../admin/Admin.context'
import { IssueContentModel } from '../../../../../models/IssueContent.model'
import { ControlContainer } from '../../shared/controlContainer/ControlContainer'
import { HorizontalAlignButtons } from '../../shared/horizontalAlign/HorizontalAlignButtons'
import { PaddingControls } from '../../shared/padding/PaddingControls'
import { VerticalAlignButtons } from '../../shared/verticalAlign/VerticalAlignButtons'
import s from './IssueControls.module.scss'

export const IssueControls = observer(() => {
  const admin = useAdmin()
  const content = admin.content as IssueContentModel

  return (
    <>
      <ControlContainer label="Positioning">
        <div className={s.row}>
          <HorizontalAlignButtons
            selected={content.format.horizontalAlign}
            onSelected={(v) => {
              runInAction(() => (content.format.horizontalAlign = v))
              admin.setContent(content)
            }}
          />
          <VerticalAlignButtons
            selected={content.format.verticalAlign}
            onSelected={(v) =>
              runInAction(() => (content.format.verticalAlign = v))
            }
          />
        </div>
      </ControlContainer>

      <ControlContainer label="Padding">
        <PaddingControls
          padding={content.format.padding}
          onChange={(p) => runInAction(() => (content.format.padding = p))}
        />
      </ControlContainer>
    </>
  )
})
