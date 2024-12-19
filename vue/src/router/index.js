import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import NewAdmin from '@/components/users/NewAdmin.vue'
import UserList from '@/components/users/UserList.vue'
import LoginPage from '@/components/LoginPage.vue'
import Profile from '@/components/users/Profile.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import Dashboard from '../components/Dashboard.vue';
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Register from '@/components/users/Register.vue'
import RemoveUser from '@/components/users/RemoveUser.vue'
import TransactionCreate from '@/components/transactions/TransactionCreate.vue'
import Transactions from '@/components/transactions/Transactions.vue'
import TransactionRead from '@/components/transactions/TransactionRead.vue'
import UserUpdate from '@/components/users/UserUpdate.vue'
import User from '@/components/users/User.vue'
import Users from '@/components/users/Users.vue'
import Game3x4 from '../components/games/Game3x4.vue';
import Game4x4 from '../components/games/Game4x4.vue';
import Game6x6 from '../components/games/Game6x6.vue';
import MemoryBoard from '@/components/MemoryBoard.vue';
import GamePersonalizado from '@/components/games/GamePersonalizado.vue'

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
    },
    {
      path: '/users/:id',
      name: 'updateUser',
      component: UserUpdate,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {path: '/admin', name: 'admin', component: NewAdmin},
    {path: '/users', name: 'users', component: Users},
    
    { path: '/dashboard',
      name: 'dashboard',
      component: Dashboard ,
      meta: { requiresAuth: true },
    },
    
    {
      path: '/games/:gameId/:boardId',
      name: 'game3x4',
      component: Game3x4,
      props: true, // Isso permite que o Vue Router passe os parâmetros como props para o componente
    },
    {
      path: '/games/:gameId/:boardId',
      name: 'game4x4',
      component: Game4x4,
      props: true, // Isso permite que o Vue Router passe os parâmetros como props para o componente
    },
    {
      path: '/games/:gameId/:boardId',
      name: 'game6x6',
      component: Game6x6,
      props: true, // Isso permite que o Vue Router passe os parâmetros como props para o componente
    },
    {
      path: '/games/:gameId/:boardId/:rows/:columns',
      name: 'gamePersonalizado',
      component: GamePersonalizado,
      props: true, 
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
  if (((to.name == 'profile') || (to.name == 'RemoveUser') || (to.name == 'create transaction') || (to.name == 'transactions') || (to.name == 'dashboard')) && (!storeAuth.user)) {
    next({ name: 'login' })
    return
  }
  // all other routes are accessible to everyone, including anonymous users 
  next()
})



export default router
