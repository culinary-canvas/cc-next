import { ArticleType } from '../article/shared/ArticleType'

export class MenuOptionDefinition {
  private readonly _name?: string
  readonly path?: string
  readonly articleType?: ArticleType
  readonly label: string
  readonly isAdmin: boolean
  readonly includeSubRoutes: boolean
  readonly hideOnMobile: boolean

  get name() {
    return this._name || this.path
  }

  constructor(v: {
    label: string
    path?: string
    name?: string
    articleType?: ArticleType
    isAdmin?: boolean
    includeSubRoutes?: boolean
    hideOnMobile?: boolean
  }) {
    this.path = v.path
    this._name = v.name
    this.articleType = v.articleType
    this.label = v.label
    this.isAdmin = v.isAdmin || false
    this.includeSubRoutes = v.includeSubRoutes || false
    this.hideOnMobile = v.hideOnMobile || false
  }
}
