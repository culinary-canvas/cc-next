import { ArticleModel } from './Article.model'
import { Transformer } from '../services/db/Transformer'
import { ArticleService } from './Article.service'
import { SortableService } from '../services/sortable/Sortable.service'
import { isNil } from '../services/importHelpers'
import { ArticleType } from './ArticleType'
import { ModelService } from '../services/db/Model.service'
import { initFirebase } from '../services/firebase/Firebase'
import 'firebase/firestore'

export class ArticleApi {
  private static readonly COLLECTION = 'articles'

  static async byId(id: string): Promise<ArticleModel> {
    const { firestore } = initFirebase()
    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .doc(id)
      .get()
    return response.exists ? response.data() : null
  }

  static async bySlug(slug: string): Promise<ArticleModel> {
    const { firestore } = initFirebase()

    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .where('slug', '==', slug)
      .get()

    return !!response.size ? response.docs[0].data() : null
  }

  static async all(): Promise<ArticleModel[]> {
    const { firestore } = initFirebase()

    const response = await firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .get()

    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async allNoTransform(): Promise<{ [key: string]: any }[]> {
    const { firestore } = initFirebase()

    const response = await firestore().collection(this.COLLECTION).get()

    return !!response.size
      ? response.docs.map((d) => ({ id: d.id, ...d.data() }))
      : []
  }

  static async publishedPagedBySortOrderDesc(
    limit: number,
    startAfter?: any,
  ): Promise<ArticleModel[]> {
    const { firestore } = initFirebase()

    let query = firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .where('published', '==', true)
      .orderBy('sortOrder', 'desc')
      .limit(limit)
    if (!isNil(startAfter)) {
      query = query.startAfter(startAfter)
    }

    const response = await query.get()
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async allPagedBySortOrderDesc(
    limit: number,
    startAfter?: any,
  ): Promise<ArticleModel[]> {
    const { firestore } = initFirebase()

    let query = firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .orderBy('sortOrder', 'desc')
      .limit(limit)
    if (!isNil(startAfter)) {
      query = query.startAfter(startAfter)
    }

    const response = await query.get()
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedByTypePagedBySortOrderDesc(
    type: ArticleType,
    limit: number,
    startAfter?: any,
  ): Promise<ArticleModel[]> {
    const { firestore } = initFirebase()

    let query = await firestore()
      .collection(this.COLLECTION)
      .withConverter<ArticleModel>(Transformer.firestoreConverter(ArticleModel))
      .where('published', '==', true)
      .where('type', '==', type)
      .orderBy('sortOrder', 'desc')
      .limit(limit)
    if (!isNil(startAfter)) {
      query = query.startAfter(startAfter)
    }

    const response = await query.get()
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(
    article: ArticleModel,
    userId: string,
    onProgress: (progress: number, message?: string) => any = this.logProgress,
  ): Promise<string> {
    onProgress(0, '')
    const { firestore } = initFirebase()

    onProgress(0.1, '')
    if (!article.slug) {
      article.slug = ArticleService.createSlug(article)
    }

    onProgress(0.2, 'Sorting...')
    await ArticleService.uploadNewImages(article, onProgress, 0.2)

    //TODO: Move to functions
    onProgress(0.7, 'Sorting...')
    if (isNil(article.sortOrder)) {
      article.sortOrder = (await this.all()).length
    }

    //TODO: Move to functions
    onProgress(0.9)
    ModelService.beforeSave(article, userId)

    onProgress(0.95)
    let collectionRef = firestore()
      .collection(this.COLLECTION)
      .withConverter(Transformer.firestoreConverter(ArticleModel))
    const doc = !!article.id
      ? collectionRef.doc(article.id)
      : collectionRef.doc()
    await doc.set(article)

    onProgress(1, 'Done!')
    return doc.id
  }

  static async delete(
    article: ArticleModel,
    userId: string,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${article.title || 'article with no title'}`)
    const { firestore } = initFirebase()
    await firestore().collection(this.COLLECTION).doc(article.id).delete()

    onProgress(0.4, 'Reloading remaining articles')
    const all = await this.all()

    onProgress(0.7, 'Updating sort orders')
    SortableService.ungapSortOrders(all)
    await Promise.all(all.map(async (a) => this.save(a, userId)))

    onProgress(1, 'Done!')
  }

  private static getOrderBySortOrderAndPagingForUrl(
    limit: number,
    startAfter?: any,
  ) {
    let path = `orderBy=sortOrder&sortOrder=desc&limit=${limit}`
    if (!isNil(startAfter)) {
      path = `${path}&startAfter=${startAfter}`
    }
    return path
  }

  private static logProgress(progress: number, message?: string) {
    console.debug(progress, message)
  }
}

export default ArticleApi
