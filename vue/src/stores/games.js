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
