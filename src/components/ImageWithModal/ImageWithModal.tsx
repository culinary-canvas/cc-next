import React, { CSSProperties, forwardRef, useState } from 'react'
import { ImageModal } from '../ImageModal/ImageModal'
import './ImageWithModal.module.scss'
import { useObserver } from 'mobx-react'
import { ImageSet } from '../../domain/Image/ImageSet'
import { useEnv } from '../../services/AppEnvironment'
import { classnames } from '../../services/importHelpers'
import { ImageService } from '../../services/image/Image.service'
import { BREAKPOINT } from '../../styles/layout'

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
    const env = useEnv()
    const {
      set,
      onChange,
      onCancel,
      style,
      className,
      enableModal = true,
      onFocus,
    } = props

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
            className={classnames(['image-with-modal', 'no-file', className])}
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
            className={classnames(['image-with-modal', className])}
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
              env.overlayStore.setText('Crunching image sizes...')
              env.overlayStore.setProgress(0)
              env.overlayStore.toggle()

              const progressPerImage = !!newImage ? 1 / 6 : 1 / 5

              const newSet = new ImageSet()
              newSet.alt = set.alt

              if (!!newImage) {
                env.overlayStore.setText(
                  'Setting original image size to max 3000px...',
                )
                newSet.original = await ImageService.resize(original)
                env.overlayStore.addProgress(progressPerImage)
              } else {
                newSet.original = set.original
              }

              newSet.cropValues = cropValues

              env.overlayStore.setText('Generating cropped image...')
              const cropped = await ImageService.crop(original, cropValues)
              newSet.cropped = await ImageService.resize(cropped)
              env.overlayStore.addProgress(progressPerImage)

              env.overlayStore.setText('Generating image for phones...')
              newSet.s = await ImageService.resize(
                cropped,
                's_',
                0.6,
                BREAKPOINT.PHONE,
              )
              env.overlayStore.addProgress(progressPerImage)

              env.overlayStore.setText('Generating image for tablets...')
              newSet.m = await ImageService.resize(
                cropped,
                'm_',
                0.6,
                BREAKPOINT.TABLET,
              )
              env.overlayStore.addProgress(progressPerImage)

              env.overlayStore.setText('Generating image for small desktops...')
              newSet.l = await ImageService.resize(
                cropped,
                'l_',
                0.6,
                BREAKPOINT.DESKTOP_S,
              )
              env.overlayStore.addProgress(progressPerImage)

              env.overlayStore.setText('Generating image for large desktops...')
              newSet.xl = await ImageService.resize(
                cropped,
                'xl_',
                0.6,
                BREAKPOINT.DESKTOP_L,
              )
              env.overlayStore.setProgress(1)

              env.overlayStore.setText('Done!')
              setTimeout(() => env.overlayStore.toggle(), 500)
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
