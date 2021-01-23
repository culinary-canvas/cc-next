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
import { observer } from 'mobx-react'

interface Props {
  set: ImageSet
  format: ImageFormat
  className?: string
  onChange: (set: ImageSet) => any
  onCancel?: () => any
  enableModal?: boolean
  onFocus?: () => any
  id?: string
}

export const ImageEdit = observer((props: Props) => {
  const {
    set,
    format,
    onChange,
    onCancel,
    className,
    enableModal = true,
    onFocus,
    id,
  } = props
  const overlay = useOverlay()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      {!set?.cropped?.fileName ? (
        <div
          id={id}
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
          id={id}
          width={format.fit === ImageFit.CONTAIN && set.cropped.width}
          height={format.fit === ImageFit.CONTAIN && set.cropped.height}
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
          objectPosition={`${format.verticalAlign.toLowerCase()} ${format.horizontalAlign.toLowerCase()}`}
          alt={set.alt}
          src={set.cropped.url}
          className={classnames([s.content, className])}
          quality={65}
        />
      )}

      {!!set && (
        <ImageModal
          image={set.original}
          cropValues={set.cropValues}
          isOpen={isModalOpen}
          onOk={async (newImage, newCropValues) => {
            const original = newImage || set.original
            const cropValues = newCropValues || set.cropValues

            setModalOpen(false)

            if (!!newImage || !!newCropValues) {
              overlay.setProgress(0, 'Crunching image sizes...')
              overlay.toggle()

              const newSet = new ImageSet()
              newSet.alt = set.alt

              newSet.original = original
              newSet.cropValues = cropValues

              overlay.setProgress(0.5, 'Generating cropped image...')
              newSet.cropped = await ImageService.crop(original, cropValues)
              overlay.setProgress(1, 'Done!')

              setTimeout(() => overlay.toggle(false), 500)
              onChange(newSet)
            }
          }}
          onCancel={() => {
            setModalOpen(false)
            onCancel && onCancel()
          }}
        />
      )}
    </>
  )
})
