import { ArrayUtils } from './ArrayUtils'

export class DomUtils {
  static hasIdOrParentWithId(
    node: HTMLElement,
    id: string | string[],
  ): boolean {
    const ids = ArrayUtils.asArray(id)
    if (ids.includes(node.id)) {
      return true
    }
    if (!!node.parentElement) {
      return this.hasIdOrParentWithId(node.parentElement, id)
    }
    return false
  }
}
