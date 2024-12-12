<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()

const props = defineProps({
    showApplyButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:filterByType', 'update:filterByBlocked', 'update:filterByNickname'])

const filterByType = ref(storeAuth.filterByType)
const filterByBlocked = ref(storeAuth.filterByBlocked)
const filterByNickname = ref(storeAuth.filterByNickname)

watch(filterByType, (newValue) => {
    emit('update:filterByType', newValue)
})

watch(filterByBlocked, (newValue) => {
    emit('update:filterByBlocked', newValue)
})

watch(filterByNickname, (newValue) => {
    emit('update:filterByNickname', newValue)
})

const listOfStatus = ref([
    null,
    {
        'type': 'P',
        'filterDescription' : 'Player'  
    },
    {
        'type': 'A',
        'filterDescription' : 'Admin'  
    },
])

const resetFilter = () => {
    filterByType.value = null
    filterByBlocked.value = null
    filterByNickname.value = null
}

const applyFilter = () => {
    console.log('Apply Filter')
}
</script>

<template>
    <div class="py-2">
        <label for="input_filter_type_id" class="font-medium">Filter Users</label>
        <div class="flex flex-wrap px-1 space-x-3">
            <div class="py-1 text-sm leading-10 flex shrink-0 space-x-1 grow">
                <label for="input_filter_nickname_id" class="font-medium">Nickname</label>
                <input 
                    id="input_filter_nickname_id"
                    type="text" 
                    class="p-2 grow h-10 border-gray-300 border rounded-lg text-base"
                    placeholder="Enter nickname"
                    v-model="filterByNickname" />
            </div>
            <div class="ps-3 py-1 text-sm leading-10 flex space-x-1 grow">
                <label for="input_filter_type_id" class="font-medium">Type</label>
                <select id="input_filter_type_id" class="p-2 grow h-10 border-gray-300 border rounded-lg text-base"            
                    v-model="filterByType">
                    <option v-for="p in listOfStatus" :key="p ? p.type : 'any'" :value="p ? p.type : null">
                        {{ p ? p.filterDescription : '-- Any --' }}
                    </option>
                </select>
            </div>



            <div class="py-1 text-sm leading-10 flex shrink-0 space-x-1">
                <label for="input_filter_blocked_id" class="font-medium">Blocked Status</label>
                <select id="input_filter_blocked_id" class="p-2 grow h-10 border-gray-300 border rounded-lg text-base"            
                    v-model="filterByBlocked">
                    <option :value="null">-- Any --</option>
                    <option :value="true">Blocked</option>
                    <option :value="false">Not Blocked</option>
                </select>
            </div>

            <button type="button" class="my-1 w-10 h-10 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-bold rounded-md 
                                        border border-transparent bg-gray-400 text-white 
                                        hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                    @click.prevent="resetFilter">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>                        
        </div>
    </div>
</template>