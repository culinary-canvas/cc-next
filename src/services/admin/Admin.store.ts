import { Article } from '../../domain/Article/Article'
import { Section } from '../../domain/Section/Section'
import { Content } from '../../domain/Content/Content'
import { FormControl } from '../formControl/FormControl'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export interface Admin {
  readonly showUnpublishedOnStartPage: boolean
  readonly setShowUnpublishedOnStartPage: (v: boolean) => void
  readonly sidebar: boolean
  readonly setSidebar: (v: boolean) => void
  readonly sidebarOpen: boolean
  readonly setSidebarOpen: (v: boolean) => void
  readonly formControl: FormControl<Article>
  readonly setFormControl: (v: FormControl<Article>) => void
  readonly section: Section
  readonly setSection: (v: Section) => void
  readonly content: Content
  readonly setContent: (v: Content) => void
  readonly article: Article
  readonly reset: () => void
}

export function useAdminState(): Admin {
  const [showUnpublishedOnStartPage, setShowUnpublishedOnStartPage] = useState<
    boolean
  >(false)
  const [sidebar, setSidebar] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [formControl, setFormControl] = useState<FormControl<Article>>()
  const [section, setSection] = useState<Section>()
  const [content, setContent] = useState<Content>()
  const article = useMemo(() => formControl?.mutable, [formControl])

  const reset = useCallback(() => {
    setSidebar(false)
    setSidebarOpen(false)
    setSection(null)
    setContent(null)
    setFormControl(null)
  }, [])

  return {
    showUnpublishedOnStartPage,
    setShowUnpublishedOnStartPage,
    sidebar,
    setSidebar,
    sidebarOpen,
    setSidebarOpen,
    formControl,
    setFormControl,
    section,
    setSection,
    content,
    setContent,
    article,
    reset,
  }
}
export const AdminContext = createContext<Admin>(null)

export function useAdmin(): Admin {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Admin context')
  }
  return context
}
