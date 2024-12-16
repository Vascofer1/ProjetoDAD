<template>
  <div class="history">
    <h1>Leaderboards</h1>
    <div>
      <button @click="goToSingleplayerHistory">Historico singleplayer</button>
      <button @click="goToMultiplayerHistory">Historico multiplayer</button>
      <button @click="goToAllGameHistory">Historico Todos os Jogos</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "History",
  methods: {
    goToSingleplayerHistory() {
      this.$router.push("/historico/singleplayer");
    },
    goToMultiplayerHistory() {
      this.$router.push("/historico/multiplayer");
    },
    goToAllGameHistory() {
      this.$router.push("/historico/all");
    }
  }
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
