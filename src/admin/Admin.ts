import { ArticleModel } from '../article/Article.model'
import { SectionModel } from '../article/section/Section.model'
import { Content } from '../article/content/Content'
import { FormControl } from '../form/formControl/FormControl'
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
  readonly formControl: FormControl<ArticleModel>
  readonly setFormControl: (v: FormControl<ArticleModel>) => void
  readonly section: SectionModel
  readonly setSection: (v: SectionModel) => void
  readonly content: Content
  readonly setContent: (v: Content) => void
  readonly article: ArticleModel
  readonly reset: () => void
}

export function useAdminState(): Admin {
  const [showUnpublishedOnStartPage, setShowUnpublishedOnStartPage] = useState<
    boolean
  >(false)
  const [sidebar, setSidebar] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [formControl, setFormControl] = useState<FormControl<ArticleModel>>()
  const [section, setSection] = useState<SectionModel>()
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
