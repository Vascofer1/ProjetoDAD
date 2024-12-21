<script setup>
import { computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/games';

const storeGame = useGameStore();
const gamesPerMonth = computed(() => storeGame.gamesPerMonth);
const gamesPerType = computed(() => storeGame.gamesPerType);

const drawBarChart = (data, labels) => {
    const canvas = document.getElementById('gamesChart');
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const barWidth = (canvasWidth - 50) / data.length - 10;
    const maxDataValue = Math.max(...data);
    const scale = (canvasHeight - 80) / maxDataValue; // Adjusted scale to account for more padding

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Bar style
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#2196F3'); // Light blue
    gradient.addColorStop(1, '#0D47A1'); // Dark blue

    // Config styles
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';

    // Axes and grid
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
        const y = canvasHeight - i * (canvasHeight - 50) / 5;
        ctx.moveTo(50, y);
        ctx.lineTo(canvasWidth, y);

        ctx.fillStyle = i === 0 ? '#000' : '#666'; // Highlight for "0"
        ctx.fillText((maxDataValue / 5 * i).toFixed(0), 30, y + (i === 0 ? -2 : 5)); // Adjust "0"
    }
    ctx.stroke();

    // Draw bars
    data.forEach((value, index) => {
        const x = 50 + index * (barWidth + 10);
        const barHeight = value * scale;
        const y = canvasHeight - barHeight;

        // Shadow for bars
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(x + 3, y + 3, barWidth, barHeight);

        // Bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Labels
        ctx.fillStyle = '#000';
        ctx.fillText(value, x + barWidth / 2, y - 10); // Value above bar

        ctx.fillStyle = '#fff';
        ctx.fillText(labels[index], x + barWidth / 2, canvasHeight - 5); // Month label
    });
};



const drawPieChart = (data, labels) => {
    const canvas = document.getElementById('gamesPieChart');
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    // Dimensões fixas para o canvas
    canvas.width = 600;
    canvas.height = 300;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Centraliza o gráfico no canvas, mas considerando um gráfico maior
    const centerX = canvasWidth / 2; // Centro horizontal
    const centerY = canvasHeight / 2; // Centro vertical
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - 40; // Aumenta o raio do gráfico

    // Total de valores nos dados
    const total = data.reduce((sum, value) => sum + value, 0);

    // Inicia o ângulo do gráfico
    let startAngle = 0;

    // Paleta de cores
    const colors = ['#2196F3', '#0D47A1'];

    // Desenhar o gráfico circular
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Posicionar os rótulos do gráfico
        const middleAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(middleAngle) * (radius + 20);
        const labelY = centerY + Math.sin(middleAngle) * (radius + 20);
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], labelX, labelY);

        startAngle += sliceAngle;
    });

    // Adicionar a legenda ao lado
    const legendLabels = ["Single-player", "Multiplayer"];
    const legendX = canvasWidth - 150; // Aumentei esse valor para mover a legenda mais para a direita
    let legendY = centerY - (legendLabels.length * 25) / 2; // Centralizado verticalmente

    legendLabels.forEach((label, index) => {
        // Quadrado colorido da legenda
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(legendX, legendY, 20, 20);

        // Texto da legenda
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, legendX + 30, legendY + 16); // Texto ao lado do quadrado

        legendY += 30; // Espaçamento entre os itens da legenda
    });
};



// Fetch data and draw chart on component mount
onMounted(async () => {
    await storeGame.fetchGamesPerMonth();
    await storeGame.fetchGamesPerType();

    // Prepare data for the chart
    const data = gamesPerMonth.value.map(item => item.gamesCount);
    const labels = gamesPerMonth.value.map(item => item.month);
    const data2 = gamesPerType.value.map(item => item.gamesCount);
    const labels2 = gamesPerType.value.map(item => item.type);

    // Draw the chart
    drawBarChart(data, labels);
    // Draw the pie chart
    drawPieChart(data2, labels2);
});
</script>

<template>
    <div>
      <h1 style="text-align: center; color: #141414; font-weight: bold;">Detailed Statistics</h1>
      <br>
      <div class="charts-container">
        <div class="chart-item">
          <h2>Games Played Over the Last 6 Months</h2>
          <canvas id="gamesChart" width="600" height="300" style="border:1px solid #ccc;"></canvas>
        </div>
        <div class="chart-item">
          <h2>Total Games Played by Type</h2>
          <canvas id="gamesPieChart" width="400" height="400" style="border:1px solid #ccc;"></canvas>
            <p v-for="(item, index) in gamesPerType" :key="index">
            {{ item.type === 'S' ? 'Single-player' : 'Multiplayer' }}: {{ item.gamesCount }} games
            </p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Contêiner dos gráficos */
  .charts-container {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  /* Item dos gráficos */
  .chart-item {
    width: 48%; /* Gráfico da esquerda ocupa 48% e o da direita fica um pouco mais estreito */
    text-align: center;
  }
  
  /* Títulos dos gráficos */
  h1 {
    text-align: center;
    color: #141414;
    font-weight: bold;
  }
  
  h2 {
    color: #000;
    font-weight: bold;
  }
  
  /* Responsividade */
  @media (max-width: 800px) {
    .chart-item {
      width: 100%; /* Gráficos ocupam 100% da largura em telas pequenas */
      margin-bottom: 20px; /* Espaço entre os gráficos */
    }
  }
  </style>
