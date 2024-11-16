import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import '@/assets/base.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')

