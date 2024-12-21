<script setup>
import { ref, inject } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'

const storeChat = useChatStore()
const storeAuth = useAuthStore()

const inputDialog = inject('inputDialog')

const message = ref('')

const canSendMessageToUser = (user) => {
    return user && storeAuth.user && user.id !== storeAuth.user.id
}

const sendMessageToChat = () => {
    storeChat.sendMessageToChat(message.value)
    message.value = ''
}

let userDestination = null
const sendPrivateMessageToUser = (user) => {
    userDestination = null
    if (canSendMessageToUser(user)) {
        userDestination = user
        inputDialog.value.open(
            handleMessageFromInputDialog,
            'Message to ' + user.name,
            `Only ${user.name} will receive this message!`,
            'Message', '',
            'Close', 'Send',
            ''
        )
    }
}

const handleMessageFromInputDialog = (message) => {
    storeChat.sendPrivateMessageToUser(userDestination, message)
}
</script>

<template>
    <div class="chat-wrapper">
        <header class="chat-header">
            <h1>Chat Room</h1>
            <p>
                Stay connected. Click on a username to send a private message.
            </p>
        </header>
        <div class="chat-messages">
            <div v-if="storeChat.totalMessages > 0" class="message-container">
                <div v-for="messageObj in storeChat.messages" 
                     :key="messageObj" 
                     class="message-item">
                    <span 
                        :class="canSendMessageToUser(messageObj.user) ? 'user clickable' : 'user'"
                        @click="canSendMessageToUser(messageObj.user) && sendPrivateMessageToUser(messageObj.user)">
                        {{ messageObj.user?.name ?? 'Anonymous' }}:
                    </span>
                    <p class="message-text">{{ messageObj.message }}</p>
                </div>
            </div>
            <div v-else class="no-messages">
                <p>No messages yet! Start the conversation.</p>
            </div>
        </div>
        <footer class="chat-footer">
            <input 
                v-model="message" 
                @keydown.enter="sendMessageToChat"
                class="message-input" 
                placeholder="Type your message and press Enter" 
            />
        </footer>
    </div>
</template>

<style>
.chat-wrapper {
    width: 100%;
    max-width: 700px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fdfdfd;
    overflow: hidden;
    font-family: Arial, sans-serif;
}

.chat-header {
    background-color: #007bff;
    color: white;
    padding: 20px;
    text-align: center;
}

.chat-header h1 {
    margin: 0;
    font-size: 1.5rem;
}

.chat-header p {
    margin: 5px 0 0;
    font-size: 0.9rem;
}

.chat-messages {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
}

.message-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.message-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user {
    font-weight: bold;
    color: #007bff;
}

.user.clickable {
    cursor: pointer;
    text-decoration: underline;
}

.message-text {
    margin: 0;
    padding: 5px 10px;
    background-color: #e6f7ff;
    border-radius: 5px;
    max-width: 80%;
    word-wrap: break-word;
}

.no-messages {
    text-align: center;
    color: #888;
    font-size: 1.2rem;
    padding: 20px;
}

.chat-footer {
    padding: 15px;
    background-color: #fff;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: center;
}

.message-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    outline: none;
}

.message-input:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
