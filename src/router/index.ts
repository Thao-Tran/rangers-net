import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import GeneralManagement from '@/views/GeneralManagement.vue'
import Roster from '@/views/Roster.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/general-management',
    component: GeneralManagement,
    children: [
      {
        path: 'roster',
        component: Roster
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
