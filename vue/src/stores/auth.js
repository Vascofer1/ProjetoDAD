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

  const userBlocked = computed(() => {
    return user.value ? user.value.blocked : ''
  })

  const userPhotoUrl = computed(() => {
    const photoFile = user.value ? (user.value.photoFileName ?? '') : ''
    if (photoFile) {
      return axios.defaults.baseURL.replaceAll('/api', photoFile)
    }
    return avatarNoneAssetURL
  })


  const filterByType = ref(null)
  const filterByBlocked = ref(null)
  const filterByNickname = ref(null)
    
    const totalUsers = computed(() => {
        return users.value ? users.value.length : 0
    })

    const totalFilteredUsers = computed(() => {
        return filteredUsers.value ? filteredUsers.value.length : 0
    })
    
    // This function is "private" - not exported by the store
    const userInFilter = (user) => {
      if (filterByType.value !== null && user.type !== filterByType.value) {
          return false
      }
      if (filterByBlocked.value !== null && user.blocked !== filterByBlocked.value) {
          return false
      }
      if (filterByNickname.value !== null && !user.nickname.toLowerCase().includes(filterByNickname.value.toLowerCase())) {
          return false
      }
      return true
  }

    const filteredUsers = computed(() => users.value.filter(userInFilter))

    const filterDescription = computed(() => {
        let description = 'All users'
        if (filterByType.value) {
            description += ' of type ' + filterByType.value
        }
        if (filterByBlocked.value) {
            description += ' and blocked'
        }
        if (filterByNickname.value) {
            description += ' with nickname containing ' + filterByNickname.value
        }
        return description
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
      console.log(token)
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

  const fetchUsers = async () => {
    storeError.resetMessages()
    const response = await axios.get('users')
    users.value = response.data.data
}


const fetchUser = async (userId) => {
  storeError.resetMessages()
  const response = await axios.get('users/' + usertId)
  const index = getIndexOfUser(userId)
  if (index > -1) {
      // Instead of a direct assignment, object is cloned/copied to the array
      // This ensures that the object in the array is not the same as the object fetched
      users.value[index] = Object.assign({}, response.data.data)  
      
  }
  return response.data.data
}

const getIndexOfUser = (userId) => {
  return users.value.findIndex((p) => p.id === userId)
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

  const canUpdateDeleteUser = (targetUser) => {
    return (user.value.type === 'A' && user.value.id !== targetUser.id)
  }


  const deleteUser = async (user) => {
    storeError.resetMessages()
    try {
      await axios.patch('users/' + user.id + '/deleted')
      const index = getIndexOfUser(user.id)
      if (index > -1) {
        users.value.splice(index, 1)
      }
      return true
    } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error deleting user!')
      return false
    }
  }

const blockUser = async (user) => {
  storeError.resetMessages()
  try {
      console.log(user)
      await axios.patch('users/' + user.id + '/block')
      const index = getIndexOfUser(user.id)
      if (index > -1) {
          users.value[index].blocked = !users.value[index].blocked
      }
      return true
  } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error blocking user!')
      return false
  }
}



const insertAdmin = async (admin) => {
  storeError.resetMessages()
  try {
      const response = await axios.post('admin', admin)
      users.value.push(response.data.data)
      toast({
          description: `Admin #${response.data.data.id} was created!`,
      })
      return response.data.data
  } catch (e) {
      storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error inserting admin!')
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
    users,
    userName,
    userFirstLastName,
    userEmail,
    userType,
    userGender,
    userBlocked,
    userPhotoUrl,
    totalUsers,
    totalFilteredUsers,
    filteredUsers,
    filterByType,
    filterByBlocked,
    filterByNickname,
    filterDescription,
    restoreToken,
    canUpdateDeleteUser,
    insertAdmin,
    blockUser,
    login,
    logout,
    updateUser,
    fetchUser,
    fetchUsers,
    deleteUser,
    getUser,
    insertUser
  }
})
