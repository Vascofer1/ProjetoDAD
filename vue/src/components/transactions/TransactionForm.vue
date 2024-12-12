<script setup>
import { useErrorStore } from '@/stores/error'
import { readonly } from 'vue';


const storeError = useErrorStore()

const props = defineProps({
    transaction: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: 'Transaction'
    },
    type: {
        type: String,
        default: 'N'
    },
    readOnly: {
        type: Boolean,
        default: false
    },
})

if (props.type != 'N') {
  props.transaction.type = props.type
}

const emit = defineEmits(['save', 'cancel'])

const clickSave = (transaction) => {
    emit('save', transaction)
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

            <!-- Transaction Type -->
            <div class="flex flex-col">
                <label for="transaction_type" class="font-medium text-sm">Type</label>
                <select :disabled="readOnly" v-if="props.type == 'N'" id="transaction_type" class="px-4 h-10 border-gray-300 border rounded-lg text-base"
                    v-model="transaction.type" >
                    <option value="B">Bonus</option>
                    <option value="P">Purchase</option>
                    <option value="I">Internal</option>
                </select>
                <input v-else :disabled="true" type="text"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="props.type" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('type')" />
            </div>

            <!-- User Id -->
            <div v-if="readOnly" class="flex flex-col">
                <label for="user_id" class="font-medium text-sm">User Id</label>
                <input :disabled="readOnly" type="number" id="user_id"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.user_id" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('user_id')" />
            </div>

            <!-- Reference -->
            <div class="flex flex-col">
                <label for="transaction_payment_reference" class="font-medium text-sm">Payment Reference</label>
                <input :disabled="readOnly" type="text" id="transaction_payment_reference"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.payment_reference" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('payment_reference')" />
            </div>

            <!-- Value -->
            <div class="flex flex-col">
                <label for="transaction_euros" class="font-medium text-sm">Value (€)</label>
                <input :disabled="readOnly" type="number" id="transaction_euros"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.euros" min="1"
                    max="100" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('euros')" />
            </div>

            <!-- Brain Coins -->
            <div v-if="readOnly" class="flex flex-col">
                <label for="brain_coins" class="font-medium text-sm">Brain Coins</label>
                <input :disabled="readOnly" type="number" id="brain_coins"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.brain_coins" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('brain_coins')" />
            </div>

            <!-- Game Id -->
            <div v-if="readOnly" class="flex flex-col">
                <label for="game_id" class="font-medium text-sm">Game Id</label>
                <input :disabled="readOnly" type="number" id="game_id"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.game_id" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('game_id')" />
            </div>

            <!-- Payment Type -->
            <div class="flex flex-col">
                <label for="payment_type" class="font-medium text-sm">Payment Type</label>
                <select :disabled="readOnly" id="payment_type" class="px-4 h-10 border-gray-300 border rounded-lg text-base"
                    v-model="transaction.payment_type">
                    <option value="MBWAY">MBWAY</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="IBAN">IBAN</option>
                    <option value="MB">Multibanco</option>
                    <option value="VISA">Visa</option>
                </select>
                <ErrorMessage :errorMessage="storeError.fieldMessage('payment_type')" />
            </div>

            <!-- Date -->
            <div v-if="readOnly" class="flex flex-col">
                <label for="transaction_datetime" class="font-medium text-sm">Dransaction Datetime</label>
                <input :disabled="readOnly" type="text" id="transaction_datetime"
                    class="px-4 h-10 border-gray-300 border rounded-lg text-base" v-model="transaction.transaction_datetime" />
                <ErrorMessage :errorMessage="storeError.fieldMessage('transaction_datetime')" />
            </div>

            <div class="pt-4 flex space-x-4 justify-end">
                <button type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-gray-400 text-white 
                                            hover:bg-gray-500 focus:outline-none focus:bg-gray-500"
                    @click.prevent="clickCancel">
                    Cancel
                </button>
                <button v-show="!readOnly" type="button" class="w-24 h-10 text-sm font-bold rounded-md 
                                            border border-transparent bg-green-700 text-white 
                                            hover:bg-green-800 focus:outline-none focus:bg-green-800"
                    @click.prevent="clickSave(transaction)">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>
