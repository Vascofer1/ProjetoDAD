<template>
  <div>
    <h2>Best Times</h2>
    <table>
      <thead>
        <tr>
          <th>Board ID</th>
          <th>Best Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tempo in tempos" :key="tempo.board_id">
          <td>{{ tempo.board_id }}</td>
          <td>{{ tempo.best_time }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
  export default {
    props: {
      tempos: Array
    }
  }
  </script>

<style scoped>
.game {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.game p {
  margin: 5px 0;
}

.game strong {
  color: #333;
}
</style>
