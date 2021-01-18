import { PersonModel } from './Person.model'
import { ArrayUtils } from '../services/utils/ArrayUtils'
import { CompanyApi } from '../company/Company.api'

export class PersonService {
  static async populate(persons: PersonModel | PersonModel[]) {
    const _persons = ArrayUtils.asArray(persons)
    const companies = await CompanyApi.all()

    _persons
      .filter((p) => !!p.companyId)
      .forEach((p) => (p.company = companies.find((c) => p.companyId === c.id)))
  }
}
