export class MenuOption {
  text: string
  href: string

  constructor(text: string, href: string) {
    this.text = text
    this.href = href
  }

  equals(option: MenuOption) {
    return option?.href === this.href
  }
}
