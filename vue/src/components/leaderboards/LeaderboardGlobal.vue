<template>
    <div class="game-history">

        <div v-if="melhoresTempos.length">
            <MelhorTempo :tempos="melhoresTempos" />
        </div>
        <p v-else>No games found.</p>

        <div v-if="menoresMoves.length">
                <LeastMoves  :moves="menoresMoves" />
            </div>
        <p v-else>No games found.</p>
    </div>

</template>
  
  
<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import MelhorTempo from './MelhorTempo.vue';
import LeastMoves from './LeastMoves.vue';

export default {
  components: {
    MelhorTempo, // Register the Game component locally
    LeastMoves
  },
  setup(){
    //const authStore = useAuthStore();
    const dados = ref([]);
    const melhoresTempos = ref([]);
    const menoresMoves = ref([]);


    const fetchGames = async () => {
      try {
        const response = await axios.get('/leaderboard')
        dados.value = response.data;

        melhoresTempos.value = dados.value[0];
        menoresMoves.value = dados.value[1];

      } catch (error) {
        console.error('Error fetching games:', error.message);
      }
    }

    onMounted(() => {
      fetchGames();
    });

    return {
      melhoresTempos, menoresMoves
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
  