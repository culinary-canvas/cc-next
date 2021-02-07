import { addHttpIfMissing } from '../services/utils/UrlUtils'
import { CompanyModel } from './Company.model'
import { CompanyApi } from './Company.api'
import { PersonApi } from '../person/Person.api'

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

  static async validate(company: CompanyModel) {
    if (!company.id) {
      const result = await CompanyApi.bySlug(company.slug)
      return result.filter((c) => c.id !== company.id).length === 0
    }
    return true
  }
}
