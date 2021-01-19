export const ICON = {
  SIZE: {
    XS: 12,
    S: 16,
    M: 24,
    L: 32,
    XL: 40,
  },
}

export type IconSizeType = typeof ICON.SIZE[keyof typeof ICON.SIZE]
