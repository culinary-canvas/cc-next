import { ArticleModel } from './Article.model'
import { ArticleLabel } from './ArticleLabel'
import { makeObservable, observable } from 'mobx'
import { ArrayUtils } from '../../services/utils/ArrayUtils'

export class ArticleWithLabels {
  @observable article: ArticleModel
  @observable labels: ArticleLabel[]

  constructor(
    article: ArticleModel,
    labels: ArticleLabel | ArticleLabel[] = [],
  ) {
    makeObservable(this)
    this.article = article
    this.labels = ArrayUtils.asArray(labels)
  }
}
