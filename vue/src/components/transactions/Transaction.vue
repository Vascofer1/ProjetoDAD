<script setup>
import { useTransactionStore } from '@/stores/transaction'
import { useErrorStore } from '@/stores/error'
import { inject } from 'vue'
import { useAuthStore } from '@/stores/auth';

const storeAuth = useAuthStore()

const storeTransaction = useTransactionStore()
const storeError = useErrorStore()

const props = defineProps({
    transaction: Object
})

const alertDialog = inject('alertDialog')

</script>

<template>
    <div class="flex ps-2 pe-1">
        <div class="flex flex-col grow">
            <div class="text-base pe-4 grow leading-10 flex space-x-2">
                <span class="w-12">#{{ transaction.id }}</span>
            </div>
            <span class="text-xs ps-4 pb-2 -mt-1 text-gray-500">
                User Id: {{ transaction.user_id }}</span>
            <span class="text-xs ps-4 pb-2 -mt-1 text-gray-500">
                Date: {{ transaction.transaction_datetime }}</span>
            <span class="text-xs ps-4 pb-2 -mt-1 text-gray-500">
                Type: {{ transaction.type }}</span>
        </div>
        <RouterLink :to="{ name: 'show transaction', params: { id: transaction.id}}" class="inline-block rounded bg-cyan-500 p-2 m-0.5 text-white">
            <img src="https://img.icons8.com/?size=100&id=60022&format=png&color=000000" alt="Home Icon"
                class="w-6 h-6" />
        </RouterLink>
    </div>
</template>
