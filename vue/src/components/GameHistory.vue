<template>
  <div class="history">
    <h1>Game History</h1>
    <div>
      <button @click="goToSingleplayerHistory">Historico singleplayer</button>
      <button @click="goToMultiplayerHistory">Historico multiplayer</button>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';

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
