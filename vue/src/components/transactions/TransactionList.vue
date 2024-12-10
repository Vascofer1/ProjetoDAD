<script setup>
import Transaction from './Transaction.vue'

const props = defineProps({
    transactions: Array
})
</script>

<template>
    <div class="divide-y divide-solid divide-gray-300 border border-gray-300">
        <Transaction v-for="transaction in props.transactions" :key="transaction" 
                :transaction="transaction" ></Transaction>
    </div>
</template>