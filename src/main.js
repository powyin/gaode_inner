import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import store from './store'

createApp(App).use(ElementPlus).use(router).use(store).mount('#app')
