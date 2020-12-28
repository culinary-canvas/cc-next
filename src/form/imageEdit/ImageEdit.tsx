import React, { useState } from 'react'
import { ImageModal } from '../imageModal/ImageModal'
import s from './ImageEdit.module.scss'
import { ImageSet } from '../../article/content/image/ImageSet'
import { classnames } from '../../services/importHelpers'
import { ImageService } from '../../article/content/image/Image.service'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import Image from 'next/image'
import { ImageFormat } from '../../article/content/image/ImageFormat'
import { ImageFit } from '../../article/content/image/ImageFit'

interface Props {
  set: ImageSet
  format: ImageFormat
  className?: string
  onChange: (set: ImageSet) => any
  onCancel?: () => any
  enableModal?: boolean
  onFocus?: () => any
}

export function ImageEdit(props: Props) {
  const {
    set,
    format,
    onChange,
    onCancel,
    className,
    enableModal = true,
    onFocus,
  } = props
  const overlay = useOverlay()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      {!set.cropped?.fileName ? (
        <div
          onClick={() => {
            enableModal && setModalOpen(true)
            onFocus && onFocus()
          }}
          onKeyUp={() => {
            enableModal && setModalOpen(true)
            onFocus && onFocus()
          }}
          tabIndex={0}
          role="button"
          className={classnames([s.content, s.noFile, className])}
        >
          No image selected
        </div>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <Image
          width={
            format.fit === ImageFit.CONTAIN &&
            (format.fixedWidth || set.cropped.width)
          }
          height={
            format.fit === ImageFit.CONTAIN &&
            (format.fixedHeight || set.cropped.height)
          }
          onClick={() => {
            enableModal && setModalOpen(true)
            onFocus && onFocus()
          }}
          onKeyUp={() => {
            enableModal && setModalOpen(true)
            onFocus && onFocus()
          }}
          // @ts-ignore
          layout={format.fit === ImageFit.CONTAIN ? 'responsive' : 'fill'}
          objectFit={format.fit.toLowerCase() as 'contain' | 'cover'}
          alt={set.alt}
          src={set.cropped.url}
          className={classnames([s.content, className])}
        />
      )}

      <ImageModal
        image={set.original}
        cropValues={set.cropValues}
        isOpen={isModalOpen}
        onOk={async (newImage, newCropValues) => {
          const original = newImage || set.original
          const cropValues = newCropValues || set.cropValues

          setModalOpen(false)

          if (!!newImage || !!newCropValues) {
            overlay.setText('Crunching image sizes...')
            overlay.setProgress(0)
            overlay.toggle()

            const newSet = new ImageSet()
            newSet.alt = set.alt

            newSet.original = set.original
            newSet.cropValues = cropValues

            overlay.setText('Generating cropped image...')
            overlay.setProgress(0.5)
            newSet.cropped = await ImageService.crop(original, cropValues)
            overlay.setProgress(1)

            overlay.setText('Done!')
            setTimeout(() => overlay.setVisible(false), 500)
            onChange(newSet)
          }
        }}
        onCancel={() => {
          setModalOpen(false)
          onCancel && onCancel()
        }}
      />
    </>
  )
}
