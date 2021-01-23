 export const COLOR = {
  WHITE: '#ffffff',
  GREY_LIGHTER: '#e7ebed',
  GREY_LIGHT: '#b7bbbd',
  GREY: '#949ea3',
  GREY_DARK: '#5f686d',
  BLACK: '#000000',
  PINK_LIGHT: '#f2cfcf',
  PINK: '#ebb7b7',
  PINK_DARK: '#dc7f7f',
  GREEN_LIGHT: '#caf2e1',
  GREEN: '#1b998b',
  GREEN_DARK: '#07554c',
  YELLOW_LIGHT: '#fff399',
  YELLOW: '#fee100',
  BLUE_LIGHT: '#7fa0ff',
  BLUE: '#003eee',
  RED: '#e70c3f',
  RED_DARK: '#ae0930',
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
