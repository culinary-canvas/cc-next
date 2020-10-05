import { TextFormat } from '../../Text/TextFormat'
import {COLOR} from '../../../styles/color'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  color: COLOR.GREY,
  fontSize: FONT.SIZE.S,
})

export function bylineFormat() {
  return cloneDeep(format)
}
