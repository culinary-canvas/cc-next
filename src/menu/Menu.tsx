import React from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { DesktopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'

export default function Menu() {
  return (
    <>
      <BrowserView>
        <DesktopMenu />
      </BrowserView>
      <MobileView>
        <MobileMenu />
      </MobileView>
    </>
  )
}
