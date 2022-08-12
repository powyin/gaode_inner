import { createRouter, createWebHashHistory } from 'vue-router'
import Mapview from "../views/Mapview"
const routes = [
  { path: '/main', component: Mapview },
  { path: '/', component: Mapview },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
