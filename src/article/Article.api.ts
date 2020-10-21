import { ArticleModel } from './Article.model'
import { User } from 'firebase'
import { initFirebase } from '../services/firebase/Firebase.service'
import { Transformer } from '../services/db/Transformer'
import { Api } from '../services/api/Api'
import type { PlainObject } from '../services/types/PlainObject'
import { ArticleService } from './Article.service'
import { SortableService } from '../services/sortable/Sortable.service'
import { isNil } from '../services/importHelpers'
import { SectionService } from './section/Section.service'
import { ContentService } from './content/Content.service'
import { ArticleType } from './ArticleType'

export class ArticleApi {
  private static readonly COLLECTION = 'articles'

  static async byId(id: string): Promise<PlainObject<ArticleModel>> {
    return Api.byId(id, this.COLLECTION)
  }

  static async bySlug(slug: string): Promise<PlainObject<ArticleModel>> {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('slug', '==', slug)
      .get()

    if (!!snapshot.size) {
      return Transformer.toJson(snapshot.docs[0])
    }
  }

  static async byType(type: ArticleType) {
    const { firestore } = initFirebase()

    const snapshot = await firestore()
      .collection(this.COLLECTION)
      .where('type', '==', type)
      .get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async all(): Promise<Partial<ArticleModel>[]> {
    return Api.all(this.COLLECTION)
  }

  static async publishedPagedBySortOrderDesc(
    limit: number,
    startAfterSortOrder?: number,
  ): Promise<Partial<ArticleModel>[]> {
    const { firestore } = initFirebase()

    let query = firestore()
      .collection(this.COLLECTION)
      .where('published', '==', true)
      .orderBy('sortOrder', 'desc')
    if (!isNil(startAfterSortOrder)) {
      query = query.startAfter(startAfterSortOrder)
    }
    const snapshot = await query.limit(limit).get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async allPagedBySortOrderDesc(
    limit: number,
    startAfterSortOrder?: number,
  ): Promise<Partial<ArticleModel>[]> {
    const { firestore } = initFirebase()

    let query = firestore()
      .collection(this.COLLECTION)
      .orderBy('sortOrder', 'desc')
    if (!isNil(startAfterSortOrder)) {
      query = query.startAfter(startAfterSortOrder)
    }
    const snapshot = await query.limit(limit).get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async publishedByTypePagedBySortOrderDesc(
    type: ArticleType,
    limit: number,
    startAfterSortOrder?: number,
  ): Promise<Partial<ArticleModel>[]> {
    const { firestore } = initFirebase()

    let query = firestore()
      .collection(this.COLLECTION)
      .where('published', '==', true)
      .where('type', '==', type)
      .orderBy('sortOrder', 'desc')
    if (!isNil(startAfterSortOrder)) {
      query = query.startAfter(startAfterSortOrder)
    }
    const snapshot = await query.limit(limit).get()

    if (!!snapshot.size) {
      return Transformer.listToJson(snapshot.docs)
    }
  }

  static async save(
    article: ArticleModel,
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
    article: ArticleModel,
    user: User,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${article.title || 'article with no title'}`)
    await Api.delete(article.id, this.COLLECTION)

    onProgress(0.4, 'Reloading remaining articles')
    const all = (await ArticleApi.all()).map((a) =>
      Transformer.toApp(a, ArticleModel),
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
