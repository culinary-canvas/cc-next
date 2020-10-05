export const delay = async (delay = 1000) => {
  let resolver = null
  const promise = new Promise(resolve => (resolver = resolve))
  setTimeout(() => resolver(), delay)
  await promise
}
