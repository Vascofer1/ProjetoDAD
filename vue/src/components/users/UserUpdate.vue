<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import UserForm from './UserForm.vue'

const storeAuth = useAuthStore()
const storeError = useErrorStore()

const router = useRouter()

const auth = ref(null)

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})

// When the "id" prop changes, the "user" will be loaded from the API
watch(
    () => props.id,
    async (newIDValue) => {
        user.value = await storeAuth.fetchUser(newIDValue)
    },
    { immediate: true }
)

const save = async (user) => {
    if (await storeUser.updateUser(user)) {        
        router.push({name: 'users'})
    }
}

const cancel = () => {
    storeError.resetMessages()
    router.back()
}
</script>

<template>
    <UserForm v-if="user" :user="user" :title="`Update user # ${user.id}`" @save="save" @cancel="cancel"></UserForm>
</template>