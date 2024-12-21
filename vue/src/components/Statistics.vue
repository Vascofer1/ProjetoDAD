<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/games';

const storeAuth = useAuthStore();
const storeGame = useGameStore();

const totalPlayers = computed(() => storeAuth.totalPlayers);
const totalGames = computed(() => storeGame.totalGames);
const gamesLastWeek = computed(() => storeGame.gamesPerWeek);
const gamesLastMonth = computed(() => storeGame.gamesLastMonth);

// Fetch data on component mount
onMounted(async () => {
  await storeAuth.fetchUsers();
  await storeGame.fetchGames();
  await storeGame.fetchGamesLastWeek();
  await storeGame.fetchGamesLastMonth();
});
</script>

<template>
  <div>
    <h1>Statistics</h1>
    <p>&nbsp;&nbsp;&nbsp; Total number of players: {{ totalPlayers }}</p>
    <br>
    <p>&nbsp;&nbsp;&nbsp; Total number of games: {{ totalGames }}</p>
    <br>
    <p>&nbsp;&nbsp;&nbsp; Total number of games played last week: {{ gamesLastWeek }}</p>
    <br>
    <p>&nbsp;&nbsp;&nbsp; Total number of games played last month: {{ gamesLastMonth }}</p>
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;<RouterLink v-show="storeAuth.userType == 'A'" :to="{ name: 'graphics' }" class="text-blue-600 font-semibold">View detailed statistics</RouterLink>
  </div>
</template>

<style scoped>
h1 {
  color: #141414;
  font-weight: bold;
}

p {
  font-size: 16px;
  color: #1e1e1e;
}
</style>
