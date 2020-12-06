import { useEffect, useState } from 'react'
import { useAuth } from '../services/auth/Auth'
import { MenuOptionDefinition } from './MenuOptionDefinition'
import StringUtils from '../services/utils/StringUtils'
import { ArticleType } from '../article/ArticleType'
import { isMobile } from 'react-device-detect'
import { useRouter } from 'next/router'

const options: MenuOptionDefinition[] = [
  new MenuOptionDefinition({
    path: '/',
    label: 'All',
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.DISH)}`,
    label: 'Dishes',
    articleType: ArticleType.DISH,
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.HOW_TO)}`,
    label: 'Recipes',
    articleType: ArticleType.HOW_TO,
  }),
  new MenuOptionDefinition({
    path: `/${StringUtils.toLowerKebabCase(ArticleType.PORTRAIT)}`,
    label: 'Portraits',
    articleType: ArticleType.PORTRAIT,
  }),
  new MenuOptionDefinition({
    path: '/admin/articles',
    label: 'Articles',
    isAdmin: true,
    includeSubRoutes: true,
    hideOnMobile: true,
  }),
  new MenuOptionDefinition({
    path: '/admin/articles/grid-preview',
    label: 'Preview start page',
    isAdmin: true,
  }),
  new MenuOptionDefinition({
    name: 'signOut',
    label: 'Sign out',
    isAdmin: true,
  }),
]
export function useMenu(): {
  options: MenuOptionDefinition[]
  optionsGenerator: Generator<MenuOptionDefinition, never>
  optionsReversedGenerator: Generator<MenuOptionDefinition, never>
  active: MenuOptionDefinition
} {
  const auth = useAuth()
  const router = useRouter()

  const [validOptions, setValidOptions] = useState<MenuOptionDefinition[]>([])
  const [active, setActive] = useState<MenuOptionDefinition>()

  useEffect(() => {
    setValidOptions(
      options.filter((o) => {
        if (o.isAdmin && !auth.isSignedIn) {
          return false
        }
        if (isMobile && o.hideOnMobile) {
          return false
        }
        return true
      }),
    )
  }, [auth.isSignedIn, isMobile])

  useEffect(() => {
    const a = options.find((o) => {
      if (!!o.articleType) {
        return router.query.type === StringUtils.toLowerKebabCase(o.articleType)
      }
      return o.path === router.pathname
    })
    setActive(a)
  }, [router, router.query, router.pathname])

  function* validOptionsGenerator() {
    return yield* validOptions
  }

  function* validOptionsReversedGenerator() {
    return yield* validOptions.reverse()
  }

  return {
    options: validOptions,
    optionsGenerator: validOptionsGenerator() as Generator<
      MenuOptionDefinition,
      never
    >,
    optionsReversedGenerator: validOptionsReversedGenerator() as Generator<
      MenuOptionDefinition,
      never
    >,
    active,
  }
}
