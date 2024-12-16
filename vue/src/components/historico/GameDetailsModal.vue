<template>
    <div class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <h2>Game Details</h2>
        <p><strong>Winner:</strong> {{ game.winner }}</p>
        <p><strong>Created By:</strong> {{ game.creator }}</p>
        <p><strong>Board Size:</strong> {{ game.boardSize }}</p>
        <p><strong>Game Type:</strong> {{ game.type }}</p>
        <p><strong>Began At:</strong> {{ game.beganAt }}</p>
        <p><strong>Total Time:</strong> {{ game.totalTime }}</p>
        <p><strong>Total Turns:</strong> {{ game.totalTurns }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      game: Object,
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 500px;
  }
  
  .close {
    float: right;
    font-size: 20px;
    cursor: pointer;
  }
  </style>
  