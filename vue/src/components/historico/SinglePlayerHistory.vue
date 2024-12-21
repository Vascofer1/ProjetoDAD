<template>
    <div class="game-history">
        <h1>My Singleplayer Games</h1>

        <div v-if="games.length">
      <SingleplayerGame v-for="game in games" :key="game.id" :game="game" />
    </div>

    <p v-else>No games found.</p>
    </div>

    <!-- Pagination Controls -->
    <div v-if="pagination">
        <button @click="fetchGames(pagination.prev_page_url)" :disabled="!pagination.prev_page_url">Previous</button>
        <span>Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button @click="fetchGames(pagination.next_page_url)" :disabled="!pagination.next_page_url">Next</button>
      </div>

</template>
  
  
<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import SingleplayerGame from './SingleplayerGame.vue';

export default {
  components: {
    SingleplayerGame // Register the Game component locally
  },
  setup(){
    //const authStore = useAuthStore();
    const games = ref([]); 
    const pagination = ref(null);


    const fetchGames = async (url = "/historico/singleplayer") => {
      try {
        const response = await axios.get(url)
        games.value = response.data.data;

        pagination.value = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          prev_page_url: response.data.prev_page_url,
          next_page_url: response.data.next_page_url,
        };

      } catch (error) {
        console.error('Error fetching games:', error.message);
      
      
      
      }
    }

    onMounted(() => {
      fetchGames();
    });

    return {
      games,
      pagination,
      fetchGames,
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
  