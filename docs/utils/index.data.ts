import { defineLoader } from 'vitepress'
import { discoverUtilities } from '../.vitepress/utilities'

export default defineLoader({
  async load() {
    return (await discoverUtilities()).filter(utility => utility.category === 'predicates')
  },
})
