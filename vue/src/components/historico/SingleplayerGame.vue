<template>
    <div class="game">
      <p><strong>Game DateTime:</strong> {{ game.began_at }}</p>
      <p><strong>Board ID:</strong> {{ game.board_id }}</p>
      <p><strong>Status:</strong> {{ game.status }}</p>
      <p><strong>Time:</strong> {{ game.total_time }} seconds</p>
      <p><strong>Turns:</strong> {{ game.total_turns_winner }} turns</p>
    </div>
</template>
  
  <script>
  export default {
    props: {
      game: {
        type: Object,
        required: true
      }
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
  