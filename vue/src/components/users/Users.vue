<script setup>
import { onMounted } from 'vue'
import UserList from './UserList.vue'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth';
import UserFilterForm from './UserFilterForm.vue';

const storeError = useErrorStore()
const storeAuth = useAuthStore()

onMounted(async () => {
  storeAuth.fetchUsers(1)
})

const updateFilterByType = async (newValue) => {
    storeAuth.filterByType = newValue
    await storeAuth.fetchUsers(1)
}

const updateFilterByBlocked = async (newValue) => {
  storeAuth.filterByBlocked = newValue
  await storeAuth.fetchUsers(1)
}

const updateFilterByNickname = async (newValue) => {
  storeAuth.filterByNickname = newValue
  await storeAuth.fetchUsers(1)
}

const previousPage = async () => {
    if (storeAuth.currentPage > 1) {
        await storeAuth.fetchUsers(storeAuth.currentPage - 1)
    }
}

// Navegar para a próxima página
const nextPage = async () => {
    if (storeAuth.currentPage < storeAuth.totalPages) {
        await storeAuth.fetchUsers(storeAuth.currentPage + 1)
    }
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
    <br>
    <div class="pagination">
            <button class="w-18 h-8 text-sm font-bold rounded-md 
                                            border border-transparent bg-blue-700 text-white 
                                            hover:bg-blue-800 focus:outline-none focus:bg-blue-800" @click="previousPage" :disabled="storeAuth.currentPage === 1">Anterior</button>
            <span> Página {{ storeAuth.currentPage }} de {{ storeAuth.totalPages }} </span>
            <button class="w-18 h-8 text-sm font-bold rounded-md 
                                            border border-transparent bg-blue-700 text-white 
                                            hover:bg-blue-800 focus:outline-none focus:bg-blue-800" @click="nextPage"
                :disabled="storeAuth.currentPage === storeAuth.totalPages">Próxima</button>
        </div>
        <br>
</template>