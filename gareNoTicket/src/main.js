import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// import {toast} from 'vue3-toastify'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})
//import {createVuetify} from vuetify

// import Toasted from 'vue-toasted'
// import 'vue-toasted/dist/vue-toasted.min.css';
const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(createPinia())
//app.use(toast);
app.mount('#app')
