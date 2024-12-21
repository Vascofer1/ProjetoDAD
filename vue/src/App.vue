<script setup>
import { useTemplateRef, provide, onMounted, ref, inject } from 'vue'
import Toaster from './components/ui/toast/Toaster.vue';
import { useAuthStore } from '@/stores/auth';
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue';
import { useAudioStore } from './stores/audio';
import GlobalInputDialog from './components/common/GlobalInputDialog.vue';
import { useChatStore } from '@/stores/chat';

const alertDialog = useTemplateRef('alert-dialog');
provide('alertDialog', alertDialog);

const inputDialog = useTemplateRef('input-dialog')
provide('inputDialog', inputDialog)

const socket = inject('socket')
const storeAuth = useAuthStore();
const audioStore = useAudioStore();
const storeChat = useChatStore()

const logoutConfirmed = () => {
  storeAuth.logout();
  audioStore.stopBackgroundMusic();
};

const logout = () => {
  alertDialog.value.open(logoutConfirmed,
    'Logout confirmation?', 'Cancel', `Yes, I want to log out`,
    `Are you sure you want to log out? You can still access your account later with 
  your credentials.`)
}

let userDestination = null
socket.on('privateMessage', (messageObj) => {
  userDestination = messageObj.user
  inputDialog.value.open(
    handleMessageFromInputDialog,
    'Message from ' + messageObj.user.name,
    `This is a private message sent by ${messageObj?.user?.name}!`,
    'Reply Message', '',
    'Close', 'Reply',
    messageObj.message
  )
})
const handleMessageFromInputDialog = (message) => {
  storeChat.sendPrivateMessageToUser(userDestination, message)
}

const toggleMute = () => {
  audioStore.toggleMute();
}

</script>

<template>
  <Toaster />
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
    <header class="bg-white shadow-md">
      <GlobalInputDialog ref="input-dialog"></GlobalInputDialog>
      <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex items-center justify-between h-16">
              <!-- Left & Middle Navigation -->
              <div class="flex items-center space-x-8">
                <!-- Common Pages -->
                <RouterLink v-show="storeAuth.user" :to="{ name: 'transactions' }" class="nav-link"
                  active-class="active-link">
                  Transaction History
                </RouterLink>

                <!-- Admin Links -->
                <RouterLink v-show="storeAuth.user && storeAuth.user.type === 'A'" :to="{ name: 'users' }"
                  class="nav-link" active-class="active-link">
                  Users
                </RouterLink>

                <!-- Player/Global Leaderboards -->
                <RouterLink v-if="storeAuth.userType === 'P'" to="/leaderboards" class="nav-link"
                  active-class="active-link">
                  Leaderboards
                </RouterLink>
                <RouterLink v-if="storeAuth.userType !== 'P'" to="/leaderboard/global" class="nav-link"
                  active-class="active-link">
                  Global Leaderboards
                </RouterLink>

                <template v-if="storeAuth.userType === 'P'">

                  <RouterLink v-show="storeAuth.user" to="/historico" class="nav-link" active-class="active-link">
                    Game History
                  </RouterLink>
                </template>
                <template v-if="storeAuth.userType === 'A'">
                  <RouterLink to="/historico/all" class="nav-link" active-class="active-link">
                    All Games History
                  </RouterLink>
                </template>

                <RouterLink to="/single-player" class="nav-link" active-class="active-link">
                  Single Player
                </RouterLink>

                <RouterLink to="/chat" class="nav-link" active-class="active-link">
                  Chat room
                </RouterLink>

                <RouterLink :to="{ name: 'statistics' }" class="nav-link" active-class="active-link">
                  Statistics
                </RouterLink>

                <!-- Player Links -->
                <template v-if="storeAuth.userType === 'P'">
                  <p class="font-semibold text-gray-800">
                    Coins: {{ storeAuth.userCoins }}
                  </p>
                  <RouterLink :to="{ name: 'create transaction' }" class="nav-link" active-class="active-link">
                    Buy Coins
                  </RouterLink>
                  <RouterLink to="/multiplayer" class="nav-link" active-class="active-link">
                    MultiPlayer
                  </RouterLink>

                </template>
              </div>

              <!-- Right Navigation -->
              <div class="flex items-center space-x-6">
                <RouterLink v-show="storeAuth.user" :to="{ name: 'profile' }"
                  class="nav-link flex items-center space-x-2">
                  <span class="font-medium">{{ storeAuth.userFirstLastName || ' ' }}</span>
                  <img v-if="storeAuth.userPhotoUrl" class="w-10 h-10 rounded-full" :src="storeAuth.userPhotoUrl"
                    alt="User avatar" />
                </RouterLink>
                <button v-show="storeAuth.user" @click="logout" class="btn-primary">
                  Logout
                </button>
                <RouterLink v-show="!storeAuth.user" :to="{ name: 'login' }">
                  Login
                </RouterLink>
                <button v-show="storeAuth.user" @click="toggleMute" class="nav-link">
                  {{ audioStore.isMuted ? 'Unmute Music' : 'Mute Music' }}
                </button>
              </div>
            </nav>
          </div>
        </header>
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RouterView />
        </main>
      </div>
    </header>
  </div>
</template>

<style scoped>
.nav-link {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: color 0.2s, background-color 0.2s;
  text-align: center;
  /* Add this line */
}

.nav-link:hover {
  color: #2563eb;
  background-color: rgba(37, 99, 235, 0.1);
}

.active-link {
  color: #2563eb;
  font-weight: bold;
}

.btn-primary {
  background-color: rgb(174, 30, 30);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}
</style>