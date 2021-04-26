import ArticleApi from '../../article/Article.api'
import { ArticleModel } from '../../article/models/Article.model'
import { CompanyApi } from '../../company/Company.api'
import { CompanyModel } from '../../company/models/Company.model'
import { PersonModel } from '../../person/models/Person.model'
import { PersonApi } from '../../person/Person.api'

export async function refactorImageSetFromCroppedToImage(userId: string) {
  const articles = await ArticleApi.all()
  for (let article of articles) {
    console.group(article.title)

    let updated = updateContents(article)
    updated = updatePreview(article) || updated

    if (updated) {
      console.log(`Updated article "${article.title}"`)
      await ArticleApi.save(article, userId)
    }

    console.groupEnd()
  }

  const companies = await CompanyApi.all()
  for (let company of companies) {
    console.group(company.name)

    const updated = updateCompany(company)

    if (updated) {
      console.log(`Updated company "${company.name}"`)
      await CompanyApi.save(company, userId)
    }

    console.groupEnd()
  }

  const persons = await PersonApi.all()
  for (let person of persons) {
    console.group(person.name)

    const updated = updatePerson(person)

    if (updated) {
      console.log(`Updated person "${person.name}"`)
      await PersonApi.save(person, userId)
    }

    console.groupEnd()
  }
  console.log('Done!')
}

function updateContents(article: ArticleModel): boolean {
  let updated = false
  article.imageContents
    .filter((c) => !!c.set.cropped)
    .forEach((c) => {
      c.set.image = c.set.cropped
      c.set.cropped = null
      updated = true
      console.log(`Updated image ${c.set.image.fileName} in ${c.name}`)
    })
  return updated
}

function updatePreview(article: ArticleModel): boolean {
  if (!article.preview.imageSet && !!article.preview.image) {
    article.preview.imageSet = article.preview.image
    article.preview.image = null
    console.log('Updated preview set property')
    if (!!article.preview.imageSet.cropped) {
      article.preview.imageSet.image = article.preview.imageSet.cropped
      article.preview.imageSet.cropped = null
      console.log(
        `Updated preview image ${article.preview.imageSet.image.fileName}`,
      )
    }
    return true
  }
  return false
}

function updateCompany(company: CompanyModel): boolean {
  if (!company.imageSet && !!company.image) {
    company.imageSet = company.image
    company.image = null
    console.log('Updated company set property')
    if (!!company.imageSet.cropped) {
      company.imageSet.image = company.imageSet.cropped
      company.imageSet.cropped = null
      console.log(`Updated company image ${company.imageSet.image.fileName}`)
    }
    return true
  }
  return false
}

function updatePerson(person: PersonModel): boolean {
  if (!person.imageSet && !!person.image) {
    person.imageSet = person.image
    person.image = null
    console.log('Updated person set property')
    if (!!person.imageSet.cropped) {
      person.imageSet.image = person.imageSet.cropped
      person.imageSet.cropped = null
      console.log(`Updated person image ${person.imageSet.image.fileName}`)
    }
    return true
  }
  return false
}
