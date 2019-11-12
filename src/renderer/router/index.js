import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main').default
    },
    {
      path: '/processing',
      name: 'processing',
      component: require('@/components/StepProcessing').default
    },
    {
      path: '/access',
      name: 'access',
      component: require('@/components/StepAccess').default
    },
    {
      path: '/droplets',
      name: 'droplets',
      component: require('@/components/PageDroplets').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
