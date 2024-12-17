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
    const transaction = ref(null)

    const router = useRouter()


    const totalTransactions = computed(() => {
        return transactions.value ? transactions.value.length : 0
    })

    const fetchTransactions = async () => {
        storeError.resetMessages()
        const response = await axios.get('transactions')
        transactions.value = response.data.data
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
        insertTransactionTypeB
    }
})
