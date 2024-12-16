<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label/index.js' //import { Label } from '@/components/ui/label' ???
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'

const storeAuth = useAuthStore()
const storeError = useErrorStore()


const router = useRouter()

const credentials = ref({
  email: '',
  password: ''
})

const cancel = () => {
  router.back()
}

const login = () => {
  storeAuth.login(credentials.value)
  router.push({ name: 'home' }); // Redirecionar para a pagina principal
} 
</script>

<template>
  <div class="text-center text-2xl font-bold">
    <h1>MEMORY GAME</h1>
  </div>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your credentials to access your account.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="cancel">
        Cancel
      </Button>
      <Button @click="login">
        Login
      </Button>
    </CardFooter>
    <CardFooter class="flex justify-left px-6 pb-6">
      <CardDescription>You dont have account?</CardDescription>
      <RouterLink :to="{ name: 'register' }"
            class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="text-blue-600 font-semibold">
            Register
      </RouterLink>
    </CardFooter>
  </Card>
</template>