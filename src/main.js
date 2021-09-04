import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import Element from 'element-plus'
import './assets/css/theme.scss'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import _ from 'lodash'

const app = createApp(App)
import './assets/icon/iconfont.css'
app
  .provide('_', _)
  .use(store)
  .use(router)
  .use(Element, { locale })
  .mount('#app')
