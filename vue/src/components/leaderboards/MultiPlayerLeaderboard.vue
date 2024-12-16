<template>
    <table>
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="(col, colIndex) in columns" :key="colIndex">
            {{ item[col.field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      },
      columns: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  thead {
    background-color: #f4f4f4;
  }
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  </style>
  