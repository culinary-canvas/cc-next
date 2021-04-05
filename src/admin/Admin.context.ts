import { ArticleModel } from '../article/models/Article.model'
import { SectionModel } from '../article/models/Section.model'
import { ContentModel } from '../article/models/ContentModel'
import { FormControl } from '../services/formControl/FormControl'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ArticlePart } from '../article/models/ArticlePart'

export interface AdminContext {
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
  readonly content: ContentModel
  readonly setContent: (v: ContentModel) => void
  readonly setArticlePart: (v: ArticlePart) => void
  readonly article: ArticleModel
  readonly reset: () => void
  readonly mode: 'article' | 'preview'
  readonly setMode: (mode: 'article' | 'preview') => void
}

export function useAdminState(): AdminContext {
  const [
    showUnpublishedOnStartPage,
    setShowUnpublishedOnStartPage,
  ] = useState<boolean>(false)
  const [sidebar, setSidebar] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [formControl, setFormControl] = useState<FormControl<ArticleModel>>()
  const [section, _setSection] = useState<SectionModel>()
  const [content, _setContent] = useState<ContentModel>()
  const [article, setArticle] = useState<ArticleModel>()
  const [mode, setMode] = useState<'article' | 'preview'>('article')

  useEffect(() => setArticle(formControl?.mutable), [formControl])

  const setSection = useCallback(
    (s: SectionModel) => {
      const previousUid = section?.uid
      _setSection(s)
      if (!!previousUid && s.uid !== previousUid) {
        _setContent(s?.contents[0])
      }
    },
    [section],
  )

  const setContent = useCallback(
    (content: ContentModel) => {
      _setContent(content)
      if (!!article) {
        const section = article.sections.find((s) =>
          s.contents.some((c) => c.uid === content.uid),
        )
        _setSection(section)
      }
    },
    [article, _setContent, _setSection],
  )

  const setArticlePart = useCallback(
    (part: ArticlePart) => {
      if (!!article) {
        if (part instanceof SectionModel) {
          const section = article.sections.find((s) => part.uid === s.uid)
          setSection(section)
        } else {
          const content = article.contents.find((c) => part.uid === c.uid)
          setContent(content)
        }
      }
    },
    [article, setSection, setContent],
  )

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
    setArticlePart,
    article,
    reset,
    mode,
    setMode,
  }
}
export const AdminContext = createContext<AdminContext>(null)

export function useAdmin(): AdminContext {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('An error occurred when initializing Admin context')
  }
  return context
}
