import { ImageCropValues } from '../models/ImageCropValues'
import { ImageFile } from '../models/ImageFile'
import {
  createContext,
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

export interface ImageModalState {
  readonly init: (image: ImageFile, cropValues: ImageCropValues) => void

  readonly inputImage: ImageFile
  readonly setInputImage: (v: ImageFile) => void
  readonly newImage: ImageFile
  readonly setNewImage: (image: ImageFile) => void
  readonly newCropValues: ImageCropValues
  readonly setNewCropValues: (cropValues: ImageCropValues) => void

  readonly cropValues: ImageCropValues
  readonly inputCropValues: ImageCropValues
  readonly ready: boolean
  readonly hasImageContent: boolean
  readonly cropValuesHasChanged: boolean
  readonly image: ImageFile
  readonly style: { overlay: CSSProperties; content: CSSProperties }

  readonly onDestroy: () => void
}

export function useImageModalState(): ImageModalState {
  const [inputImage, setInputImage] = useState<ImageFile>()
  const [inputCropValues, setInputCropValues] = useState<ImageCropValues>()
  const [ready, setReady] = useState<boolean>(false)
  const [newImage, setNewImage] = useState<ImageFile>()
  const [newCropValues, setNewCropValues] = useState<ImageCropValues>()
  const initialCropValues = useRef(new ImageCropValues(0, 0, 100, 100)).current

  const style = useRef({
    overlay: {
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '2rem',
    },
    content: {
      borderRadius: '1rem',
      border: 'none',
      padding: '1rem',
    },
  }).current

  const init = useCallback((image: ImageFile, cropValues: ImageCropValues) => {
    setInputImage(image)
    setInputCropValues(cropValues)
    setReady(true)
  }, [])

  const image = useMemo<ImageFile>(() => newImage || inputImage, [
    newImage,
    inputImage,
  ])
  const hasImageContent = useMemo<boolean>(() => !!image?.fileName, [image])
  const cropValues = useMemo<ImageCropValues>(
    () => newCropValues || inputCropValues || initialCropValues,
    [newCropValues, inputCropValues, initialCropValues],
  )

  const cropValuesHasChanged = useMemo<boolean>(() => {
    if (!newCropValues) {
      return false
    }
    if (!inputCropValues) {
      return true
    }
    return cropValuesEquals(newCropValues, inputCropValues)
  }, [newCropValues, inputCropValues])

  function cropValuesEquals(v1: ImageCropValues, v2: ImageCropValues) {
    return (
      v1.x !== v2.x ||
      v1.y !== v2.y ||
      v1.width !== v2.width ||
      v1.height !== v2.height
    )
  }

  const onDestroy = useCallback(() => {
    setReady(false)
    setInputImage(null)
    setInputCropValues(null)
    setNewImage(null)
    setNewCropValues(null)
  }, [])

  return {
    cropValues,
    hasImageContent,
    image,
    init,
    inputCropValues,
    inputImage,
    newCropValues,
    newImage,
    ready,
    setInputImage,
    setNewCropValues,
    setNewImage,
    style,
    cropValuesHasChanged,
    onDestroy,
  }
}

export const ImageModalContext = createContext<ImageModalState>(null)

export function useImageModal(): ImageModalState {
  const context = useContext(ImageModalContext)
  if (context === undefined) {
    throw new Error(
      'An error occurred when initializing ImageModalStore context',
    )
  }
  return context
}
