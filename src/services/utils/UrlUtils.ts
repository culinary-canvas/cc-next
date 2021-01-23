export function addHttpIfMissing(url: string) {
  return url.indexOf('http') < 0 ? `https://${url}` : url
}
