import { PersonApi } from '../../person/Person.api'
import { CompanyApi } from '../../company/Company.api'
import StringUtils from '../utils/StringUtils'

export async function setPersonAndCompanySlugs(userId: string) {
  const persons = await PersonApi.all()
  const companies = await CompanyApi.all()

  await Promise.all(
    persons.map((person) => {
      person.slug = StringUtils.toLowerKebabCase(person.name)
      PersonApi.save(person, userId)
    }),
  )

  await Promise.all(
    companies.map((company) => {
      company.slug = StringUtils.toLowerKebabCase(company.name)
      CompanyApi.save(company, userId)
    }),
  )
}
