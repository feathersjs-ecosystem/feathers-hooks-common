import DefaultTheme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import type { Theme } from 'vitepress'
import HookTable from './components/HookTable.vue'

import '../style/main.css'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
    app.component('HookTable', HookTable)
  },
} satisfies Theme
