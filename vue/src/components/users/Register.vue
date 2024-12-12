<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import UserForm from './UserForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'

const userStore = useAuthStore()
const storeError = useErrorStore()

const router = useRouter()

const user = ref({
    id: 0,
    name: '',
    nickname: '',
    email: '',
    type: 'P',
    photoFileName: '',
})

const create = async (user) => {
    if (await userStore.insertUser(user)) {        
        router.push({name: 'home'})
    } 
}

const cancel = () => {
    storeError.resetMessages()
    router.back()
}
</script>

<template>
    <UserForm :user="user" title="Create new user" @save="create" @cancel="cancel"></UserForm>
</template>