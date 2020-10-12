import { TextFormat } from '../text/TextFormat'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  fontFamily: FONT.FAMILY.GARAMOND,
})

export function paragraphFormat() {
  return cloneDeep(format)
}
