import { Article } from './Article'
import { User } from 'firebase'
import { initFirebase } from '../../services/firebase/Firebase.service'
import { Transformer } from '../../services/db/Transformer'
import { Api } from '../../services/api/Api'
import type { PlainObject } from '../../types/PlainObject'
import { ArticleService } from './Article.service'
import { SortableService } from '../../services/sortable/Sortable.service'
import { isNil } from '../../services/importHelpers'
import { SectionService } from '../Section/Section.service'
import { ContentService } from '../Content/Content.service'

export class ArticleApi {
  private static readonly COLLECTION = 'articles'

  static async byId(id: string): Promise<PlainObject<Article>> {
    return Api.byId(id, this.COLLECTION)
  }

  static async bySlug(slug: string): Promise<PlainObject<Article>> {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('slug', '==', slug)
      .get()

    if (!!snapshot.size) {
      return Transformer.toJson(snapshot.docs[0])
    }
  }

  static async all(): Promise<Partial<Article>[]> {
    return Api.all(this.COLLECTION)
  }

  static async save(
    article: Article,
    user: User,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ) {
    onProgress(0, '')
    if (!article.slug) {
      article.slug = ArticleService.createSlug(article)
    }

    onProgress(0.1, 'Sorting...')
    await ArticleService.uploadNewImages(article, onProgress, 0.1)

    onProgress(0.6, 'Sorting...')
    if (isNil(article.sortOrder)) {
      article.sortOrder = (await ArticleApi.all()).length
    }

    onProgress(0.7, 'Sorting...')
    article.sections = SectionService.sort(article.sections)

    onProgress(0.75)
    article.sections.forEach(
      (section) => (section.contents = ContentService.sort(section.contents)),
    )

    onProgress(0.8)
    const id = await Api.save(article, user)

    onProgress(1, 'Done!')
    return id
  }

  static async delete(
    article: Article,
    user: User,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${article.title || 'article with no title'}`)
    await Api.delete(article.id, this.COLLECTION)

    onProgress(0.4, 'Reloading remaining articles')
    const all = (await ArticleApi.all()).map((a) =>
      Transformer.toApp(a, Article),
    )

    onProgress(0.7, 'Updating sort orders')
    SortableService.ungapSortOrders(all)
    await Promise.all(all.map(async (a) => this.save(a, user)))

    onProgress(1, 'Done!')
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }
}
