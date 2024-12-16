<template>
    <div class="card" :class="{ flipped: card.flipped }" @click="flip">
      <div class="front">
        <img v-if="card.flipped || card.matched" :src="card.image" alt="Card" />
      </div>
      <div class="back">
        <img src="/images/cards/semFace.png" alt="Verso da Carta" />
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    card: { type: Object, required: true },
  });
  
  const emit = defineEmits(["flip"]);
  
  const flip = () => {
    if (!props.card.flipped && !props.card.matched) {
      emit("flip");
    }
  };
  </script>
  
  <style scoped>
  .card {
    width: 100px;
    height: 150px;
    position: relative;
    perspective: 1000px;
    cursor: pointer;
    border-radius: 8px;
  }
  
  .card .front,
  .card .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    transition: transform 0.3s ease;
  }
  
  .card .front {
    transform: rotateY(180deg);
  }
  
  .card .back {
    background-color: #ccc;
  }
  
  .card.flipped .front {
    transform: rotateY(0);
  }
  
  .card.flipped .back {
    transform: rotateY(180deg);
  }
  </style>
  