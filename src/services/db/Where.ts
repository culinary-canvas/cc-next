import { Model } from './Model'

class Where<T extends Model = any, U = any> {
  static readonly EQUALS = '=='
  static readonly LESS_OR_EQUAL = '<='
  static readonly LESS = '<'
  static readonly GREATER_OR_EQUAL = '>='
  static readonly GREATER = '>'
  static readonly ARRAY_CONTAINS = 'array-contains'
  static readonly ARRAY_CONTAINS_ANY = 'array-contains-any'
  static readonly IN = 'in'

  key: keyof T | string
  value: U | U[]
  operator: firebase.firestore.WhereFilterOp

  constructor(where?: keyof T | string) {
    this.key = where
  }

  field(key: string) {
    this.key = key
    return this
  }

  is(value: U) {
    this.value = value
    this.operator = Where.EQUALS
    return this
  }

  smallerOrEqualTo(value: U) {
    this.value = value
    this.operator = Where.LESS_OR_EQUAL
    return this
  }

  smallerThan(value: U) {
    this.value = value
    this.operator = Where.LESS
    return this
  }

  greaterOrEqualTo(value: U) {
    this.value = value
    this.operator = Where.GREATER_OR_EQUAL
    return this
  }

  greaterThan(value: U) {
    this.value = value
    this.operator = Where.GREATER
    return this
  }

  in(value: U[]) {
    this.value = value
    this.operator = Where.IN
    return this
  }

  /**
   * Compares this Where with another Where
   *
   * @memberof Where
   */
  equals = (compareCondition: Where) => {
    return (
      compareCondition.key === this.key &&
      compareCondition.operator === this.operator &&
      compareCondition.value === this.value
    )
  }
}

export default Where
