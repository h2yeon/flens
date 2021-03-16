import Vue from 'vue'
import Router from 'vue-router'
import Topology from '@/components/Topology'

Vue.use(Router)

export default new Router({
  routes: [ 
    {
        path: '/',
        name: 'Topology',
        component: Topology
    }
  ]
})
