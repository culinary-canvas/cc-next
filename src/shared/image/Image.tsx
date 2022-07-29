import { observer } from 'mobx-react-lite'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import React, { CSSProperties } from 'react'
import { ImageSet } from '../../image/models/ImageSet'

type Props = Omit<
  NextImageProps,
  'src' | 'srcset' | 'sizes' | 'alt' | 'placeholder'
> & {
  imageSet: ImageSet
  sizes?: string
  placeholder?: () => JSX.Element
  figureClassName?: string
  figureStyle?: CSSProperties
}

export const Image = observer((props: Props) => {
  const {
    sizes,
    imageSet,
    placeholder,
    priority = true,
    figureClassName,
    figureStyle,
    width,
    height,
    quality = 75,
    layout = 'responsive',
    ...restNextImageProps
  } = props

  return (
    <>
      <figure className={figureClassName} style={figureStyle}>
        {!!imageSet?.url ? (
          <NextImage
            quality={quality}
            priority={priority}
            sizes={sizes}
            src={imageSet?.url}
            alt={imageSet?.alt}
            width={width}
            height={height}
            // @ts-ignore
            layout={layout}
            {...restNextImageProps}
          />
        ) : (
          !!placeholder && placeholder()
        )}
      </figure>
    </>
  )
})
