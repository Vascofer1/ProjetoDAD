<script setup>
import { onMounted } from 'vue'
import UserList from './UserList.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth';
import UserFilterForm from './UserFilterForm.vue';

const storeError = useErrorStore()
const storeAuth = useAuthStore()

onMounted(async () => {
  storeAuth.fetchUsers()
})

const updateFilterByType = (newValue) => {
  storeAuth.filterByType = newValue
}

const updateFilterByBlocked = (newValue) => {
  storeAuth.filterByBlocked = newValue
}

const updateFilterByNickname = (newValue) => {
  storeAuth.filterByNickname = newValue
}
</script>

<template >
    <div class="pt-4" v-if="storeAuth.user && storeAuth.user.type == 'A'">
        <RouterLink :to="{ name: 'admin'}" class="mt-4 w-36 h-10 flex items-center justify-center text-sm font-bold rounded-md 
                                    border border-transparent bg-blue-600 text-white 
                                    hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
            Create New Admin
        </RouterLink>
        <br>
        <UserFilterForm
            :showApplyButton="true"
            @update:filterByType="updateFilterByType"
            @update:filterByBlocked="updateFilterByBlocked"
            @update:filterByNickname="updateFilterByNickname">
        </UserFilterForm>
        
        <h2 class="pt-8 pb-2 text-2xl">
            Users
        </h2>
        <br>
            <UserList :readonly="!storeAuth.user" :users="storeAuth.filteredUsers"></UserList>
    </div>
</template>