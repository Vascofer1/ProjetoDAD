<template>
    <div class="game-history">
        <h1>My Singleplayer Games</h1>

        <div v-if="games.length">
      <SingleplayerGame v-for="game in games" :key="game.id" :game="game" />
    </div>

    <p v-else>No games found.</p>
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


    const fetchGames = async () => {
      try {
        const response = await axios.get('/user/singleplayer')
        games.value = response.data;
      } catch (error) {
        console.error('Error fetching games:', error.message);
      }
    }

    onMounted(() => {
      fetchGames();
    });

    return {
      games,
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
  