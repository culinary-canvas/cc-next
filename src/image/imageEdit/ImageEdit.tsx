import React, { useState } from 'react'
import { ImageModal } from '../imageModal/ImageModal'
import s from './ImageEdit.module.scss'
import { ImageSet } from '../models/ImageSet'
import { classnames } from '../../services/importHelpers'
import { ImageService } from '../../services/Image.service'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import Image from 'next/image'
import { ImageFormat } from '../../article/models/ImageFormat'
import { ImageFit } from '../../article/models/ImageFit'
import { observer } from 'mobx-react-lite'

interface Props {
  set: ImageSet
  format: ImageFormat
  className?: string
  onChange: (set: ImageSet) => any
  onCancel?: () => any
  enableModal?: boolean
  onFocus?: () => any
  id?: string
  disabled?: boolean
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
    disabled = false,
  } = props
  const overlay = useOverlay()
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      {!set?.cropped?.fileName ? (
        <div
          id={id}
          onClick={() => {
            if (!disabled) {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }
          }}
          onKeyUp={() => {
            if (!disabled) {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }
          }}
          tabIndex={0}
          role="button"
          className={classnames([
            s.content,
            s.noFile,
            { [s.disabled]: disabled },
            className,
          ])}
        >
          No image selected {isModalOpen}
        </div>
      ) : (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <Image
          id={id}
          width={format.fit === ImageFit.CONTAIN && set.cropped.width}
          height={format.fit === ImageFit.CONTAIN && set.cropped.height}
          onClick={() => {
            if (!disabled) {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }
          }}
          onKeyUp={() => {
            if (!disabled) {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }
          }}
          // @ts-ignore
          layout={format.fit === ImageFit.CONTAIN ? 'responsive' : 'fill'}
          objectFit={format.fit.toLowerCase() as 'contain' | 'cover'}
          objectPosition={`${format.verticalAlign.toLowerCase()} ${format.horizontalAlign.toLowerCase()}`}
          alt={set.alt}
          src={set.cropped.url}
          className={classnames([
            s.content,
            { [s.disabled]: disabled },
            className,
          ])}
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
