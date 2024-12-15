<template>
    <div class="personal-leaderboard">
      <h1>Personal Leaderboard</h1>
  
      <!-- Single Player Section -->
      <div v-if="singlePlayer.length">
        <h2>Single Player Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Board Size</th>
              <th>Best Time</th>
              <th>Minimum Turns</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in singlePlayer" :key="index">
              <td>{{ item.boardSize }}</td>
              <td>{{ item.bestTime }}</td>
              <td>{{ item.minTurns }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No single-player data available.</p>
  
      <!-- Multiplayer Section -->
      <div v-if="multiPlayer">
        <h2>Multiplayer Stats</h2>
        <table>
          <thead>
            <tr>
              <th>Total Victories</th>
              <th>Total Losses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ multiPlayer.totalVictories }}</td>
              <td>{{ multiPlayer.totalLosses }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else>No multiplayer data available.</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const singlePlayer = ref([]);
      const multiPlayer = ref(null);
  
      const fetchPersonalLeaderboard = async () => {
        try {
          const response = await axios.get('/leaderboard/personal');
          const data = response.data;
  
          console.log('Fetched Personal Leaderboard Data:', data);
  
          // Map single_player data
          singlePlayer.value = data.single_player.map((item) => ({
            boardSize: `${item.board_cols}x${item.board_rows}`,
            bestTime: item.best_time,
            minTurns: item.min_turns,
          }));
  
          // Map multiplayer data
          multiPlayer.value = {
            totalVictories: data.multiplayer.total_victories,
            totalLosses: data.multiplayer.total_losses,
        };
      } catch (error) {
        console.error('Error fetching personal leaderboard data:', error.message);
      }
    };

    onMounted(() => {
      fetchPersonalLeaderboard();
    });

    return {
      singlePlayer,
      multiPlayer,
    };
  },
};
</script>

<style>
.personal-leaderboard {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

thead {
  background-color: #f4f4f4;
}
</style>
  