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
    component: Home,
    meta: {
      title: 'RangersNet'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: 'About'
    }
  },
  {
    path: '/general-management',
    component: GeneralManagement,
    meta: {
      title: 'General'
    },
    children: [
      {
        path: 'roster',
        component: Roster,
        meta: {
          title: 'General | Roster'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
