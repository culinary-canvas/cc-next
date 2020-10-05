import {action, computed, observable} from 'mobx'
import {Article} from './Article'
import Store from '../../types/Store'
import {ArticleApi} from './Article.api'
import {StorageService} from '../../services/storage/Storage.service'
import {ImageContent} from '../Image/ImageContent'
import {ArticleType} from './ArticleType'
import {ArticleService} from './Article.service'
import {SortableService} from '../../services/sortable/Sortable.service'
import {isNil} from '../../services/importHelpers'

export class ArticleStore implements Store {
  @observable articles: Article[] = []
  @observable filter: ArticleType
  @observable current: Article
  @observable currentWidth: number
  @observable loaded = false

  async load() {
    const articles = await ArticleApi.all()
    await this.populate(articles)
    this.setArticles(articles)
    this.setLoaded()
  }

  @action
  setLoaded() {
    this.loaded = true
  }

  @computed
  get published() {
    return this.filtered.filter((a) => a.published)
  }

  @computed
  get filtered() {
    if (!this.filter) {
      return this.articles
    }
    return this.articles.filter((a) => a.type === this.filter)
  }

  @computed
  get parents() {
    return this.articles.filter((a) => !a.parentId)
  }

  async get(id: string) {
    if (this.exists(id)) {
      return this.articles.find((a) => a.id === id)
    }

    const article = await ArticleApi.byId(id)
    if (!!article) {
      await this.populate([article])
      this.addOrUpdate(article)
    }
    return article
  }

  private exists(id: string) {
    return this.articles.some((a) => a.id === id)
  }

  async getByTitleForUrl(titleForUrl: string) {
    if (this.existsByTitleForUrl(titleForUrl)) {
      return this.articles.find((a) => a.titleForUrl === titleForUrl)
    }
    const article = await ArticleApi.byTitleForUrl(titleForUrl)
    if (!!article) {
      await this.populate([article])
      this.addOrUpdate(article)
    }
    return article
  }

  private existsByTitleForUrl(titleForUrl: string) {
    return this.articles.some((a) => a.titleForUrl === titleForUrl)
  }

  @action
  setCurrent(article: Article) {
    this.current = article
  }

  @action
  setArticles(articles: Article[]) {
    this.articles = articles
  }

  @action
  setFilter(type: ArticleType) {
    this.filter = type
  }

  async save(
    article: Article,
    onProgress: (progress: number, message: string) => any = (p, m) =>
      console.debug(m, p),
  ) {
    onProgress(0, '')
    await this.uploadNewImages(article, onProgress)

    onProgress(0.6, 'Sorting...')
    if (isNil(article.sortOrder)) {
      article.sortOrder = (await ArticleApi.all('id')).length
    }
    onProgress(0.7, 'Sorting...')
    SortableService.fixSortOrders(article.sections)
    article.sections = SortableService.getSorted(article.sections)
    article.sections.forEach((section) => {
      SortableService.fixSortOrders(section.contents)
      section.contents = SortableService.getSorted(section.contents)
    })

    onProgress(0.8, 'Saving...')
    article.titleForUrl = ArticleService.createTitleForUrl(article)
    const persisted = await ArticleApi.save(article)

    onProgress(0.9, 'Last bit...')
    this.populate([
      ...this.articles.filter((a) => a.id !== persisted.id),
      persisted,
    ])
    this.addOrUpdate(persisted)

    onProgress(1, 'Done!')
    return persisted
  }

  async delete(
    article: Article,
    onProgress?: (progress: number, message: string) => any,
  ) {
    onProgress(0, `Deleting ${article.title || 'article with no title'}`)
    await ArticleApi.delete(article.id)

    onProgress(0.4, 'Reloading remaining articles')
    await this.load()

    onProgress(0.7, 'Updating sort orders')
    SortableService.ungapSortOrders(this.articles)
    await Promise.all(this.articles.map(async (a) => this.save(a)))

    onProgress(1, 'Done!')
  }

  @action
  private addOrUpdate(article: Article) {
    if (this.articles.some((a) => a.id === article.id)) {
      const index = this.articles.findIndex((a) => a.id === article.id)
      this.articles.splice(index, 1, article)
    } else {
      this.articles.push(article)
      this.articles = SortableService.getSorted(this.articles, 'desc')
    }
  }

  getChildren(article: Article): Article[] {
    return this.articles.filter((a) => a.parentId === article.id)
  }

  private readonly IMAGE_SET_PROPERTY_NAMES = [
    'original',
    'cropped',
    'xl',
    'l',
    'm',
    's',
  ]

  private async uploadNewImages(
    article: Article,
    onProgress: (progress: number, message: string) => any,
    initialProgress = 0,
  ) {
    const newImagesCount = article.contents
      .filter((c) => c instanceof ImageContent && !!c.set.original?.url)
      .reduce((sum, content: ImageContent) => {
        let newSum = sum
        newSum += StorageService.isLocal(content.set.original.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.cropped.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.xl.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.l.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.m.url) ? 1 : 0
        newSum += StorageService.isLocal(content.set.s.url) ? 1 : 0
        return newSum
      }, 0)

    const progressPerImage = 0.6 / newImagesCount

    let accProgress = initialProgress

    const contentsWithImagesToUpload: ImageContent[] = article.contents.filter(
      (content) =>
        content instanceof ImageContent &&
        !!content.set.original?.url &&
        (StorageService.isLocal(content.set.original.url) ||
          StorageService.isLocal(content.set.cropped.url) ||
          StorageService.isLocal(content.set.xl.url) ||
          StorageService.isLocal(content.set.l.url) ||
          StorageService.isLocal(content.set.m.url) ||
          StorageService.isLocal(content.set.s.url)),
    ) as ImageContent[]

    return Promise.all(
      contentsWithImagesToUpload.map(async (content) => {
        return Promise.all(
          this.IMAGE_SET_PROPERTY_NAMES.filter((key) =>
            StorageService.isLocal(content.set[key].url),
          ).map(async (key) => {
            const image = content.set[key]
            image.url = await StorageService.storeFileFromLocalUrl(
              image.url,
              image.fileName,
              `articles/${article.id}`,
              (uploadProgress) => {
                const newProgress =
                  accProgress + uploadProgress * progressPerImage

                return onProgress(newProgress, image.fileName)
              },
            )
            accProgress += progressPerImage
          }),
        )
      }),
    )
  }

  @action
  private async populate(articles?: Article[]) {
    return Promise.all(
      articles.map(async (article) => {
        if (!!article.parentId && !article.parent) {
          article.parent =
            articles.find((a) => a.id === article.parentId) ||
            (await this.get(article.parentId))
        }
      }),
    )
  }

  @action
  onDestroy() {
    this.articles = []
    this.current = null
  }
}
