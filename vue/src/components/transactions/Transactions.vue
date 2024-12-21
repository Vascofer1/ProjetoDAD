<script setup>
import { onMounted, ref } from 'vue'
import TransactionList from './TransactionList.vue'
import { useTransactionStore } from '@/stores/transaction'
import { useErrorStore } from '@/stores/error'
import TransactionFilterForm from './TransactionFilterForm.vue';


const storeTransaction = useTransactionStore()
const storeError = useErrorStore()

const isLoading = ref(true);

onMounted(async () => {
    storeError.resetMessages()
    await storeTransaction.fetchTransactions(1)
    isLoading.value = false;
})

const updateFilterByType = async (newValue,) => {
    storeTransaction.filterByType = newValue
    await storeTransaction.fetchTransactions(1)
}

const updateFilterById = async (newValue) => {
    storeTransaction.filterById = newValue
    await storeTransaction.fetchTransactions(1)
}

const updatefilterByDateAfter = async (newValue) => {
    storeTransaction.filterByDateAfter = newValue
    await storeTransaction.fetchTransactions(1)
}

const updatefilterByDateBefore = async (newValue) => {
    storeTransaction.filterByDateBefore = newValue
    await storeTransaction.fetchTransactions(1)
}


// Navegar para a página anterior
const previousPage = async () => {
    if (storeTransaction.currentPage > 1) {
        await storeTransaction.fetchTransactions(storeTransaction.currentPage - 1)
    }
}

// Navegar para a próxima página
const nextPage = async () => {
    if (storeTransaction.currentPage < storeTransaction.totalPages) {
        await storeTransaction.fetchTransactions(storeTransaction.currentPage + 1)
    }
}
</script>

<template>
    <div class="pt-4">
        <h2 class="pt-8 pb-2 text-2xl">
            Transactions
            <span class="text-base">(Total = {{ storeTransaction.totalTransactions }})</span>
        </h2>

        <br>

        <TransactionFilterForm :showApplyButton="true" @update:filterByType="updateFilterByType"
            @update:filterById="updateFilterById" @update:filterByDateAfter="updatefilterByDateAfter"
            @update:filterByDateBefore="updatefilterByDateBefore">
        </TransactionFilterForm>
        <br>

        <div v-if="isLoading">
            <p>Loading transactions...</p>
        </div>

        <div v-else-if="storeTransaction.totalTransactions > 0">
            <TransactionList :transactions="storeTransaction.filteredTransactions" />
        </div>
        <div v-else>
            <p>No transactions found.</p>
        </div>

        <br>
        <!-- Controles de Paginação -->
        <div class="pagination">
            <button class="w-18 h-8 text-sm font-bold rounded-md 
                                            border border-transparent bg-blue-700 text-white 
                                            hover:bg-blue-800 focus:outline-none focus:bg-blue-800" @click="previousPage" :disabled="storeTransaction.currentPage === 1">Anterior</button>
            <span> Página {{ storeTransaction.currentPage }} de {{ storeTransaction.totalPages }} </span>
            <button class="w-18 h-8 text-sm font-bold rounded-md 
                                            border border-transparent bg-blue-700 text-white 
                                            hover:bg-blue-800 focus:outline-none focus:bg-blue-800" @click="nextPage"
                :disabled="storeTransaction.currentPage === storeTransaction.totalPages">Próxima</button>
        </div>
        <br>
    </div>
</template>