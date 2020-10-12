import DateTime from '../dateTime/DateTime'

export interface Model {
  id: string

  created: DateTime

  createdById: string

  modified: DateTime

  modifiedById: string
}
