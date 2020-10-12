import { TextFormat } from '../text/TextFormat'
import { COLOR } from '../../../styles/color'
import { FONT } from '../../../styles/font'
import { cloneDeep } from '../../../services/importHelpers'

const format = new TextFormat({
  color: COLOR.BLACK,
  fontSize: FONT.SIZE.L,
  fontFamily: FONT.FAMILY.GARAMOND,
})

export function subHeadingFormat() {
  return cloneDeep(format)
}
