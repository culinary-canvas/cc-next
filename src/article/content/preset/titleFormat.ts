import {TextFormat} from '../text/TextFormat'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  fontFamily: FONT.FAMILY.FILSON,
  fontWeight: 900,
  fontSize: FONT.SIZE.XXXXL,
})

export function titleFormat() {
  return cloneDeep(format)
}
