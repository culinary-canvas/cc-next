export function debounce(cb: (...args: any) => any, wait = 200) {
  let timeout
  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => cb(...args), wait)
  }
}
