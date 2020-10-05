import DbService from '../../services/db/Db.service'
import { OrderBy } from '../../services/db/OrderBy'
import { Tag } from './Tag'

export class TagApi {
  private static readonly db = new DbService(Tag)

  static async byId(id: string) {
    return this.db.getById(id)
  }

  static async all() {
    return this.db.get(null, [new OrderBy('name')])
  }

  static async save(tag: Tag): Promise<Tag> {
    return this.db.save(tag)
  }

  static async delete(id: string) {
    return this.db.delete(id)
  }
}
