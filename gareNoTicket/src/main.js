import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


// import {toast} from 'vue3-toastify'



// import Toasted from 'vue-toasted'
// import 'vue-toasted/dist/vue-toasted.min.css';
const app = createApp(App)

app.use(router)
//app.use(toast);
app.mount('#app')
