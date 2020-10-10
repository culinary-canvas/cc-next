import React, { CSSProperties, forwardRef, useState } from 'react'
import { ImageModal } from '../ImageModal/ImageModal'
import s from './ImageWithModal.module.scss'
import { useObserver } from 'mobx-react'
import { ImageSet } from '../../domain/Image/ImageSet'
import { classnames } from '../../services/importHelpers'
import { ImageService } from '../../services/image/Image.service'
import { BREAKPOINT } from '../../styles/layout'
import { useOverlay } from '../../services/OverlayStore'

interface Props {
  set: ImageSet
  style?: CSSProperties
  className?: string
  onChange: (set: ImageSet) => any
  onCancel?: () => any
  enableModal?: boolean
  onFocus?: () => any
}

export const ImageWithModal = forwardRef<HTMLImageElement, Props>(
  (props, ref) => {
    const {
      set,
      onChange,
      onCancel,
      style,
      className,
      enableModal = true,
      onFocus,
    } = props
    const overlay = useOverlay()
    const [isModalOpen, setModalOpen] = useState<boolean>(false)

    return useObserver(() => (
      <>
        {!set.image?.fileName ? (
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
            style={{
              ...style,
            }}
            className={classnames([s.content, s.noFile, className])}
          >
            No image selected
          </div>
        ) : (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            ref={ref}
            src={set.image.url}
            alt={set.alt}
            onClick={() => {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }}
            onKeyUp={() => {
              enableModal && setModalOpen(true)
              onFocus && onFocus()
            }}
            style={{
              ...style,
            }}
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

              const progressPerImage = !!newImage ? 1 / 6 : 1 / 5

              const newSet = new ImageSet()
              newSet.alt = set.alt

              if (!!newImage) {
                overlay.setText('Setting original image size to max 3000px...')
                newSet.original = await ImageService.resize(original)
                overlay.addProgress(progressPerImage)
              } else {
                newSet.original = set.original
              }

              newSet.cropValues = cropValues

              overlay.setText('Generating cropped image...')
              const cropped = await ImageService.crop(original, cropValues)
              newSet.cropped = await ImageService.resize(cropped)
              overlay.addProgress(progressPerImage)

              const quality = 0.7

              overlay.setText('Generating image for phones...')
              newSet.s = await ImageService.resize(
                cropped,
                's_',
                quality,
                BREAKPOINT.PHONE,
              )
              overlay.addProgress(progressPerImage)

              overlay.setText('Generating image for tablets...')
              newSet.m = await ImageService.resize(
                cropped,
                'm_',
                quality,
                BREAKPOINT.TABLET,
              )
              overlay.addProgress(progressPerImage)

              overlay.setText('Generating image for small desktops...')
              newSet.l = await ImageService.resize(
                cropped,
                'l_',
                quality,
                BREAKPOINT.DESKTOP_S,
              )
              overlay.addProgress(progressPerImage)

              overlay.setText('Generating image for large desktops...')
              newSet.xl = await ImageService.resize(
                cropped,
                'xl_',
                quality,
                BREAKPOINT.DESKTOP_L,
              )
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
    ))
  },
)

ImageWithModal.displayName = 'ImageWithModal'
