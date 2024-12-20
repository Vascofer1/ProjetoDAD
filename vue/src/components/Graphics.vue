<script setup>
import { computed, onMounted } from 'vue';
import { useGameStore } from '@/stores/games';

const storeGame = useGameStore();
const gamesPerMonth = computed(() => storeGame.gamesPerMonth);

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

// Fetch data and draw chart on component mount
onMounted(async () => {
  await storeGame.fetchGamesPerMonth();

  // Prepare data for the chart
  const data = gamesPerMonth.value.map(item => item.gamesCount);
  const labels = gamesPerMonth.value.map(item => item.month);

  // Draw the chart
  drawBarChart(data, labels);
});
</script>

<template>
  <div>
    <h1>Detailed Statistics</h1>
    <br>
    <div>
      <h2 style="text-align: center; color: #000; font-weight: bold;">Games Played Over the Last 6 Months</h2>
      <br>
      <canvas id="gamesChart" width="600" height="300"
        style="border:1px solid #ccc; display: block; margin: 0 auto;"></canvas>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #141414;
  font-weight: bold;
}

p {
  font-size: 16px;
  color: #1e1e1e;
}
</style>
