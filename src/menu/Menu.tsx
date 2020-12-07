import React from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import { DesktopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'
import { MenuContext, useMenuState } from './useMenu'

export default function Menu() {
  const menu = useMenuState()
  return (
    <MenuContext.Provider value={menu}>
      <BrowserView>
        <DesktopMenu />
      </BrowserView>
      <MobileView>
        <MobileMenu />
      </MobileView>
    </MenuContext.Provider>
  )
}
