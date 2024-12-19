<template>
  <div class="memory-board">
    <header>
      <p><strong>Tempo:</strong> {{ formatTime }}</p>
      <p><strong>Jogadas:</strong> {{ turns }}</p>
    </header>




    <div class="grid" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
      <MemoryCard
        v-for="(card, index) in cards"
        :key="index"
        :card="card"
        @flip="handleFlip(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import MemoryCard from "./MemoryCard.vue"; // Subcomponente para uma carta
import axios from "axios";
import { defineProps } from 'vue';
import router from "@/router";
import { useAudioStore } from '@/stores/audio';

const audioStore = useAudioStore();

const props = defineProps({
  gameId: Number,
  rows: Number,
  columns: Number,
  boardId: Number,
});



console.log("Board ID:", props.boardId);
console.log("Game ID:", props.gameId);
console.log("Rows:", props.rows);
console.log("Columns:", props.columns);



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
async function updateGameEnd(time, turns) {
  try {
    const response = await axios.put(`http://localhost:8085/api/games/${props.gameId}/${props.boardId}`, {
      total_time: time,
      total_turns_winner: turns,
      status:"E",
      ended_at: getCurrentDateTime(),
    });

    console.log('Game updated:', response.data);
  } catch (error) {
    console.error('Error updating game:', error);
  }
}

async function updateGameStart() {
  try {
    const response = await axios.put(`http://localhost:8085/api/games/${props.gameId}/${props.boardId}`, {
      
      began_at: getCurrentDateTime(),
    });

    console.log('Game updated:', response.data);
  } catch (error) {
    console.error('Error updating game:', error);
  }
}




const turns = ref(0);
const cards = ref([]);
const timer = ref(0);
let interval = null;

// Formata o tempo no formato MM:SS
const formatTime = computed(() => {
  const minutes = String(Math.floor(timer.value / 60)).padStart(2, "0");
  const seconds = String(timer.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});

// Inicializa o tabuleiro e as cartas
const initializeGame = () => {
  const totalCards = props.rows * props.columns;
  const totalPairs = totalCards / 2;

  const images = [
    "/images/cards/c1.png", "/images/cards/c2.png", "/images/cards/c3.png",
    "/images/cards/c4.png", "/images/cards/c5.png", "/images/cards/c6.png",
    "/images/cards/c7.png", "/images/cards/c11.png", "/images/cards/c12.png",
    "/images/cards/c13.png", "/images/cards/e1.png", "/images/cards/e2.png",
    "/images/cards/e3.png", "/images/cards/e4.png", "/images/cards/e5.png",
    "/images/cards/e6.png", "/images/cards/e7.png", "/images/cards/e11.png",
  ];

  if (images.length < totalPairs) {
    console.error("Não há imagens suficientes para o tabuleiro!");
    return;
  }

  const selectedImages = images.slice(0, totalPairs);
  const duplicatedImages = [...selectedImages, ...selectedImages];

  cards.value = duplicatedImages
    .sort(() => Math.random() - 0.5)
    .map((image) => ({
      image,
      flipped: false,
      matched: false,
    }));
};

let firstClick = false;

// Lógica para virar a carta e iniciar o timer
const handleFlip = (index) => {
  if (!firstClick) {
    startTimer();
    firstClick = true;
    updateGameStart();
  }

  const card = cards.value[index];
  if (!card.flipped && !card.matched) {
    card.flipped = true;
    checkMatch();
  }
};

// Verifica se houve um par
const checkMatch = () => {
  const flippedCards = cards.value.filter((card) => card.flipped && !card.matched);

  if (flippedCards.length === 2) {
    turns.value++;

    if (flippedCards[0].image === flippedCards[1].image) {
      setTimeout(() => {
        flippedCards.forEach((card) => (card.matched = true));
        if (cards.value.every((card) => card.matched)) {
          audioStore.playVictorySound();
          stopTimer();  
          alert(`Parabéns! Você completou o jogo em ${formatTime.value}!`);
          //-------------------------------------------------------------
          updateGameEnd(timer.value, turns.value);
          
        }
      }, 300);
    } else {
      setTimeout(() => {
        flippedCards.forEach((card) => (card.flipped = false));
      }, 1000);
    }
  }
};


// Inicia o timer
const startTimer = () => {
  interval = setInterval(() => timer.value++, 1000);
};

// Para o timer
const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

onMounted(initializeGame);
onBeforeUnmount(stopTimer);
</script>

<style scoped>
.memory-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

header {
  text-align: center;
  font-size: 18px;
}

.grid {
  display: grid;
  gap: 10px;
}

</style>
