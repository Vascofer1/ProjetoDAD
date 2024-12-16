<template>
  <div class="history">
    <h1>Game History</h1>
    <div>
      <button @click="goToSingleplayerHistory">Historico singleplayer</button>
      <button @click="goToMultiplayerHistory">Historico multiplayer</button>
      <button v-show="userType === 'A'" @click="goToAllGamesHistory">Historico Todos os Jogos</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import router from '@/router';

    const authStore = useAuthStore(); // Access the auth store
    const userType = authStore.userType; // Get the userType (e.g., "A" for admin)

    const goToAllGamesHistory = () => {
      router.push("/historico/all");
    };

    const goToSingleplayerHistory = () => {
      router.push("/historico/singleplayer");
    };

    const goToMultiplayerHistory = () => {
      router.push("/historico/multiplayer");
    };

</script>

<style scoped>
.leaderboards {
  padding: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
}
</style>
