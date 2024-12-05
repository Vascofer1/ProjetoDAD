import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import NewAdmin from '@/components/users/NewAdmin.vue'
import NewUser from '@/components/users/NewUser.vue'
import UserList from '@/components/users/UserList.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/testers',
      children: [
        {
          path: 'laravel',
          component: LaravelTester
        },
        {
          path: 'websocket',
          component: WebSocketTester
        }
      ]
    }, 
    {path: '/user', component: NewUser},
    {path: '/admin', component: NewAdmin},
    {path: '/users', name: 'users', component: UserList}
  ]
})



export default router
