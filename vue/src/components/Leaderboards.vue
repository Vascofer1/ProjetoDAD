<template>
  <div class="leaderboards">
    <h1 class="font-bold">Leaderboards</h1>
    <div>
      <button @click="goToGlobalLeaderboard">Global Leaderboard</button>
      <br>
      <button @click="goToPersonalLeaderboard">Personal Leaderboard</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "leaderboards",
  methods: {
    goToGlobalLeaderboard() {
      this.$router.push("/leaderboard/global");
    },
    goToPersonalLeaderboard() {
      this.$router.push("/leaderboard/personal");
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
  background-color: #c8c8c8;
  width: 200px; /* Set a fixed width for the buttons */
}

button:hover {
  background-color: #b7b6b6;
}
</style>