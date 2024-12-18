<script setup>
import { ref, watch } from 'vue'
import { useTransactionStore } from '@/stores/transaction'

const storeTransaction = useTransactionStore()

const props = defineProps({
    showApplyButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits([
    'update:filterByType',
    'update:filterById',
    'update:filterByDateAfter',
    'update:filterByDateBefore'
])

// Filtros existentes
const filterByType = ref(null)
const filterById = ref(null)
const filterByDateAfter = ref(null)
const filterByDateBefore = ref(null)

// Watchers para os eventos
watch(filterByType, (newValue) => {
    emit('update:filterByType', newValue)
})

watch(filterById, (newValue) => {
    emit('update:filterById', newValue)
})

watch(filterByDateAfter, (newValue) => {
    emit('update:filterByDateAfter', newValue)
})

watch(filterByDateBefore, (newValue) => {
    emit('update:filterByDateBefore', newValue)
})

// Lista de status
const listOfStatus = ref([
    null,
    {
        'type': 'P',
        'filterDescription': 'Purchase'
    },
    {
        'type': 'I',
        'filterDescription': 'Internal'
    },
    {
        'type': 'B',
        'filterDescription': 'Bonus'
    }
])

const resetFilter = () => {
    filterByType.value = null
    filterById.value = null
    filterByDateAfter.value = null
    filterByDateBefore.value = null
}
</script>

<template>
    <div class="py-2">
        <label class="font-medium">Filter Transactions</label>
        <div class="flex flex-wrap px-1 space-x-3">

            <!-- Type Filter -->
            <div class="ps-3 py-1 text-sm leading-10 flex space-x-1 grow">
                <label for="input_filter_type_id" class="font-medium">Type</label>
                <select id="input_filter_type_id" class="p-2 grow h-10 border-gray-300 border rounded-lg text-base"
                    v-model="filterByType">
                    <option v-for="p in listOfStatus" :key="p ? p.type : 'any'" :value="p ? p.type : null">
                        {{ p ? p.filterDescription : '-- Any --' }}
                    </option>
                </select>
            </div>

            <!-- Transaction ID Filter -->
            <div class="py-1 text-sm leading-10 flex shrink-0 space-x-1">
                <label for="input_filter_id" class="font-medium">Transaction Id</label>
                <input id="input_filter_id" type="number" v-model="filterById"
                    class="p-2 grow h-10 border-gray-300 border rounded-lg text-base" placeholder="Enter Transaction Id" />
            </div>

            <!-- Date After Filter -->
            <div class="py-1 text-sm leading-10 flex shrink-0 space-x-1">
                <label for="input_date_after" class="font-medium">Date After</label>
                <input id="input_date_after" type="date" v-model="filterByDateAfter"
                    class="p-2 grow h-10 border-gray-300 border rounded-lg text-base" />
            </div>

            <!-- Date Before Filter -->
            <div class="py-1 text-sm leading-10 flex shrink-0 space-x-1">
                <label for="input_date_before" class="font-medium">Date Before</label>
                <input id="input_date_before" type="date" v-model="filterByDateBefore"
                    class="p-2 grow h-10 border-gray-300 border rounded-lg text-base" />
            </div>

            <!-- Reset Button -->
            <button type="button" class="my-1 w-10 h-10 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-md 
                                        border border-transparent bg-gray-400 text-white 
                                        hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                @click.prevent="resetFilter">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>
