import React from 'react'
import { Button } from '../../Button/Button'
import linkIcon from '../../../../public/assets/icons/streamline-icon-hyperlink@140x140.svg'
import brokenLinkIcon from '../../../../public/assets/icons/streamline-icon-link-broken@140x140.svg'
import { observer } from 'mobx-react'
import { Padding, PaddingValues } from '../../../domain/Format/Padding'

interface Props {
  property: keyof PaddingValues
  padding: Padding
}

export const PaddingLinkedButton = observer((props: Props) => {
  const { property, padding } = props

  return (
    <Button unsetStyle onClick={() => padding.toggleLinked(property)}>
      {padding.linked.includes(property) ? (
        <img src={linkIcon} alt="Logotype" className="icon" />
      ) : (
        <img src={brokenLinkIcon} alt="Logotype" className="icon" />
      )}
    </Button>
  )
})
