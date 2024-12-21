<script setup>
import Lobby from './Lobby.vue';

import { useAuthStore} from '@/stores/auth'

const storeAuth = useAuthStore()
</script>
<template>
    <div class="flex flex-wrap justify-start space-x-4">
        <Lobby v-if="storeAuth.user" class="w-72"></Lobby>
    </div>
</template>