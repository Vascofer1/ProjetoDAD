<template>
    <div class="personal-leaderboard">
      <h1 class="font-bold">Personal Leaderboard</h1>
  

      <!-- Singleplayer-->
      <div v-if="singlePlayer.length">
      <SinglePlayerLeaderboard
        :data="singlePlayer"
        :columns="singlePlayerColumns"
      />
    </div>
    <p v-else>No games found.</p>
  
    
      <!-- Multiplayer Section -->
    <div v-if="multiPlayer">
      <MultiPlayerLeaderboard
        :data="[multiPlayer]" 
        :columns="multiPlayerColumns"
      />
    </div>
    <p v-else>No multiplayer games found.</p>

    </div>


     
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import SinglePlayerLeaderboard from './SinglePlayerLeaderboard.vue';
  import MultiPlayerLeaderboard from './MultiPlayerLeaderboard.vue';
  
  export default {
    components: { SinglePlayerLeaderboard, MultiPlayerLeaderboard },
    setup() {
      const singlePlayer = ref([]);
      const singlePlayerColumns = [
      { label: 'Board Size', field: 'boardSize' },
      { label: 'Best Time', field: 'bestTime' },
      { label: 'Minimum Turns', field: 'minimumTurns' },
    ];

      const multiPlayer = ref(null);
      const multiPlayerColumns = [
      { label: 'Total Victories', field: 'totalVictories' },
      { label: 'Total Losses', field: 'totalLosses' }
    ];
  
      const fetchPersonalLeaderboard = async () => {
        try {
          const response = await axios.get('/leaderboard/personal');
          const data = response.data;
  
          console.log('Fetched Personal Leaderboard Data:', data);
  
          // Map single_player data
          singlePlayer.value = data.single_player.map((item) => ({
            boardSize: `${item.board_cols}x${item.board_rows}`,
            bestTime: item.best_time,
            minimumTurns: item.min_turns,
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
      singlePlayerColumns,
      multiPlayer,
      multiPlayerColumns,
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
  