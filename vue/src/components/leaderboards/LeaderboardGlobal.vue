<template>
    <div class="game-history">

      <div v-if="singlePlayer.length">
      <SinglePlayerLeaderboard
        :data="singlePlayer"
        :columns="singlePlayerColumns"
      />
    </div>
    <p v-else>No games found.</p>


    
    <div v-if="multiPlayer.length">
      <MultiPlayerLeaderboard
        :data="multiPlayer"
        :columns="multiPlayerColumns"
      />
    </div>
    <p v-else>No multiplayer games found.</p>


    </div>

</template>
  
  
<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import SinglePlayerLeaderboard from './SinglePlayerLeaderboard.vue';
import MultiPlayerLeaderboard from './MultiPlayerLeaderboard.vue';

export default {

  components: { SinglePlayerLeaderboard, MultiPlayerLeaderboard },
  setup(){
    //const authStore = useAuthStore();

    const dados = ref([]);
    const singlePlayer = ref([]);
    const singlePlayerColumns = [
      { label: 'Board Size', field: 'boardSize' },
      { label: 'Best Time', field: 'bestTime' },
      { label: 'Best Time Holder', field: 'bestTimePlayer' },
      { label: 'Minimum Turns', field: 'minimumTurns' },
      { label: 'Minimum Turns Holder', field: 'minimumTurnsPlayer' }
    ];


    const multiPlayer = ref([]);
    const multiPlayerColumns = [
      { label: 'Username', field: 'username' },
      { label: 'Total Victories', field: 'totalVictories' }
    ];

    const fetchGames = async () => {
      try {
        const response = await axios.get('/leaderboard/global')
        dados.value = response.data;
        console.log(dados.value)

        singlePlayer.value = dados.value.single_player.map((item) => ({
          boardSize: `${item.board_cols}x${item.board_rows}`,
          bestTime: item.best_time,
          bestTimePlayer: item.best_time_player,
          minimumTurns: item.minimum_turns,
          minimumTurnsPlayer: item.minimum_turns_player
        }));

        // Map multiplayer data
        multiPlayer.value = dados.value.multiplayer.map((item) => ({
          username: item.user_id,
          totalVictories: item.total_victories,
        }));


        console.log(singlePlayer.value)
      } catch (error) {
        console.error('Error fetching games:', error.message);
      }
    }

    onMounted(() => {
      fetchGames();
    });

    return {
      singlePlayer, singlePlayerColumns, multiPlayer, multiPlayerColumns
    };
    }
    }
</script>

  
  <style>
  .game-history {
    padding: 20px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  table, th, td {
    border: 1px solid #ddd;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
  }
  
  thead {
    background-color: #f4f4f4;
  }
  </style>
  