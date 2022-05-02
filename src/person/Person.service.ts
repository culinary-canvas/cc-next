import { runInAction } from 'mobx'
import { CompanyApi } from '../company/Company.api'
import { CompanyModel } from '../company/models/Company.model'
import { ArrayUtils } from '../services/utils/ArrayUtils'
import { addHttpIfMissing } from '../services/utils/UrlUtils'
import { PersonModel } from './models/Person.model'
import { PersonApi } from './Person.api'

export class PersonService {
  static async populate(
    persons: PersonModel | PersonModel[],
    companies?: CompanyModel[],
  ) {
    const _persons = ArrayUtils.asArray(persons)
    const _companies = companies ?? (await CompanyApi.all())

    _persons
      .filter((p) => !!p.companyId)
      .forEach((p) =>
        runInAction(() => {
          p.company = _companies.find((c) => p.companyId === c.id)
        }),
      )
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
    if (!person.id) {
      const result = await PersonApi.bySlug(person.slug)
      return result.filter((p) => p.id !== person.id).length === 0
    }
    return true
  }
}
