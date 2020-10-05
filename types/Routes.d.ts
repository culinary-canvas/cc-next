import { adminRoutes } from '../adminRoutes'
import { publicRoutes } from '../publicRoutes'

export type PublicRoute = typeof publicRoutes[number]['name']
export type AdminRoute = typeof adminRoutes[number]['name']
export type Route = PublicRoute & AdminRoute
