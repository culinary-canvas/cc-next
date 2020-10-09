import { Model } from './Model'
import { User } from 'firebase'
import DateTime from '../../domain/DateTime/DateTime'

export class ModelService {
  static beforeSave<T extends Model>(model: T, user: User) {
    if (!model.id) {
      model.created = DateTime.create()
      model.createdById = user.uid
    }
    model.modified = DateTime.create()
  }
}
