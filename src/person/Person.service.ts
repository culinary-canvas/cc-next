import { PersonModel } from './Person.model'
import { ArrayUtils } from '../services/utils/ArrayUtils'
import { CompanyApi } from '../company/Company.api'
import { addHttpIfMissing } from '../services/utils/UrlUtils'
import { PersonApi } from './Person.api'

export class PersonService {
  static async populate(persons: PersonModel | PersonModel[]) {
    const _persons = ArrayUtils.asArray(persons)
    const companies = await CompanyApi.all()

    _persons
      .filter((p) => !!p.companyId)
      .forEach((p) => (p.company = companies.find((c) => p.companyId === c.id)))
  }

  static ensureHttpInUrls(person: PersonModel) {
    if (!!person.web) {
      person.web = addHttpIfMissing(person.web)
    }
    if (!!person.facebook) {
      person.facebook = addHttpIfMissing(person.facebook)
    }
    if (!!person.instagram) {
      person.instagram = addHttpIfMissing(person.instagram)
    }
    if (!!person.twitter) {
      person.twitter = addHttpIfMissing(person.twitter)
    }
  }

  static async validate(person: PersonModel): Promise<boolean> {
    if (await PersonApi.existsBySlug(person.slug)) {
      return false
    }
    return true
  }
}
