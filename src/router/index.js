import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/UserLogin.vue'
import Register from '../views/UserRegister.vue'
import Home from '../views/HomePage.vue'
import { auth } from '../firebase'
import AdminLogin from '../views/AdminLogin.vue'
import ProductsStocks from '../views/ProductsStocks.vue'

const routes = [
    { path: '/products-stocks', component: ProductsStocks },

    { path: '/admin-login', component: AdminLogin },
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
