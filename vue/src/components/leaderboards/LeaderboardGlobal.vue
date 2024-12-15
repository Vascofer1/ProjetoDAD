<template>
    <div class="game-history">

      <div>
      <h2>Recordes Globais Single Player</h2>
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
            <td>{{ item.minimumTurns }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div>
      <h2>Most Wins</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Total Victories</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in multiPlayer" :key="index">
            <td>{{ item.username }}</td>
            <td>{{ item.totalVictories }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    </div>

</template>
  
  
<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';


export default {

  setup(){
    //const authStore = useAuthStore();

    const dados = ref([]);
    const singlePlayer = ref([]);
    const multiPlayer = ref([]);

    const fetchGames = async () => {
      try {
        const response = await axios.get('/leaderboard/global')
        dados.value = response.data;
        console.log(dados.value)

        singlePlayer.value = dados.value.single_player.map((item) => ({
          boardSize: `${item.board_cols}x${item.board_rows}`,
          bestTime: item.best_time,
          minimumTurns: item.minimum_turns,
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
      singlePlayer, multiPlayer
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
  