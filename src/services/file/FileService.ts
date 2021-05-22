export class FileService {
  static readonly CONTENT_TYPES = {
    JPG: 'image/jpeg',
    GIF: 'image/gif',
    PNG: 'image/png',
    WEBP: 'image/webp',
    SVG: 'image/svg+xml',
  }

  static async getUrl(file: File): Promise<string> {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    return new Promise((resolve) => {
      fileReader.onloadend = () => resolve(fileReader.result as string)
    })
  }

  static async getBlob(
    url: string,
    mimeType = this.getMimeType(url),
  ): Promise<Blob> {
    const headers = new Headers()
    // headers.set('content-type', mimeType)

    const result = await fetch(url, { headers })
    return await result.blob()
  }

  static async getFile(
    url: string,
    fileName: string,
    mimeType = this.getMimeType(url),
  ): Promise<File> {
    const blob = await this.getBlob(url, mimeType)
    return new File([blob], fileName, { type: mimeType })
  }

  static getMimeType(url: string) {
    if (!url.includes('data:')) {
      return 'application/octet-stream'
    }

    return url.substring(url.indexOf(':') + 1, url.indexOf(';'))
  }

  static async getSize(url: string) {
    const blob = await this.getBlob(url)
    return blob?.size
  }

  static getContentType(urlOrFileName: string): string {
    const end =
      urlOrFileName.indexOf('?') >= 0 ? urlOrFileName.indexOf('?') : undefined
    const start = urlOrFileName.lastIndexOf('.')
    const extension = urlOrFileName.substring(start, end)
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return this.CONTENT_TYPES.JPG
      case '.gif':
        return this.CONTENT_TYPES.GIF
      case '.png':
        return this.CONTENT_TYPES.PNG
      case '.webp':
        return this.CONTENT_TYPES.WEBP
      case '.svg':
        return this.CONTENT_TYPES.SVG
    }
  }
}
