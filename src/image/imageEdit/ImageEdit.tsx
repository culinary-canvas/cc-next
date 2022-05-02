import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { ImageFit } from '../../article/models/ImageFit'
import { ImageFormat } from '../../article/models/ImageFormat'
import { ImageService } from '../../services/Image.service'
import { classnames } from '../../services/importHelpers'
import { Image } from '../../shared/image/Image'
import { useOverlay } from '../../shared/overlay/OverlayStore'
import { ImageModal } from '../imageModal/ImageModal'
import { ImageSet } from '../models/ImageSet'
import s from './ImageEdit.module.scss'

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
      {!set?.url ? (
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
        <Image
          imageSet={set}
          id={id}
          width={format.fit === ImageFit.CONTAIN && set.width}
          height={format.fit === ImageFit.CONTAIN && set.height}
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
          className={classnames([
            s.content,
            { [s.disabled]: disabled },
            className,
          ])}
        />
      )}

      <ImageModal
        image={set?.original}
        cropValues={set?.cropValues}
        isOpen={isModalOpen}
        onOk={async (newImage, newCropValues) => {
          setModalOpen(false)

          if (!!newImage || !!newCropValues) {
            overlay.toggle()

            const newSet = await ImageService.createNewSet(
              overlay,
              set?.alt,
              newImage || set.original,
              newCropValues || set.cropValues,
            )

            setTimeout(() => overlay.toggle(false), 500)
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
})
