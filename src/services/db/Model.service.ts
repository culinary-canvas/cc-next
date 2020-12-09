import { Model } from './Model'
import firebase from 'firebase'
import DateTime from '../dateTime/DateTime'

export class ModelService {
  static beforeSave<T extends Model>(model: T, user: firebase.User) {
    if (!model.id) {
      model.created = DateTime.create()
      model.createdById = user.uid
    }
    model.modified = DateTime.create()
  }
}
