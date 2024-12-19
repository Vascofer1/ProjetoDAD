<template>
  <div class="dashboard">
    <h2 class="subtitle">MODOS DE JOGO</h2>
    <h1>Escolha um tabuleiro para jogar</h1>
    <br />
    <div class="buttons">
      <button @click="createGame(1)">Jogar Tabuleiro 3x4</button>
      <button @click="createGame(2)" :disabled="!canPlay">
        Jogar Tabuleiro 4x4
      </button>
      <button @click="createGame(3)" :disabled="!canPlay">
        Jogar Tabuleiro 6x6
      </button>
      <button @click="createCustomGame(4, rows, columns)" :disabled="!canPlay">
        Jogar Tabuleiro Personalizado
      </button>
      (tamanho max :8x9)
      <label>
        Linhas:
        <input type="number" v-model="rows" min="2" max="9" />
      </label>
      <label>
        Colunas:
        <input type="number" v-model="columns" min="2" max="9" />
      </label>

    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();



import { ref, computed } from 'vue';


import { useAuthStore } from '@/stores/auth'




const userStore = useAuthStore();
const user = ref(null);

// Chame getUser de forma assíncrona, mas sem bloquear
userStore.getUser(user).then(() => {
  const userId = user.value?.id;
  const userCoins = user.value?.coins;
  const type = user.value?.type;
  console.log("User Type:", type);
  console.log("User ID:", userId);
  console.log("User coins:", userCoins);

}).catch((error) => {
  console.error("Erro ao carregar o usuário:", error);
});

const canPlay = computed(() => {
  return user.value?.coins > 0; // Só permite jogar se coins > 0
});

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
//update user coins
async function updateUserCoins(gameId) {
  try {
    // criar transação
    const response = await axios.post(`/transactions`, {
      transaction_datetime: getCurrentDateTime(),
      user_id: user.value.id,
      type: "I",
      brain_coins: -1,
      game_id: gameId,
    });

    console.log("User coins updated:", response.data);
    console.log("User coins balance:", user.value.coins - 1);
  } catch (error) {
    console.error("Error updating user coins:", error);
  }
}

async function createCustomGame(boardId, rows, columns) {
  try {

    const response = await axios.post("/games", {
      created_user_id: user.value.id,
      board_id: boardId,
      type: "S",
      status: "PL",
    });
    // Captura o ID do jogo retornado
    const gameId = response.data.id;
    console.log("Game created with ID:", gameId);


    router.push({ name: "gamePersonalizado", params: { gameId, boardId: boardId, rows, columns } });
    updateUserCoins(gameId);

  } catch (error) {
    console.error("Error creating game:", error);
  }
}

async function createGame(boardId) {
  try {

    const response = await axios.post("/games", {
      created_user_id: user.value.id,
      board_id: boardId,
      type: "S",
      status: "PL",
    });
    // Captura o ID do jogo retornado
    const gameId = response.data.id;
    console.log("Game created with ID:", gameId);

    let routeName = '';
    if (boardId === 1) {
      routeName = 'game3x4';
    } else if (boardId === 2) {
      routeName = 'game4x4';
      updateUserCoins(gameId);
    } else if (boardId === 3) {
      routeName = 'game6x6';
      updateUserCoins(gameId);
    }

    router.push({ name: routeName, params: { gameId, boardId: boardId } });


  } catch (error) {
    console.error("Error creating game:", error);
  }
}

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

.dashboard {
  text-align: center;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease-in-out;
  font-family: "Poppins", sans-serif;
}

h2.subtitle {
  font-size: 1.8rem;
  color: #3c85c8;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
}

h1 {
  font-size: 2.5rem;
  color: #3c85c8;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  width: 220px;
  height: 65px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: linear-gradient(90deg, #69b3f5, #4476f2);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
