<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TransactionForm from './TransactionForm.vue'
import { useTransactionStore } from '@/stores/transaction'
import { useErrorStore } from '@/stores/error'

const storeTransaction = useTransactionStore()
const storeError = useErrorStore()

const router = useRouter()

const transaction = ref(null)

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})

// When the "id" prop changes, the "transaction" will be loaded from the API
watch(
    () => props.id,
    async (newIDValue) => {
        transaction.value = await storeTransaction.fetchTransaction(newIDValue)
    },
    { immediate: true }
)

const save = async (transaction) => {
}

const cancel = () => {
    storeError.resetMessages()
    router.back()
}
</script>

<template>
    <TransactionForm v-if="transaction" :readOnly="true" :transaction="transaction" :title="`Transaction # ${transaction.id}`" @save="save" @cancel="cancel"></TransactionForm>
</template>