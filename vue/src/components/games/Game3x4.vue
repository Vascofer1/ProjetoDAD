<template>
  <div class="game">
    <h1>Tabuleiro 3x4</h1>
    <MemoryBoard :rows="4" :columns="3" :gameId="gameId" :boardId="boardId" />
    <router-link to="/dashboard" class="back-link">Voltar ao Dashboard</router-link>
  </div>
</template>

<script setup>
import MemoryBoard from '../MemoryBoard.vue'; // Componente reutilizável

defineProps({
  gameId: Number,
  boardId: Number,
});

</script>


<style scoped>
.game {
  text-align: center;
  padding: 20px;
}

.back-link {
  display: block;
  margin-top: 20px;
  color: #4caf50;
  text-decoration: none;
  font-size: 18px;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
