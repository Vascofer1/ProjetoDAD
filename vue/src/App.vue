<script setup>
import { useTemplateRef, provide } from 'vue'
import Toaster from './components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'


const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const storeAuth = useAuthStore()

const logoutConfirmed = () => {
  storeAuth.logout()
}
const logout = () => {
  alertDialog.value.open(logoutConfirmed,
    'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with 
  your credentials.`)
} 
</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-start h-16 space-x-8">
          <RouterLink to="/"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Home
          </RouterLink>
          <RouterLink to="/testers/laravel"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Laravel Tester
          </RouterLink>
          <RouterLink to="/testers/websocket"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            WebSockets Tester
          </RouterLink>
          <RouterLink v-show="storeAuth.user" :to="{ name: 'profile' }"
            class="flex justify-between text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
              {{ storeAuth.userFirstLastName ? storeAuth.userFirstLastName : ' ' }}
              <img v-if="storeAuth.user" class="w-14 h-14 rounded-full" :src="storeAuth.userPhotoUrl"
                alt="Rounded avatar">
          </RouterLink>
          <RouterLink v-show="!storeAuth.user" :to="{ name: 'login' }"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Login
          </RouterLink>
          <button v-show="storeAuth.user" @click="logout" class="w-24 h-10 leading-10 text-center rounded-t-xl 
              border-none  text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500">
            Logout
          </button>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>