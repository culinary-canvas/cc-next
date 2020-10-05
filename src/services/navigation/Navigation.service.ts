import { authService } from '../auth/Auth.service'
import StringUtils from '../utils/StringUtils'

export class NavigationService {
  static signedInGuard(body: any) {
    return !authService.isSignedIn
      ? {
          redirect: {
            name: 'admin',
          },
          meta: {
            status: 302,
          },
        }
      : {
          body,
          meta: { requiresAuth: true },
        }
  }

  // TODO nav
  static getPageTitle(response: any) {
    const pageTitle =
      response.name === 'start'
        ? ''
        : response.name === 'article'
        ? response.params.urlTitle
        : response.name
    return pageTitle !== ''
      ? `${StringUtils.toDisplayText(pageTitle)} | Culinary Canvas`
      : 'Culinary Canvas'
  }
}
