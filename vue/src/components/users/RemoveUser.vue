<script setup>
import { ref, useTemplateRef, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'
import Toaster from '../ui/toast/Toaster.vue'


const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const userStore = useAuthStore()
const storeError = useErrorStore()

const router = useRouter()

const user = ref(null)
userStore.getUser(user)


const nickname = ref('')

console.log(user)

// Cancelar e voltar para a página anterior
const cancel = () => {
    storeError.resetMessages();
    router.back();
};

const deleteConfirmed = async () => {
  storeError.resetMessages()
  
  if (nickname.value == user.value.nickname) {
        if (await userStore.deleteUserMe()) {
            router.push({ name: 'home' }); // Redirecionar para a pagina principal
        }
    }
    else{
        storeError.setErrorMessages("Can't delete user", "Wrong nickname", 422, "Operation failed")
    }
}

// Função para remover o usuário logado
const deleteUser = () => {
    console.log(user)
  alertDialog.value.open(deleteConfirmed, 'Are you sure?', 'Cancel', `Yes, delete User #${userStore.userFirstLastName}`,
    `This action cannot be undone. This will permanently delete the User #${user.value.id} "${userStore.userFirstLastName}" from our servers.`)
}
</script>

<template>
    <Toaster />
    <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
    <!-- <div class="flex space-x-1 align-middle">
        <label for="input_password_id" class="w-24 font-medium text-sm leading-10">Password</label>
        <input type="password" id="input_password_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
            v-model="password">
    </div>
    <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('password')"></ErrorMessage> -->

    <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_nickname_id" class="w-24 font-medium text-sm leading-10">Nickname</label>
                    <input type="text" id="input_nickname_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="nickname">     
                </div>
            </div>

    <div class="pt-4 flex space-x-4 justify-end">
        <button type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-gray-400 text-white 
                                            hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
            @click.prevent="cancel">
            Cancel
        </button>
        <button type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-red-700 text-white 
                                            hover:bg-red-800 focus:outline-none focus:bg-red-800"
            @click.prevent="deleteUser">
            Remove
        </button>
    </div>

</template>