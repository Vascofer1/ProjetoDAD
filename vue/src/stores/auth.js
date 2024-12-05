import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { h } from 'vue'

import avatarNoneAssetURL from '@/assets/avatar-none.png'
import { get } from '@vueuse/core'

export const useAuthStore = defineStore('auth', () => {
  const storeError = useErrorStore()

  const { toast } = useToast()
  const users = ref([])
  const user = ref(null)
  const token = ref('')

  const userName = computed(() => {
    return user.value ? user.value.name : ''
  })

  const userFirstLastName = computed(() => {
    const names = userName.value.trim().split(' ')
    const firstName = names[0] ?? ''
    const lastName = names.length > 1 ? names[names.length - 1] : ''
    return (firstName + ' ' + lastName).trim()
  })

  const userEmail = computed(() => {
    return user.value ? user.value.email : ''
  })

  const userType = computed(() => {
    return user.value ? user.value.type : ''
  })

  const userGender = computed(() => {
    return user.value ? user.value.gender : ''
  })

  const userPhotoUrl = computed(() => {
    const photoFile = user.value ? (user.value.photoFileName ?? '') : ''
    if (photoFile) {
      return axios.defaults.baseURL.replaceAll('/api', photoFile)
    }
    return avatarNoneAssetURL
  })

  // This function is "private" - not exported by the store
  const clearUser = () => {
    resetIntervalToRefreshToken()
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    axios.defaults.headers.common.Authorization = ''
  }

  const login = async (credentials) => {
    storeError.resetMessages()
    try {
      const responseLogin = await axios.post('auth/login', credentials)
      token.value = responseLogin.data.token
      localStorage.setItem('token', token.value)
      axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
      const responseUser = await axios.get('users/me')
      user.value = responseUser.data.data
      repeatRefreshToken()
      return user.value
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(
        e.response.data.message,
        e.response.data.errors,
        e.response.status,
        'Authentication Error!'
      )
      return false
    }
  }

  const logout = async () => {
    storeError.resetMessages()
    try {
      await axios.post('auth/logout')
      clearUser()
      return true
    } catch (e) {
      clearUser()
      storeError.setErrorMessages(
        e.response.data.message,
        [],
        e.response.status,
        'Authentication Error!'
      )
      return false
    }
  }

  let intervalToRefreshToken = null

  const resetIntervalToRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken)
    }
    intervalToRefreshToken = null
  }

  const repeatRefreshToken = () => {
    if (intervalToRefreshToken) {
      clearInterval(intervalToRefreshToken)
    }
    intervalToRefreshToken = setInterval(
      async () => {
        try {
          const response = await axios.post('auth/refreshtoken')
          token.value = response.data.token
          localStorage.setItem('token', token.value)
          axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
          return true
        } catch (e) {
          clearUser()
          storeError.setErrorMessages(
            e.response.data.message,
            e.response.data.errors,
            e.response.status,
            'Authentication Error!'
          )
          return false
        }
      },
      1000 * 60 * 110
    )
    return intervalToRefreshToken
  }

  const restoreToken = async function () {
    let storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        token.value = storedToken
        axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
        const responseUser = await axios.get('users/me')
        user.value = responseUser.data.data
        repeatRefreshToken()
        return true
      } catch {
        clearUser()
        return false
      }
    }
    return false
  }

  //Update User
  const updateUser = async (user) => {
    storeError.resetMessages()
    try {
      const response = await axios.put('users/' + user.id, user)
      console.log(user.photoFileName, user)
      //const index = getIndexOfUser(user.id)
      const index = user.id
      if (index > -1) {
        console.log(index, "lol")
        // Instead of a direct assignment, object is cloned/copied to the array
        // This ensures that the object in the array is not the same as the object fetched
        console.log(Object.assign({}, response.data.data))
        users.value[index] = Object.assign({}, response.data.data)
        console.log(index, "lol")
      }
      console.log(index, "lol")
      toast({
        description: 'User has been updated correctly!',
      })
      console.log(index, "lol")
      console.log("alo", response.data.data)
      return response.data.data
    } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating user!')
      return false
    }
  }


  const getUser = async (user) => {
    const responseUser = await axios.get('users/me')
    user.value = responseUser.data.data
  }

  const insertUser = async (user) => {
    storeError.resetMessages()
    try {
      console.log(user, "oi")
      const response = await axios.post('users', user)
      console.log(users.value.push(response.data.data), "ola")
      users.value.push(response.data.data)
      console.log("alo", response.data.data)
      toast({
        description: `user #${response.data.data.id} "${response.data.data.name}" was created!`,
        action: h(ToastAction, {
          altText: `Open new user`,
          onclick: () => {
            router.push({ name: 'profile' })
          }
        }, {
          default: () => `Open new user`,
        })
      })
      console.log(user, "ola")
      return response.data.data
    } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating user!')
      return false
    }
  }

  return {
    user,
    userName,
    userFirstLastName,
    userEmail,
    userType,
    userGender,
    userPhotoUrl,
    restoreToken,
    login,
    logout,
    updateUser,
    getUser,
    insertUser
  }
})
