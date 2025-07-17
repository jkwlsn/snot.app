import { createApp } from 'vue'

import App from './App.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteMain from './components/SiteMain.vue'

const app = createApp(App)

app.component('site-header', SiteHeader)
app.component('site-main', SiteMain)

app.mount('#app')

