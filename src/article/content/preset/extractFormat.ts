import { TextFormat } from '../text/TextFormat'
import { HorizontalAlign } from '../../shared/HorizontalAlign'
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
