export class FileService {
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
}
