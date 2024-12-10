<script setup>
import { onMounted, ref } from 'vue'
import TransactionList from './TransactionList.vue'
import { useTransactionStore } from '@/stores/transaction'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth';


const storeAuth = useAuthStore()
const storeTransaction = useTransactionStore()
const storeError = useErrorStore()

const isLoading = ref(true);

onMounted(async () => {
    storeError.resetMessages()
    await storeTransaction.fetchTransactions()
    isLoading.value = false;
})
</script>

<template>
    <div class="pt-4">
        <h2 class="pt-8 pb-2 text-2xl">
            Transactions
            <span class="text-base">(Total = {{ storeTransaction.totalTransactions }})</span>
        </h2>
        <div v-if="isLoading">
            <p>Loading transactions...</p>
        </div>
        <div v-else-if="storeTransaction.totalTransactions > 0">
            <TransactionList :transactions="storeTransaction.transactions" />
        </div>
        <div v-else>
            <p>No transactions found.</p>
        </div>
    </div>
</template>