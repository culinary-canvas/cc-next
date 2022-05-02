export const FONT = {
  FAMILY: {
    NEUE_HAAS_GROTESK: 'neue-haas-grotesk-display',
    FILSON: 'filson-pro',
    GARAMOND: 'garamond-premier-pro-caption',
    ELOQUENT: 'eloquent-jf-pro',
    FORMA: 'forma-djr-deck',
  } as const,
  SIZE: {
    XS: 9,
    S: 12,
    M: 16,
    ML: 20,
    L: 24,
    XL: 32,
    XML: 40,
    XXL: 48,
    XXML: 64,
    XXXL: 72,
    XXXXL: 96,
    XXXXXL: 128,
  } as const,
  WEIGHT: [100, 200, 300, 400, 500, 600, 700, 800, 900] as const,
}

export type FontFamily = typeof FONT.FAMILY[keyof typeof FONT.FAMILY]
export type FontSize = typeof FONT.SIZE[keyof typeof FONT.SIZE]
export type FontWeight = typeof FONT.WEIGHT[number]
