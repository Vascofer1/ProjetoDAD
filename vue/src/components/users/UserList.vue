<script setup>
import User from './User.vue'

const props = defineProps({
    users: Array,
    readonly: Boolean
})
</script>

<template>
    <!-- Header row with column names -->
    <div class="user-header flex ps-2 pe-1">
            <span class="w-12 font-bold">ID</span>
            <span class="flex-[2] font-bold">Nickname</span>
            <span class="flex-[4] font-bold">Name</span>
            <span class="flex-[4] font-bold">Email</span>
            <span class="flex-[1] font-bold">Type</span>
            <span class="flex-[1] font-bold">Blocked</span>
            <span class="flex-[1] font-bold"></span> <!-- For buttons -->
        </div>
    <div class="divide-y divide-solid divide-gray-300 border border-gray-300">
        <User v-for="user in users" :key="user" 
                :user="user" 
                :readonly="readonly"></User>
    </div>            
</template>
