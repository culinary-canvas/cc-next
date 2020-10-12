import React from 'react'
import { Button } from '../../../../../../../form/button/Button'
import linkIcon from '../../../../../../../../public/assets/icons/streamline-icon-hyperlink@140x140.svg'
import brokenLinkIcon from '../../../../../../../../public/assets/icons/streamline-icon-link-broken@140x140.svg'
import { observer } from 'mobx-react'
import { Padding, PaddingValues } from '../../../../../../../article/shared/Padding'

interface Props {
  property: keyof PaddingValues
  padding: Padding
}

export const PaddingLinkedButton = observer((props: Props) => {
  const { property, padding } = props

  return (
    <Button unsetStyle onClick={() => padding.toggleLinked(property)}>
      {padding.linked.includes(property) ? (
        <img src={linkIcon} alt="Linked — changes to this property will apply to all other linked properties" />
      ) : (
        <img src={brokenLinkIcon} alt="Not linked — individual setting is possible" />
      )}
    </Button>
  )
})
