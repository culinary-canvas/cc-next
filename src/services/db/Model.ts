import DateTime from '../../domain/DateTime/DateTime'

export interface Model {
  id: string

  created: DateTime

  createdById: string

  modified: DateTime

  modifiedById: string
}
