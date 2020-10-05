import { TextFormat } from '../../Text/TextFormat'
import {COLOR} from '../../../styles/color'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  color: COLOR.BLACK,
  fontSize: FONT.SIZE.XL,
  italic: true,
  fontWeight: 900,
})

export function subHeadingFormat() {
  return cloneDeep(format)
}
