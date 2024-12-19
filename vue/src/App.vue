<script setup>
import { useTemplateRef, provide, onMounted, ref } from 'vue'
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
        <nav class="flex items-center justify-between h-16">
          <!-- Coluna Esquerda + Meio unidas -->
          <div class="flex items-center space-x-8">
            <!-- Páginas Comuns -->
            <!--<RouterLink to="/" class="nav-link">Home</RouterLink>-->
            <RouterLink v-show="storeAuth.user" :to="{ name: 'transactions' }" class="nav-link">
              Transaction History
            </RouterLink>

            <!-- Admin Links -->
            <RouterLink v-show="storeAuth.user && storeAuth.user.type === 'A'" :to="{ name: 'users' }" class="nav-link">
              Users
            </RouterLink>

            <!-- Leaderboards + Historico -->
            <RouterLink v-show="storeAuth.user" to="/leaderboards"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Leaderboards
            </RouterLink>
            <RouterLink v-show="!storeAuth.user" to="/leaderboard/global"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Leaderboards Globais
            </RouterLink>

            <RouterLink v-show="storeAuth.user" to="/historico"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Game History
            </RouterLink>
            
            <RouterLink :to="{ name: 'statistics' }"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Statistics
            </RouterLink>

            <!-- Player Links -->
            <template v-if="storeAuth.userType === 'P'">
              <b class="text-sm font-medium text-gray-700 whitespace-nowrap">
                Brain coins: {{ storeAuth.userCoins }}
              </b>
              <RouterLink :to="{ name: 'create transaction' }" class="nav-link">
                Buy Coins
              </RouterLink>
              <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
            </template>
          </div>

          <!-- Leaderboards + Historico -->
          <RouterLink v-if="storeAuth.userType == 'P'" to="/leaderboards"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Leaderboards
          </RouterLink>
          <RouterLink v-if="!(storeAuth.userType == 'P')" to="/leaderboard/global"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Leaderboards Globais
          </RouterLink>

          <RouterLink v-if="storeAuth.userType == 'P'" to="/historico"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Game History
          </RouterLink>
          <RouterLink v-if="storeAuth.userType == 'A'" to="/historico/all"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            All Games History
          </RouterLink>


          <!-- Perfil + Logout (direita) -->
          <div class="flex items-center space-x-6">
            <RouterLink v-show="storeAuth.user" :to="{ name: 'profile' }" class="nav-link flex items-center space-x-2">
              <span>{{ storeAuth.userFirstLastName || ' ' }}</span>
              <img v-if="storeAuth.userPhotoUrl" class="w-10 h-10 rounded-full" :src="storeAuth.userPhotoUrl"
                alt="User avatar" />
            </RouterLink>
            <RouterLink v-show="storeAuth.userType == 'P'" :to="{ name: 'remove account' }"
              class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 font-semibold">
              Remove Account
            </RouterLink>
            <button v-show="storeAuth.user" @click="logout" class="logout-btn">
              Logout
            </button>
            <RouterLink v-show="!storeAuth.user" :to="{ name: 'login' }" class="nav-link">
              Login
            </RouterLink>
          </div>

        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-blue-500 transition-colors font-medium text-sm px-3 py-2 rounded-md;
}

.logout-btn {
  @apply bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium px-5 py-2 rounded-md transition-all;
}
</style>
