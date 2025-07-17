import { createApp } from 'vue'

import App from './App.vue'
import SiteHeader from './components/SiteHeader.vue'

const app = createApp(App)

app.component('site-header', SiteHeader)

app.mount('#app')

