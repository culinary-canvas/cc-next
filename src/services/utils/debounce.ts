export function debounce(cb: (...args: any) => any, wait = 200) {
  let timeout
  return (...args: any) => {
    clearTimeout(timeout)
    // eslint-disable-next-line standard/no-callback-literal
    timeout = setTimeout(() => cb(...args), wait)
  }
}
