<template>
    <div class="games-list">
      <h1>All Games</h1>
      <table v-if="games.length">
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Game Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(game, index) in games" :key="index">
            <td>
              {{ game.id }}
            </td>
            <td>
              <button @click="viewDetails(game)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No games found.</p>

      <!-- Pagination Controls -->
      <div v-if="pagination">
        <button @click="fetchGames(pagination.prev_page_url)" :disabled="!pagination.prev_page_url">Previous</button>
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button @click="fetchGames(pagination.next_page_url)" :disabled="!pagination.next_page_url">Next</button>
      </div>
  
      <GameDetailsModal 
        v-if="selectedGame" 
        :game="selectedGame" 
        @close="selectedGame = null" 
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import GameDetailsModal from "./GameDetailsModal.vue";
  
  export default {
    components: {
      GameDetailsModal,
    },
    setup() {
      const games = ref([]);
      const selectedGame = ref(null);
      const pagination = ref(null);
  
      const fetchGames = async (url = "/historico/all") => {
        try {
          const response = await axios.get(url);
          // Map games into a readable format
          games.value = response.data.data.map((game) => ({
            id: game.id,
            winner: game.winner_user_id,
            creator: game.created_user_id,
            boardSize: `${game.board_cols}x${game.board_rows}`,
            type: game.type === "S" ? "Singleplayer" : "Multiplayer",
            beganAt: game.began_at,
            totalTime: game.total_time,
            totalTurns: game.total_turns_winner,
          }));

          pagination.value = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          prev_page_url: response.data.prev_page_url,
          next_page_url: response.data.next_page_url,
        };

        } catch (error) {
          console.error("Error fetching games:", error.message);
        }
      };
  
      const viewDetails = (game) => {
        selectedGame.value = game;
      };
  
      onMounted(() => {
        fetchGames();
      });
  
      return {
        games,
        selectedGame,
        pagination,
        viewDetails,
        fetchGames,
      };
    },
  };
  </script>
  
  <style scoped>
  .games-list {
    padding: 20px;
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
  