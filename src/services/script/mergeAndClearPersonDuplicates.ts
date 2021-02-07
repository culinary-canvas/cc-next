import { PersonApi } from '../../person/Person.api'
import { CompanyApi } from '../../company/Company.api'
import slugify from 'voca/slugify'

export async function setPersonAndCompanySlugs(userId: string) {
  const persons = await PersonApi.all()
  const companies = await CompanyApi.all()

  await Promise.all(
    persons.map((person) => {
      person.slug = slugify(person.name)
      console.log(`${person.name} -> ${person.slug}`)
      PersonApi.save(person, userId)
    }),
  )

  await Promise.all(
    companies.map((company) => {
      company.slug = slugify(company.name)
      console.log(`${company.name} -> ${company.slug}`)
      CompanyApi.save(company, userId)
    }),
  )
}
