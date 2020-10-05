import { Model } from '../services/db/Model'

interface BaApi<I extends Model> {
  getById: (id: string) => Promise<I>
  save: (I) => Promise<I>
}

export default BaApi
