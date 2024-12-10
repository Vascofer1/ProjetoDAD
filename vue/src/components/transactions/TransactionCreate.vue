<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import TransactionForm from './TransactionForm.vue'
import { useErrorStore } from '@/stores/error'
import { useTransactionStore } from '@/stores/transaction'

const storeError = useErrorStore()
const storeTransaction = useTransactionStore()

const router = useRouter()

const transaction = ref({})

const create = async (transaction) => {
    if (await storeTransaction.insertTransactionPurchase(transaction)) {        
        router.push({name: 'home'})
    } 
}

const cancel = () => {
    storeError.resetMessages()
    router.back()
}
</script>

<template>
    <TransactionForm :transaction="transaction" type="P" title="Create new Purchase" @save="create" @cancel="cancel"></TransactionForm>
</template>