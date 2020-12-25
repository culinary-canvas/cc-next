export const COLOR = {
  BLACK: '#000000',
  GREY_DARK: '#5f686d',
  GREY: '#949ea3',
  GREY_LIGHT: '#b7bbbd',
  GREY_LIGHTER: '#E7EBED',
  WHITE: '#FFFFFF',
  BLUE: '#003EEE',
  BLUE_LIGHT: '#7fa0ff',
  RED: '#e70c3f',
  RED_DARK: '#AE0930',
  PINK: '#EBB7B7',
  YELLOW: '#FEE100',
  BEIGE: '#EBE1B7',
  GREEN: '#1B998B',
} as const

export type ColorType = typeof COLOR[keyof typeof COLOR] | string

export function RGBToHex(rgb: string) {
  // Choose correct separator
  const sep = rgb.indexOf(',') > -1 ? ',' : ' '
  // Turn "rgb(r,g,b)" into [r,g,b]
  const rgbParts = rgb.substr(4).split(')')[0].split(sep)

  let r = (+rgbParts[0]).toString(16)
  let g = (+rgbParts[1]).toString(16)
  let b = (+rgbParts[2]).toString(16)

  if (r.length === 1) {
    r = '0' + r
  }
  if (g.length === 1) {
    g = '0' + g
  }
  if (b.length === 1) {
    b = '0' + b
  }

  return '#' + r + g + b
}

export function isSystemColor(hex: string) {
  return Object.values(COLOR).some((c) => c === hex)
}
