import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/',
      redirect: '/home'
    }
  
  ]
})

router.beforeEach((to,from,next)=> {
    if (to.path === '/login') return next();

    const tokenStr = window.sessionStorage.getItem('token');

    if (!tokenStr) return this.a.push('/login')

    next()
})

export default router
