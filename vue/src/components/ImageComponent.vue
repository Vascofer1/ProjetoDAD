<script setup>
import{computed} from 'vue'
const props = defineProps({
    path: String
})

const imageSrc = computed(()=>{
    return `./${props.path}`
})

</script>

<template>
    <br>
    <img class="img-thumbnail" :src="imageSrc" alt="Avatar">
</template>