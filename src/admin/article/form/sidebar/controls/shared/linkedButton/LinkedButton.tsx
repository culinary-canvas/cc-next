import React from 'react'
import { Button } from '../../../../../../../form/button/Button'
import linkIcon from '../../../../../../../../public/assets/icons/streamline-icon-hyperlink@140x140.svg'
import brokenLinkIcon from '../../../../../../../../public/assets/icons/streamline-icon-link-broken@140x140.svg'
import { observer } from 'mobx-react'

interface Props {
  linked: boolean
  onClick: (v: boolean) => void
}

export const LinkedButton = observer((props: Props) => {
  const { linked, onClick } = props

  return (
    <Button unsetStyle onClick={() => onClick(!linked)}>
      {linked ? (
        <img
          src={linkIcon}
          alt="Linked — changes to this property will apply to all other linked properties"
        />
      ) : (
        <img
          src={brokenLinkIcon}
          alt="Not linked — individual setting is possible"
        />
      )}
    </Button>
  )
})
