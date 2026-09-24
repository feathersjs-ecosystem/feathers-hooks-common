import { h } from 'vue'
import Theme from 'vitepress/theme'
import SuccessorBanner from './SuccessorBanner.vue'
import '../style/main.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'layout-top': () => h(SuccessorBanner),
    })
  },
}
