<template>
    <div class="leaderboards">
      <h1>Leaderboards</h1>
      <div>
        <button @click="goToGlobalLeaderboard">Global Leaderboard</button>
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
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
  </style>
  