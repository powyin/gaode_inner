import { createRouter, createWebHashHistory } from 'vue-router'
import Mapview from "../views/Mapview"
import MapSelectLocation from "../views/MapSelectLocation"
import mapServer from "../views/mapServer"
const routes = [
  { name: 'main', path: '/main', component: Mapview },
  { name: 'home', path: '/', component: Mapview },
  { name: 'mapselectlocation', path: '/mapselectlocation', component: MapSelectLocation },
  { name: 'mapserve', path: '/mapserve', component: mapServer },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
