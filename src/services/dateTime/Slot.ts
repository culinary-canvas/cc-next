import DateTime from './DateTime'
import Time from './Time'

interface Slot<T = DateTime | Time> {
  start: T
  end: T
}

export default Slot
