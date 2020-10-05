import React, { useEffect, useRef } from 'react'
import './ImageModal.module.scss'
import ReactCrop, { PercentCrop } from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
import { FileInput } from '../FileInput/FileInput'
import { observer } from 'mobx-react'
import Modal from 'react-modal'
import { Button } from '../Button/Button'
import { FileDrop } from 'react-file-drop'
import { ImageFile } from '../../domain/Image/ImageFile'
import { ImageCropValues } from '../../domain/Image/ImageCropValues'
import { useEnv } from '../../services/AppEnvironment'
import { ImageService } from '../../services/image/Image.service'
import { cloneDeep } from '../../services/importHelpers'
import { COLOR } from '../../styles/color'

export interface ImageModalProps {
  isOpen: boolean
  image: ImageFile
  cropValues: ImageCropValues
  onOk: (newImage?: ImageFile, newCropValues?: ImageCropValues) => Promise<any>
  onCancel?: () => any
}

export const ImageModal = observer((props: ImageModalProps) => {
  const env = useEnv()
  const { imageModalStore: store } = env
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
      <div className="content image-modal">
        {store.ready && (
          <>
            <main>
              {!!store.hasImageContent ? (
                <ReactCrop
                  className="image-crop"
                  src={store.image.url}
                  crossorigin="anonymous"
                  onImageLoaded={(image) => (imageRef.current = image)}
                  crop={store.cropValues as PercentCrop}
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
                  >
                    <FileInput
                      onChange={async (file) =>
                        store.setNewImage(await ImageService.getImage(file))
                      }
                      id="file-upload"
                    >
                      No image selected
                    </FileInput>
                  </FileDrop>
                </>
              )}
            </main>

            <footer>
              <FileInput
                onChange={async (file) =>
                  store.setNewImage(await ImageService.getImage(file))
                }
                id="file-upload"
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
