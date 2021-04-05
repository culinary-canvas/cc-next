export class MenuOption {
  text: string
  href: string
  subMenu?: MenuOption[]

  constructor(text: string, href: string, subMenu?: MenuOption[]) {
    this.text = text
    this.href = href
    if (!!subMenu) {
      subMenu.forEach((o) => (o.href = `${href}${o.href}`))
      this.subMenu = subMenu
    }
  }

  equals(option: MenuOption) {
    return option?.href === this.href
  }
}
