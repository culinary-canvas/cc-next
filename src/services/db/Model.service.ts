import { Model } from './Model'

export class ModelService {
  static beforeSave<T extends Model>(model: T, userId: T['createdById']) {
    if (!model.id) {
      model.created = new Date()
      model.createdById = userId
    }
    model.modified = new Date()
  }
}
