import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { ImageService } from '../../services/Image.service'
import { ImageSet } from '../../image/models/ImageSet'
import { useResizeDetector } from 'react-resize-detector'

type Props = Omit<
  NextImageProps,
  'src' | 'srcset' | 'sizes' | 'alt' | 'placeholder' | 'quality'
> & {
  imageSet: ImageSet
  initialSizeVw?: number
  placeholder?: () => JSX.Element
  figureClassName?: string
  figureStyle?: CSSProperties
  quality?: number
  layout?: 'fill' | 'responsize' | 'fixed' | 'intrinsic'
}

export const Image = observer((props: Props) => {
  const {
    imageSet,
    initialSizeVw = 10,
    placeholder,
    priority = true,
    figureClassName,
    figureStyle,
    width,
    height,
    quality = 70,
    layout = 'fill',
    ...restNextImageProps
  } = props

  const [sizePx, setSizePx] = useState<number>()
  const {
    width: figureWidth,
    height: figureHeight,
    ref: figureRef,
  } = useResizeDetector()

  const calculateSize = useCallback(
    (w, h) => {
      if (!!imageSet?.image.url) {
        const size = ImageService.determineImageSizeByLargestDimension(
          imageSet.image.url,
          imageSet.image.width,
          imageSet.image.height,
          w,
          h,
        )
        if (!!size) {
          setSizePx(size)
        }
      }
    },
    [imageSet],
  )

  useEffect(() => {
    calculateSize(figureWidth, figureHeight)
  }, [figureWidth, figureHeight])

  return (
    <>
      <figure ref={figureRef} className={figureClassName} style={figureStyle}>
        {!!imageSet?.url ? (
          <NextImage
            quality={quality}
            priority={priority}
            sizes={!!sizePx ? `${sizePx}px` : `${initialSizeVw}vw`}
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
