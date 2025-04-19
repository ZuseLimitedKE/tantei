/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppRouteImport } from './routes/app/route'
import { Route as IndexImport } from './routes/index'
import { Route as AppPortfolioImport } from './routes/app/portfolio'
import { Route as AppMarketplaceImport } from './routes/app/marketplace'
import { Route as AppLearnImport } from './routes/app/learn'

// Create/Update Routes

const AppRouteRoute = AppRouteImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AppPortfolioRoute = AppPortfolioImport.update({
  id: '/portfolio',
  path: '/portfolio',
  getParentRoute: () => AppRouteRoute,
} as any)

const AppMarketplaceRoute = AppMarketplaceImport.update({
  id: '/marketplace',
  path: '/marketplace',
  getParentRoute: () => AppRouteRoute,
} as any)

const AppLearnRoute = AppLearnImport.update({
  id: '/learn',
  path: '/learn',
  getParentRoute: () => AppRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppRouteImport
      parentRoute: typeof rootRoute
    }
    '/app/learn': {
      id: '/app/learn'
      path: '/learn'
      fullPath: '/app/learn'
      preLoaderRoute: typeof AppLearnImport
      parentRoute: typeof AppRouteImport
    }
    '/app/marketplace': {
      id: '/app/marketplace'
      path: '/marketplace'
      fullPath: '/app/marketplace'
      preLoaderRoute: typeof AppMarketplaceImport
      parentRoute: typeof AppRouteImport
    }
    '/app/portfolio': {
      id: '/app/portfolio'
      path: '/portfolio'
      fullPath: '/app/portfolio'
      preLoaderRoute: typeof AppPortfolioImport
      parentRoute: typeof AppRouteImport
    }
  }
}

// Create and export the route tree

interface AppRouteRouteChildren {
  AppLearnRoute: typeof AppLearnRoute
  AppMarketplaceRoute: typeof AppMarketplaceRoute
  AppPortfolioRoute: typeof AppPortfolioRoute
}

const AppRouteRouteChildren: AppRouteRouteChildren = {
  AppLearnRoute: AppLearnRoute,
  AppMarketplaceRoute: AppMarketplaceRoute,
  AppPortfolioRoute: AppPortfolioRoute,
}

const AppRouteRouteWithChildren = AppRouteRoute._addFileChildren(
  AppRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/app': typeof AppRouteRouteWithChildren
  '/app/learn': typeof AppLearnRoute
  '/app/marketplace': typeof AppMarketplaceRoute
  '/app/portfolio': typeof AppPortfolioRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/app': typeof AppRouteRouteWithChildren
  '/app/learn': typeof AppLearnRoute
  '/app/marketplace': typeof AppMarketplaceRoute
  '/app/portfolio': typeof AppPortfolioRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/app': typeof AppRouteRouteWithChildren
  '/app/learn': typeof AppLearnRoute
  '/app/marketplace': typeof AppMarketplaceRoute
  '/app/portfolio': typeof AppPortfolioRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/app' | '/app/learn' | '/app/marketplace' | '/app/portfolio'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/app' | '/app/learn' | '/app/marketplace' | '/app/portfolio'
  id:
    | '__root__'
    | '/'
    | '/app'
    | '/app/learn'
    | '/app/marketplace'
    | '/app/portfolio'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRouteRoute: typeof AppRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRouteRoute: AppRouteRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/app"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/app": {
      "filePath": "app/route.tsx",
      "children": [
        "/app/learn",
        "/app/marketplace",
        "/app/portfolio"
      ]
    },
    "/app/learn": {
      "filePath": "app/learn.tsx",
      "parent": "/app"
    },
    "/app/marketplace": {
      "filePath": "app/marketplace.tsx",
      "parent": "/app"
    },
    "/app/portfolio": {
      "filePath": "app/portfolio.tsx",
      "parent": "/app"
    }
  }
}
ROUTE_MANIFEST_END */
