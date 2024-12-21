<template>
  <div class="history">
    <h1 class="font-bold">Game History</h1>
    <div>
      <button @click="goToSingleplayerHistory">My single-player history</button>
      <br>
      <button @click="goToMultiplayerHistory">My multiplayer history</button>
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
.history {
  padding: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  background-color: #c8c8c8;
  width: 220px; /* Increase the width of the buttons */
}

button:hover {
  background-color: #b7b6b6;
}
</style>
