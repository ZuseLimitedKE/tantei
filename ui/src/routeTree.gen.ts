/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PortfolioImport } from './routes/portfolio'
import { Route as MarketplaceImport } from './routes/marketplace'
import { Route as IndexImport } from './routes/index'
import { Route as DemoTanstackQueryImport } from './routes/demo.tanstack-query'

// Create/Update Routes

const PortfolioRoute = PortfolioImport.update({
  id: '/portfolio',
  path: '/portfolio',
  getParentRoute: () => rootRoute,
} as any)

const MarketplaceRoute = MarketplaceImport.update({
  id: '/marketplace',
  path: '/marketplace',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DemoTanstackQueryRoute = DemoTanstackQueryImport.update({
  id: '/demo/tanstack-query',
  path: '/demo/tanstack-query',
  getParentRoute: () => rootRoute,
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
    '/marketplace': {
      id: '/marketplace'
      path: '/marketplace'
      fullPath: '/marketplace'
      preLoaderRoute: typeof MarketplaceImport
      parentRoute: typeof rootRoute
    }
    '/portfolio': {
      id: '/portfolio'
      path: '/portfolio'
      fullPath: '/portfolio'
      preLoaderRoute: typeof PortfolioImport
      parentRoute: typeof rootRoute
    }
    '/demo/tanstack-query': {
      id: '/demo/tanstack-query'
      path: '/demo/tanstack-query'
      fullPath: '/demo/tanstack-query'
      preLoaderRoute: typeof DemoTanstackQueryImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/marketplace': typeof MarketplaceRoute
  '/portfolio': typeof PortfolioRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/marketplace': typeof MarketplaceRoute
  '/portfolio': typeof PortfolioRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/marketplace': typeof MarketplaceRoute
  '/portfolio': typeof PortfolioRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/marketplace' | '/portfolio' | '/demo/tanstack-query'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/marketplace' | '/portfolio' | '/demo/tanstack-query'
  id: '__root__' | '/' | '/marketplace' | '/portfolio' | '/demo/tanstack-query'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  MarketplaceRoute: typeof MarketplaceRoute
  PortfolioRoute: typeof PortfolioRoute
  DemoTanstackQueryRoute: typeof DemoTanstackQueryRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  MarketplaceRoute: MarketplaceRoute,
  PortfolioRoute: PortfolioRoute,
  DemoTanstackQueryRoute: DemoTanstackQueryRoute,
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
        "/marketplace",
        "/portfolio",
        "/demo/tanstack-query"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/marketplace": {
      "filePath": "marketplace.tsx"
    },
    "/portfolio": {
      "filePath": "portfolio.tsx"
    },
    "/demo/tanstack-query": {
      "filePath": "demo.tanstack-query.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
