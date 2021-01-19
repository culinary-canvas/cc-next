import { addHttpIfMissing } from '../services/utils/UrlUtils'
import { CompanyModel } from './Company.model'

export class CompanyService {
  static ensureHttpInUrls(company: CompanyModel) {
    if (!!company.web) {
      company.web = addHttpIfMissing(company.web)
    }
    if (!!company.facebook) {
      company.facebook = addHttpIfMissing(company.facebook)
    }
    if (!!company.instagram) {
      company.instagram = addHttpIfMissing(company.instagram)
    }
    if (!!company.twitter) {
      company.twitter = addHttpIfMissing(company.twitter)
    }
  }
}
