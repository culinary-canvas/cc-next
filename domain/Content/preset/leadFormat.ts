import { TextFormat } from '../../Text/TextFormat'
import {cloneDeep} from '../../../services/importHelpers'

const format = new TextFormat({
  fontWeight: 700,
})

export function leadFormat() {
  return cloneDeep(format)
}
