import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from "vue-router";

export const useLobbyStore = defineStore('lobby', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const socket = inject('socket')

    const games = ref([])
    const router = useRouter()
    const totalGames = computed(() => games.value.length)

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    // when the lobby changes on the server, it is updated on the client
    socket.on('lobbyChanged', (lobbyGames) => {
        games.value = lobbyGames
    })

    // fetch lobby games from the Websocket server
    const fetchGames = () => {
        storeError.resetMessages()
        socket.emit('fetchGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    // add a game to the lobby
    const addGame = () => {
        storeError.resetMessages()
        socket.emit('addGame', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // remove a game from the lobby
    const removeGame = (id) => {
        storeError.resetMessages()
        socket.emit('removeGame', id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
        })
    }

    // join a game of the lobby
    const joinGame = (id) => {
        storeError.resetMessages()
        socket.emit('joinGame', id, async (response) => {
            // callback executed after the join is complete
            if (webSocketServerResponseHasError(response)) {
                return
            }
            console.log('response:', response)
            const APIresponse = await axios.post('/games', {
                created_user_id: response.player1.id,
                board_id: 1,
                type: "M",
                status: "PL",
            })
            const newGameOnDB = APIresponse.data
            newGameOnDB.player1SocketId = response.player1SocketId
            newGameOnDB.player2SocketId = response.player2SocketId
            /* const multiplayerGame = await axios.post('/multiplayergames', {
                user_id: response.player1.id,
                game_id: newGameOnDB.id,
                player_won: null,
                pairs_discovered: 0,
            })

            const multiplayerGame2 = await axios.post('/multiplayergames', {
                user_id: response.player2.id,
                game_id: newGameOnDB.id,
                player_won: null,
                pairs_discovered: 0,
            }) */
            
            
            console.log('newGameOnDB:', newGameOnDB)
            // After adding the game to the DB emit a message to the server to start the game
            socket.emit('startGame', newGameOnDB, (startedGame) => {
                console.log('Game has started', startedGame)
            })
        })
    }

    // Whether the current user can remove a specific game from the lobby
    const canRemoveGame = (game) => {
        return game.player1.id === storeAuth.userId
    }
    
    // Whether the current user can join a specific game from the lobby
    const canJoinGame = (game) => {
        return storeAuth.user && game.player1.id !== storeAuth.userId
    }

    return {
        games, totalGames, fetchGames, addGame, joinGame, canJoinGame, removeGame, canRemoveGame
    }
})
