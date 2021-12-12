import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  where,
} from 'firebase/firestore'
import slugify from 'voca/slugify'
import { ModelService } from '../services/db/Model.service'
import { Transformer } from '../services/db/Transformer'
import { firebase } from '../services/firebase/Firebase'
import { isNil } from '../services/importHelpers'
import { SortableService } from '../services/sortable/Sortable.service'
import { ExtractGeneric } from '../services/types/ExtractGeneric'
import { ArticleService } from './Article.service'
import { ArticleModel } from './models/Article.model'

export class ArticleApi {
  static readonly COLLECTION = 'articles'

  static async fetchRawArticles(pageSize: number, promoted: boolean) {
    const { db } = firebase()

    const response = await getDocs(
      query(
        collection(db, this.COLLECTION),
        where('published', '==', true),
        where('showOnStartPage', '==', true),
        where('promoted', '==', promoted),
        orderBy('sortOrder', 'desc'),
        limit(pageSize),
      ),
    )
    return !!response.size
      ? response.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((a) => ArticleService.rawArticleIsPublished(a))
      : []
  }

  static async byId(id: ArticleModel['id']): Promise<ArticleModel> {
    const { db } = firebase()
    const snapshot = await getDoc(
      doc(db, this.COLLECTION, id).withConverter(
        Transformer.firestoreConverter(ArticleModel),
      ),
    )
    return snapshot.exists() ? snapshot.data() : null
  }

  static async bySlug(slug: ArticleModel['slug']): Promise<ArticleModel> {
    const { db } = firebase()
    const snapshot = await getDocs(
      query(
        collection(db, this.COLLECTION),
        where('slug', '==', slug),
      ).withConverter(Transformer.firestoreConverter(ArticleModel)),
    )

    return !!snapshot.size ? snapshot.docs[0].data() : null
  }

  static async all(): Promise<ArticleModel[]> {
    const { db } = firebase()
    const snapshot = await getDocs(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
    )

    return !!snapshot.size ? snapshot.docs.map((d) => d.data()) : []
  }

  static async allNoTransform(): Promise<{ [key: string]: any }[]> {
    const { db } = firebase()
    const response = await getDocs(collection(db, this.COLLECTION))
    return !!response.size
      ? response.docs.map((d) => ({ id: d.id, ...d.data() }))
      : []
  }

  static async byCompanyId(
    companyId: ExtractGeneric<ArticleModel['companyIds']>,
  ) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(ArticleModel),
        ),
        where('companyIds', 'array-contains', companyId),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async byCompanyIds(companyIds: ArticleModel['companyIds']) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(ArticleModel),
        ),
        where('companyIds', 'array-contains-any', companyIds),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async byPersonId(personId: ExtractGeneric<ArticleModel['personIds']>) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(ArticleModel),
        ),
        where('personIds', 'array-contains', personId),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async byPersonIds(personIds: ArticleModel['personIds']) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(ArticleModel),
        ),
        where('personIds', 'array-contains-any', personIds),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async byTagNames(tagNames: ArticleModel['tagNames']) {
    const { db } = firebase()
    const response = await getDocs(
      query(
        collection(db, this.COLLECTION).withConverter(
          Transformer.firestoreConverter(ArticleModel),
        ),
        where('tagNames', 'array-contains-any', tagNames),
      ),
    )
    return response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedPagedBySortOrderDesc(
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()
    let q = query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      where('published', '==', true),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )
    if (!isNil(_startAfter)) {
      q = query(q, startAfter(_startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async allPagedBySortOrderDesc(
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()
    let q = query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )
    if (!isNil(_startAfter)) {
      q = query(q, startAfter(startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedByTypePagedBySortOrderDesc(
    type: ArticleModel['type'],
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()

    let q = query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      where('published', '==', true),
      where('type', '==', type),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )
    if (!isNil(_startAfter)) {
      q = query(q, startAfter(_startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedByTagPagedBySortOrderDesc(
    tag: ExtractGeneric<ArticleModel['tagNames']>,
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()

    let q = query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      where('published', '==', true),
      where('tagNames', 'array-contains', tag),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )
    if (!isNil(_startAfter)) {
      q = query(q, startAfter(_startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedByPersonIdPagedBySortOrderDesc(
    personId: ExtractGeneric<ArticleModel['personIds']>,
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()

    let q = query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      where('published', '==', true),
      where('personIds', 'array-contains', personId),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )
    if (!isNil(_startAfter)) {
      q = query(q, startAfter(_startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async publishedByCompanyIdPagedBySortOrderDesc(
    companyId: ExtractGeneric<ArticleModel['companyIds']>,
    _limit: number,
    _startAfter?: ArticleModel['sortOrder'],
  ): Promise<ArticleModel[]> {
    const { db } = firebase()

    let q = await query(
      collection(db, this.COLLECTION).withConverter<ArticleModel>(
        Transformer.firestoreConverter(ArticleModel),
      ),
      where('published', '==', true),
      where('companyIds', 'array-contains', companyId),
      orderBy('sortOrder', 'desc'),
      limit(_limit),
    )

    if (!isNil(_startAfter)) {
      q = query(q, startAfter(_startAfter))
    }

    const response = await getDocs(q)
    return !!response.size ? response.docs.map((d) => d.data()) : []
  }

  static async save(
    article: ArticleModel,
    userId: ArticleModel['createdById'],
    onProgress?: (progress: number, message?: string) => any,
  ): Promise<string> {
    if (!article.titleContent?.value) {
      throw new Error('Article must have a title section')
    }

    !!onProgress && onProgress(0, '')
    const { db } = firebase()

    !!onProgress && onProgress(0.1, '')
    const original = !!article.id ? await this.byId(article.id) : null

    if (!article.slug) {
      article.slug = slugify(article.titleContent?.value)
    } else if (!!original && original.slug !== article.slug) {
      // In case slug has been changed — make sure it's "slugified"
      article.slug = slugify(article.slug)
    }
    await ArticleService.setArticleTypeAsTag(article, userId)

    !!onProgress && onProgress(0.2, 'Uploading images...')
    await ArticleService.uploadNewArticleImages(article, onProgress, 0.2)

    !!onProgress && onProgress(0.7, 'Sorting...')
    if (isNil(article.sortOrder)) {
      article.sortOrder = (await this.all()).length
    }

    !!onProgress && onProgress(0.9)
    ModelService.beforeSave(article, userId)

    !!onProgress && onProgress(0.95)
    let ref: DocumentReference
    if (!!article?.id) {
      ref = doc(db, this.COLLECTION, article.id).withConverter(
        Transformer.firestoreConverter(ArticleModel),
      )
      await setDoc(ref, article)
    } else {
      const collRef = collection(db, this.COLLECTION).withConverter(
        Transformer.firestoreConverter(ArticleModel),
      )
      ref = await addDoc(collRef, article)
    }

    !!onProgress && onProgress(1, 'Done!')
    return ref.id
  }

  static async delete(
    article: ArticleModel,
    userId: ArticleModel['createdById'],
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${article.title || 'article with no title'}`)
    const { db } = firebase()
    await deleteDoc(doc(db, this.COLLECTION, article.id))

    onProgress(0.4, 'Reloading remaining articles')
    const all = await this.all()

    onProgress(0.7, 'Updating sort orders')
    SortableService.ungapSortOrders(all)
    await Promise.all(all.map(async (a) => this.save(a, userId)))

    onProgress(1, 'Done!')
  }
}

export default ArticleApi
