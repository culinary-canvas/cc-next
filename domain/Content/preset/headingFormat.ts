import { TextFormat } from '../../Text/TextFormat'
import {FONT} from '../../../styles/font'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  fontSize: FONT.SIZE.L,
  fontWeight: 900,
})

export function headingFormat() {
  return cloneDeep(format)
}
