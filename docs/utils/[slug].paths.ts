import path from 'node:path'
import { discoverUtilities } from '../.vitepress/utilities'
import { defineRoutes } from 'vitepress'

export default defineRoutes({
  async paths() {
    const utilities = (await discoverUtilities()).filter(utility => utility.category === 'utils')

    return utilities.map(utility => ({
      params: { slug: utility.slug },
      content: utility.content,
    }))
  },
  watch: [path.resolve(import.meta.dirname, '../../src/utils/**/*.md')],
})
