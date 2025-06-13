import type { Plugin } from 'vite'

import { discoverUtilities, type Utility } from '../utilities'
import md from './utility'

export type MarkdownTransformOptions = {
  srcDir?: string
  pattern?: string
  exclude?: string[]
  vitepressDirectory: string
}

export function MarkdownTransform(options: MarkdownTransformOptions): Plugin {
  const {
    srcDir = '../../src',
    pattern = '**/*.md',
    exclude = ['**/node_modules/**', '**/dist/**'],
    vitepressDirectory,
  } = options ?? {}

  let utilitiesList: Utility[] = []

  return {
    name: 'feathers-commons-md-transform',
    enforce: 'pre',
    async buildStart() {
      const result = await discoverUtilities()
      utilitiesList = result
    },
    async transform(code, id) {
      if (!id.match(/\.md\b/)) return null

      const slug = id.replace(vitepressDirectory, '')

      const utility = utilitiesList.find(x => x.pathMd === slug)
      if (!utility) {
        return null
      }

      return md(utility)
    },
    // configureServer(server) {
    //   const watcher = server.watcher

    //   watcher.add(`${srcDir}/**/*.md`)

    //   watcher.on('change', async filePath => {
    //     console.log(`🔄 Utility changed: ${filePath}`)
    //     if (filePath.includes(srcDir) && filePath.endsWith('.md')) {
    //       console.log(`📝 Utility changed: ${filePath}`)
    //       await discoverUtilities(options)

    //       // Invalidate virtual modules
    //       const moduleGraph = server.moduleGraph
    //       const virtualModules = Array.from(moduleGraph.urlToModuleMap.keys()).filter(
    //         url => url.startsWith(VIRTUAL_UTILITY_PREFIX) || url === VIRTUAL_UTILITIES_LIST,
    //       )

    //       virtualModules.forEach(url => {
    //         const module = moduleGraph.getModuleById(url)
    //         if (module) {
    //           server.reloadModule(module)
    //         }
    //       })
    //     }
    //   })

    //   watcher.on('add', async filePath => {
    //     if (filePath.includes(srcDir) && filePath.endsWith('.md')) {
    //       console.log(`➕ New utility: ${filePath}`)
    //       await discoverUtilities(options)
    //     }
    //   })

    //   watcher.on('unlink', async filePath => {
    //     if (filePath.includes(srcDir) && filePath.endsWith('.md')) {
    //       console.log(`➖ Utility removed: ${filePath}`)
    //       await discoverUtilities(options)
    //     }
    //   })
    // },
  }
}
