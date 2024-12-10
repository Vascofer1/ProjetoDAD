<template>
    <div>
      <h2>Least Moves</h2>
      <table>
        <thead>
          <tr>
            <th>Board ID</th>
            <th>Least Moves</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="move in moves" :key="move.board_id">
            <td>{{ move.board_id }}</td>
            <td>{{ move.least_moves }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      moves: Array
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
