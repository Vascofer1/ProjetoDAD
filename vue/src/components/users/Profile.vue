<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserForm from './UserForm.vue'; // Formulário de usuário
import { useAuthStore } from '@/stores/auth'; // Store de usuários
import { useErrorStore } from '@/stores/error'; // Store de erros


const storeUser = useAuthStore();
const storeError = useErrorStore();

const router = useRouter();

const user = ref(null);

storeUser.getUser(user)

/*const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});*/

// Carregar o usuário da API quando o "id" prop mudar
/*watch(
    () => props.id,
    async (newIDValue) => {
        user.value = await storeUser.fetchUser(newIDValue);
    },
    { immediate: true }
);*/

// Função para salvar o usuário atualizado
const save = async (user) => {
    if (await storeUser.updateUser(user)) {
        router.push({ name: 'home' }); // Redirecionar para a lista de usuários
    }
};

// Cancelar e voltar para a página anterior
const cancel = () => {
    storeError.resetMessages();
    router.back();
};

onMounted(() => {
    storeError.resetMessages()
})
</script>

<template>
    <UserForm 
        v-if="user" 
        :user="user" 
        :title="`Update User # ${storeUser.userFirstLastName}`" 
        :type="`updateUser`"
        @save="save" 
        @cancel="cancel" 
    />
</template>
