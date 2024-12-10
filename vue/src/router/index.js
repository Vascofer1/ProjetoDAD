import HomeComponent from '@/components/HomeComponent.vue'
import LaravelTester from '@/components/LaravelTester.vue'
import LoginPage from '@/components/LoginPage.vue'
import Profile from '@/components/users/Profile.vue'
import WebSocketTester from '@/components/WebSocketTester.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Register from '@/components/users/Register.vue'
import RemoveUser from '@/components/users/RemoveUser.vue'
import MultiPlayerHistory from '@/components/historico/MultiPlayerHistory.vue'
import SinglePlayerHistory from '@/components/historico/SinglePlayerHistory.vue'
import LeaderboardGlobal from '@/components/leaderboards/LeaderboardGlobal.vue'

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
        },
        
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
      path: '/historico/singleplayer',
      name: 'singleplayerHistory',
      component: SinglePlayerHistory,
    },
    {
      path: '/historico/multiplayer',
      name: 'MultiplayerHistory',
      component: MultiPlayerHistory
    },
    {
      path: '/leaderboard',
      name: 'leaderboardGlobal',
      component: LeaderboardGlobal
    },


  ]
});

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    await storeAuth.restoreToken()
  }
  // routes "profile" and "home" are only accessible when user is logged in 
  if (((to.name == 'profile') /*|| (to.name == 'home')*/) && (!storeAuth.user)) {
    next({ name: 'login' })
    return
  }
  // all other routes are accessible to everyone, including anonymous users 
  next()
})

export default router
