export class TextEditService {
  private static readonly linkRegex = /\[(.*?)\]\((.*?)\)/gim
  private static readonly urlPattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  )

  private static hasLinkInPosition(
    text: string,
    match: string,
    start: number,
    end: number,
  ) {
    const matchStart = text.indexOf(match)
    const matchEnd = matchStart + match.length
    if (
      (start > matchStart && start < matchEnd) ||
      (end > matchStart && end < matchEnd)
    ) {
      return true
    }
    return false
  }

  static getLinkInPosition(text: string, start: number, end: number) {
    const matches = text.match(this.linkRegex)
    if (!!matches) {
      for (const match of matches) {
        if (this.hasLinkInPosition(text, match, start, end)) {
          return match.substring(match.indexOf('(') + 1, match.lastIndexOf(')'))
        }
      }
    }
    return ''
  }

  static removeLinkInPosition(text: string, start: number, end: number) {
    const matches = text.match(this.linkRegex)
    if (!!matches) {
      for (const match of matches) {
        if (this.hasLinkInPosition(text, match, start, end)) {
          const linkedText = match.substring(
            match.indexOf('[') + 1,
            match.lastIndexOf(']'),
          )
          return text.replace(match, linkedText)
        }
      }
    }
    return ''
  }

  static insertLinkMarkupAtPosition(
    text: string,
    url: string,
    start: number,
    end: number,
  ) {
    const head = text.substring(0, start)
    const body = text.substring(start, end)
    const tail = text.substring(end)
    const linked = `[${body}](${url || 'https://'})`
    return `${head}${linked}${tail}`
  }

  static replaceLinkUrl(text: string, url: string, urlToReplace: string) {
    return text.replace(urlToReplace, url)
  }

  static validURL(str: string) {
    return !!str && this.urlPattern.test(str)
  }
}
