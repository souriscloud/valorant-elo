import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/elo',
    name: 'Elo',
    component: () => import(/* webpackChunkName: "elo" */ '../views/Elo.vue')
  },
  {
    path: '/shared/:id',
    name: 'Shared',
    component: () => import(/* webpackChunkName: "sharedelo" */ '../views/Shared.vue')
  }
]

const router = new VueRouter({
  routes
})

router.afterEach((to, from) => {
  store.dispatch('fetchLastCommit')
})

export default router
