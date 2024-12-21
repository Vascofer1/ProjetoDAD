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

export const useTransactionStore = defineStore('transaction', () => {
    const storeError = useErrorStore()

    const { toast } = useToast()
    const transactions = ref([])
    const totalTransactions = ref(0)
    const transaction = ref(null)
    const currentPage = ref(1) // Página atual
    const totalPages = ref(1) // Total de páginas disponíveis
    const pagination = ref({}) // Detalhes da paginação

    const router = useRouter()


    //#region filters

    const filterByType = ref(null)
    const filterById = ref(null)
    const filterByDateAfter = ref(null)
    const filterByDateBefore = ref(null)

    const totalFilteredTransactions = computed(() => {
        return filteredTransactions.value ? filteredTransactions.value.length : 0
    })

    // This function is "private" - not exported by the store
    const transactionInFilter = (transaction) => {
        if (filterByType.value !== null && transaction.type !== filterByType.value) {
            return false
        }
        if (filterById.value !== null && transaction.id !== filterById.value) {
            return false
        }
        if (filterByDateAfter.value !== null && transaction.transaction_datetime < filterByDateAfter.value) {
            return false
        }
        if (filterByDateBefore.value !== null && transaction.transaction_datetime > filterByDateBefore.value) {
            return false
        }
        return true
    }

    const filteredTransactions = computed(() => transactions.value.filter(transactionInFilter))

    const filterDescription = computed(() => {
        let description = 'All transactions'
        if (filterByType.value) {
            description += ' of type ' + filterByType.value
        }
        if (filterById.value) {
            description += ' with id' + filterById.value
        }
        if (filterByNickname.value) {
            description += ' with nickname containing ' + filterByNickname.value
        }
        if (filterByDateAfter.value) {
            description += ' after ' + filterByDateAfter.value
        }
        if (filterByDateBefore.value) {
            description += ' before ' + filterByDateBefore.value
        }
        return description
    })


    //#endregion


    /*const totalTransactions = computed(() => {
        return transactions.value ? transactions.value.length : 0
    })*/

    const fetchTransactions = async (page) => {
        storeError.resetMessages()
    
        const params = {
            page: page,
            type: filterByType.value,
            id: filterById.value,
            date_after: filterByDateAfter.value,
            date_before: filterByDateBefore.value,
        }
    
        try {
            const response = await axios.get('transactions', { params })
            transactions.value = response.data.data
            currentPage.value = page
            totalPages.value = response.data.meta.last_page
            totalTransactions.value = response.data.meta.total
        } catch (error) {
            storeError.setErrorMessages('Error fetching transactions!', error.response?.data?.errors || {}, error.response?.status)
        }
    }
    

    // This function is "private" - not exported by the store
    const getIndexOfTransaction = (transactionId) => {
        return transactions.value.findIndex((t) => t.id === transactionId)
    }

    const fetchTransaction = async (transactionId) => {
        storeError.resetMessages()
        const response = await axios.get('transactions/' + transactionId)
        const index = getIndexOfTransaction(transactionId)
        if (index > -1) {
            // Instead of a direct assignment, object is cloned/copied to the array
            // This ensures that the object in the array is not the same as the object fetched
            transactions.value[index] = Object.assign({}, response.data.data)
        }
        return response.data.data
    }

    // Função para criar um débito no serviço de gateway de pagamento
    const processPaymentGateway = async (payment) => {
        storeError.resetMessages()
        try {
            console.log(payment)
            const response = await axios.post('https://dad-202425-payments-api.vercel.app/api/debit', payment)

            if (response.status === 201) {
                return { success: true }
            } else {
                return { success: false, errors: response.data.message || 'Unknown error from payment gateway.' }
            }
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error when making payment!')
            return false
        }
    }


    const insertTransactionPurchase = async (transaction) => {
        storeError.resetMessages()

        try {
            const payment = {
                type: transaction.payment_type,
                reference: transaction.payment_reference,
                value: transaction.euros
            }


            // Processar pagamento no gateway externo
            const paymentResult = await processPaymentGateway(payment)
            if (!paymentResult.success) {
                storeError.setErrorMessages('Payment gateway error.', paymentResult.errors, paymentResult.statusCode || 422, 'Payment Error!')
                return false
            }


            const response = await axios.post('transactions', transaction)
            transactions.value.push(response.data.data)
            console.log(response.data.data)
            toast({
                description: `Transaction #${response.data.data.id} was created!`,
                action: h(ToastAction, {
                    altText: `Open new transaction`,
                    onclick: () => {
                        router.push({
                            name: 'showTransaction',
                            params: { id: response.data.data.id }
                        })
                    }
                }, {
                    default: () => `Open new transaction`,
                })
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating transaction!')
            return false
        }
    }


    const insertTransactionTypeB = async (transaction) => {
        storeError.resetMessages()
        try {
            const response = await axios.post('transactions/B', transaction)
            transactions.value.push(response.data.data)
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating transaction!')
            return false
        }
    }


    return {
        transactions,
        totalTransactions,
        fetchTransactions,
        fetchTransaction,
        insertTransactionPurchase,
        insertTransactionTypeB,
        filterByType,
        filterById,
        filterByDateAfter,
        filterByDateBefore,
        totalFilteredTransactions,
        filterDescription,
        filteredTransactions,
        currentPage,
        totalPages,
        pagination
    }
})
