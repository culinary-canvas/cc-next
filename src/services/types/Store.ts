export abstract class Store<T> {
  constructor(serialized?: T) {
    if (!!serialized) {
      Object.entries(serialized).forEach(([key, value]) => (this[key] = value))
    }
  }

  abstract onDestroy(): void
}
export default Store
