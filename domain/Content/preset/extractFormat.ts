import { TextFormat } from '../../Text/TextFormat'
import { HorizontalAlign } from '../../Text/HorizontalAlign'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  horizontalAlign: HorizontalAlign.CENTER,
  fontFamily: FONT.FAMILY.ELOQUENT,
  fontSize: FONT.SIZE.XL,
})

export function extractFormat() {
  return cloneDeep(format)
}
