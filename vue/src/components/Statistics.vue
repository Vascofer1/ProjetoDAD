<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useGameStore } from '@/stores/games';

const storeAuth = useAuthStore();
const storeGame = useGameStore();

// Computed para total de usuários
const totalPlayers = computed(() => storeAuth.totalPlayers);
const totalGames = computed(() => storeGame.totalGames);

// Buscar usuários ao montar o componente
onMounted(async () => {
    await storeAuth.fetchUsers();
    await storeGame.fetchGames();
});
</script>

<template>
  <div>
    <h1>Statistics</h1>
    <p>Número total de jogadores: {{ totalPlayers }}</p>
    <br>
    <p>Número total de jogos: {{ totalGames }}</p>
  </div>

  <!-- GRÁFICO de barras com os jogos nos últimos 12 meses -->
    
</template>