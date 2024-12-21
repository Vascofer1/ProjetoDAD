import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'

export const useGameStore = defineStore('game', () => {
    const storeError = useErrorStore()

    const { toast } = useToast()
    const games = ref([])
    const game = ref(null)
    const gamesPerMonth = ref([]);
    const gamesPerWeek = ref([]);
    const gamesLastMonth = ref([]);
    const gamesPerType = ref([]);

    const router = useRouter()

    const totalGames = computed(() => {
        return games.value ? games.value.length : 0
    })

    const fetchGames = async () => {
        storeError.resetMessages()
        const response = await axios.get('games')
        games.value = response.data.data
    }

    const fetchGamesLastWeek = async () => {
        storeError.resetMessages()
        const response = await axios.get('games/last-week')
        gamesPerWeek.value = response.data.data
    }

    const fetchGamesLastMonth = async () => {
        storeError.resetMessages()
        const response = await axios.get('games/last-month')
        gamesLastMonth.value = response.data.data
    }

    const fetchGamesPerType = async () => {
        storeError.resetMessages()
        const response = await axios.get('games/per-type')
        gamesPerType.value = response.data.data
    }

    // This function is "private" - not exported by the store
    const getIndexOfGame = (gameId) => {
        return games.value.findIndex((g) => g.id === gameId)
    }

    const fetchGame = async (gameId) => {
        storeError.resetMessages()
        const response = await axios.get('games/' + gameId)
        const index = getIndexOfGame(gameId)
        if (index > -1) {
            // Instead of a direct assignment, object is cloned/copied to the array
            // This ensures that the object in the array is not the same as the object fetched
            games.value[index] = Object.assign({}, response.data.data)  
        }
        return response.data.data
    }

    // acrescenta o código necessário para fazer um gráfico de barras com a quantidade de jogos por mês
    const fetchGamesPerMonth = async () => {
        storeError.resetMessages()
        const response = await axios.get('games/games-per-month')
        gamesPerMonth.value = response.data.data
    }

    

    return {
        games,
        game,
        totalGames,
        gamesPerMonth,
        gamesPerWeek,
        gamesLastMonth,
        gamesPerType,
        fetchGamesPerType,
        fetchGamesLastMonth,
        fetchGamesLastWeek,
        fetchGames,
        fetchGame,
        fetchGamesPerMonth,
    }
})
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import router from '@/router'
import { useRouter } from "vue-router"; 
export const useGamesStore = defineStore('games', () => {
    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const { toast } = useToast()
    const socket = inject('socket')
    
    const router = useRouter(); 
    const games = ref([])

    const totalGames = computed(() => games.value.length)

    // Use this function to update the game object in the games array
    const updateGame = (game) => {
        const gameIndex = games.value.findIndex((g) => g.id === game.id)
        if (gameIndex !== -1) {
            games.value[gameIndex] = { ...game } // shallow copy
        }
    }

    const playerNumberOfCurrentUser = (game) => {
        if (game.player1_id === storeAuth.userId) {
            return 1
        }
        if (game.player2_id === storeAuth.userId) {
            return 2
        }
        return null
    }  

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    const removeGameFromList = (game) => {
        const gameIndex = games.value.findIndex((g) => g.id === game.id)
        if (gameIndex >= 0) {
            games.value.splice(gameIndex, 1)
        }
    }

    // fetch playing games from the Websocket server
    const fetchPlayingGames = () => {
        storeError.resetMessages()
        socket.emit('fetchPlayingGames', (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            games.value = response
        })
    }

    const play = (game, idx) => {
        storeError.resetMessages()
        socket.emit('play', {
                index: idx,
                gameId: game.id
        }, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            updateGame(response)
        })
    }
    
    const quit = (game) => {
        storeError.resetMessages()
        socket.emit('quitGame', game.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(game)
        })
    } 

    const close = (game) => {
        storeError.resetMessages()
        socket.emit('closeGame', game.id, (response) => {
            if (webSocketServerResponseHasError(response)) {
                return
            }
            removeGameFromList(game)
        })
    } 
    
    socket.on('gameStarted', async (game) => {
        if (game.player1_id === storeAuth.userId) {
            toast({
                title: 'Game Started',
                description: `Game #${game.id} has started!`,
            })
        }
        console.log('Game started:', game)
        fetchPlayingGames()
    })

    socket.on('gameEnded', async (game) => {
        updateGame(game)
        // Player that created the game is responsible for updating on the database
        if (playerNumberOfCurrentUser(game) === 1) {
            const APIresponse = await axios.patch('games/' + game.id, {
                status: 'ended',
                winner_id: game.gameStatus === 1 ? game.player1_id : (game.gameStatus === 2 ? game.player2_id : null),
            })
            const updatedGameOnDB = APIresponse.data.data
            console.log('Game has ended and updated on the database: ', updatedGameOnDB)
        }
    })

    socket.on('gameChanged', (game) => {
        updateGame(game)
    })

    socket.on('gameQuitted', async (payload) => {
        if (payload.userQuit.id != storeAuth.userId) {
            toast({
                title: 'Game Quit',
                description: `${payload.userQuit.name} has quitted game #${payload.game.id}, giving you the win!`,
            })
        }
        updateGame(payload.game)
    })

    socket.on('gameInterrupted', async (game) => {
        updateGame(game)
        toast({
            title: 'Game Interruption',
            description: `Game #${game.id} was interrupted because your opponent has gone offline!`,
            variant: 'destructive'
        })
        const APIresponse = await axios.patch('games/' + game.id, {
            status: 'interrupted',
            winner_id: game.gameStatus === 1 ? game.player1_id : (game.gameStatus === 2 ? game.player2_id : null),
        })
        const updatedGameOnDB = APIresponse.data.data
        console.log('Game was interrupted and updated on the database: ', updatedGameOnDB)
    })
    
    return {
        games, totalGames, playerNumberOfCurrentUser, fetchPlayingGames, play, quit, close
    }
})
