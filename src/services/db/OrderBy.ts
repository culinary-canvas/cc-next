import * as firebase from 'firebase/app'
import 'firebase/firestore'

export class OrderBy {
  constructor(
    readonly fieldPath: string | firebase.firestore.FieldPath,
    readonly directionStr: 'asc' | 'desc' = 'asc',
  ) {}
}
