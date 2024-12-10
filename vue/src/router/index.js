import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import LoginPage from '@/components/LoginPage.vue'
import Profile from '@/components/users/Profile.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Register from '@/components/users/Register.vue'
import RemoveUser from '@/components/users/RemoveUser.vue'
import TransactionCreate from '@/components/transactions/TransactionCreate.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import TransactionRead from '@/components/transactions/TransactionRead.vue'

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
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/users/me',
      name: 'profile',
      component: Profile
    },
    {
      path: '/users/register',
      name: 'register',
      component: Register
    },
    {
      path: '/users/remove',
      name: 'remove account',
      component: RemoveUser
    },
    {
      path: '/transactions/create',
      name: 'create transaction',
      component: TransactionCreate
    },
    {
      path: '/transactions/:id',
      name: 'show transaction',
      component: TransactionRead,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions
    }
  ]
});

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }
  // routes "profile" and "RemoveUser" are only accessible when user is logged in 
  if (((to.name == 'profile') || (to.name == 'RemoveUser') || (to.name == 'create transaction') || (to.name == 'transactions')) && (!storeAuth.user)) {
    next({ name: 'login' })
    return
  }
  // all other routes are accessible to everyone, including anonymous users 
  next()
})

export default router
