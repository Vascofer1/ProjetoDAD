<script setup>
import { useErrorStore } from '@/stores/error'


const storeError = useErrorStore()

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: 'User'
    },
    type:{
        type: String
    }
})

const emit = defineEmits(['save', 'cancel'])

const clickSave = (user) => {
    console.log(user)
    emit('save', user)
}

const clickCancel = () => {
    emit('cancel')
}
</script>

<template>
    <div class="py-4 px-2">
        <div class="flex flex-col space-y-3 px-3">
            <h2 class="text-2xl">
                {{ title }}
            </h2>

            <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_name_id" class="w-24 font-medium text-sm leading-10">Name</label>
                    <input type="text" id="input_name_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="user.name">     
                </div>                
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
            </div>

            <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_email_id" class="w-24 font-medium text-sm leading-10">Email</label>
                    <input type="email" id="input_email_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="user.email">     
                </div>                
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
            </div>

            <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_nickname_id" class="w-24 font-medium text-sm leading-10">Nickname</label>
                    <input type="text" id="input_nickname_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="user.nickname">     
                </div>                
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
            </div>

            <!-- <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_photo_id" class="w-24 font-medium text-sm leading-10">Photo File Name</label>
                    <input type="text" id="input_photo_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="user.photoFileName">     
                </div>
                <div class="row">
                    <p class="col-md-5">
                        <img class="img-thumbnail" :src="user.photoFileName" alt="Avatar">
                    </p>
                </div>                
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('photoFileName')"></ErrorMessage>
            </div>-->

            <!-- Input para upload de imagem -->
            <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label for="input_photo_id" class="w-24 font-medium text-sm leading-10">Photo</label>
                    <input type="file" id="input_photo_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                           @change="handleFileChange">     
                </div>
                
                <!-- Pré-visualização da imagem -->
                <div class="row mt-2" v-if="user.photoFileName">
                    <p class="col-md-5">
                        <img class="img-thumbnail" :src="user.photoFileName" alt="Avatar Preview" style="max-width: 150px;">
                    </p>
                </div>                
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('photo_url')"></ErrorMessage>
            </div>

            <div class="flex flex-col">
                <div class="flex space-x-1 align-middle">
                    <label v-if="props.type == 'updateUser'" for="input_password_confirmation_id" class="w-24 font-medium text-sm leading-10">New Password</label>
                    <label v-else for="input_password_confirmation_id" class="w-24 font-medium text-sm leading-10">Password</label>
                    <input type="password" id="input_password_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                            v-model="user.password">     
                </div>                
                <div class="flex space-x-1 align-middle">
                    <label v-if="props.type == 'updateUser'" for="input_password_confirmation_id" class="w-24 font-medium text-sm leading-10">Confirm New Password</label>
                    <label v-else for="input_password_confirmation_id" class="w-24 font-medium text-sm leading-10">Confirm Password</label>
                    <input type="password" id="input_password_confirmation_id" class="px-4 grow h-10 border-gray-300 border rounded-lg text-base"
                      v-model="user.password_confirmation">     
                </div>  
                <ErrorMessage class="ps-[6.5rem]" :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
            </div>

            <div class="pt-4 flex space-x-4 justify-end">
                <button type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-gray-400 text-white 
                                            hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                        @click.prevent="clickCancel">
                    Cancel
                </button>                
                <button type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-green-700 text-white 
                                            hover:bg-green-800 focus:outline-none focus:bg-green-800"
                        @click.prevent="clickSave(user)">
                    Save
                </button>  
            </div>
        </div>
    </div>
</template>
