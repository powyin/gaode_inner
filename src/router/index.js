import { createRouter, createWebHashHistory } from 'vue-router'
import Mapview from "../views/Mapview"
import MapSelectLocation from "../views/MapSelectLocation"
const routes = [
 // { name: 'main', path: '/main', component: Mapview },
  { name: 'home', path: '/', component: Mapview },
  { name: 'mapselectlocation', path: '/mapselectlocation', component: MapSelectLocation },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
