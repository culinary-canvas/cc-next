import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import { FileDrop } from 'react-file-drop'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Modal from 'react-modal'
import { ImageService } from '../../services/Image.service'
import { cloneDeep } from '../../services/importHelpers'
import { Button } from '../../shared/button/Button'
import { FileInput } from '../../shared/fileInput/FileInput'
import { COLOR } from '../../styles/_color'
import { ImageCropValues } from '../models/ImageCropValues'
import { ImageFile } from '../models/ImageFile'
import s from './ImageModal.module.scss'
import { useImageModal } from './ImageModal.store'

export interface ImageModalProps {
  isOpen: boolean
  image: ImageFile
  cropValues: ImageCropValues
  onOk: (newImage?: ImageFile, newCropValues?: ImageCropValues) => Promise<any>
  onCancel?: () => any
}

export const ImageModal = observer((props: ImageModalProps) => {
  const store = useImageModal()
  const { isOpen, image, onOk, onCancel, cropValues } = props

  const imageRef = useRef<HTMLImageElement>()

  useEffect(() => {
    if (isOpen) {
      store.init(image, cropValues)
    }
  }, [cropValues, image, isOpen, store])

  return (
    <Modal
      contentLabel="ImageFile modal"
      isOpen={isOpen}
      onAfterClose={() => store.onDestroy()}
      onRequestClose={() => onCancel && onCancel()}
      style={store.style}
    >
      <div className={s.content}>
        {store.ready && (
          <>
            <main>
              {!!store.hasImageContent ? (
                <ReactCrop
                  className={s.imageCrop}
                  src={store.image.url}
                  crossorigin="anonymous"
                  onImageLoaded={(image) => {
                    imageRef.current = image
                  }}
                  crop={store.cropValues}
                  onChange={(_cropPx, percentCrop) =>
                    store.setNewCropValues(
                      new ImageCropValues(
                        percentCrop.x,
                        percentCrop.y,
                        percentCrop.width,
                        percentCrop.height,
                      ),
                    )
                  }
                />
              ) : (
                <>
                  <FileDrop
                    onDrop={async (files) =>
                      store.setNewImage(await ImageService.getImage(files[0]))
                    }
                  ></FileDrop>
                  <FileInput
                    onChange={async (file) =>
                      store.setNewImage(await ImageService.getImage(file))
                    }
                    id="file-upload-1"
                  >
                    No image selected
                  </FileInput>
                </>
              )}
            </main>

            <footer>
              <FileInput
                onChange={async (file) =>
                  store.setNewImage(await ImageService.getImage(file))
                }
                id="file-upload-2"
                display
                open={isOpen && !store.hasImageContent}
              >
                {store.image?.fileName || 'No image selected'}
              </FileInput>

              <Button
                onClick={() =>
                  onOk(
                    !!store.newImage ? cloneDeep(store.newImage) : undefined,
                    !!store.cropValuesHasChanged
                      ? cloneDeep(store.newCropValues)
                      : undefined,
                  )
                }
              >
                OK
              </Button>

              <Button
                onClick={() => {
                  onCancel && onCancel()
                }}
                color={COLOR.GREY}
              >
                Cancel
              </Button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  )
})
