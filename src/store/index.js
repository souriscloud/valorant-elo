import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
    matches: [],
    lastMatch: null,
    noRanked: null,
    isLoading: null,
    isError: false,
    loaded: false
  },
  mutations: {
    setUserInfo (state, userInfo = null) {
      state.userInfo = userInfo
    },

    setIsLoading (state, isLoading = true) {
      state.isLoading = isLoading
    },

    consumeResponse (state, response) {
      if (response.userInfo !== undefined) {
        state.userInfo = response.userInfo
      }

      if (response.lastMatch !== undefined) {
        state.lastMatch = response.lastMatch
      }

      if (response.noRanked !== undefined) {
        state.noRanked = response.noRanked
      }

      if (response.matches !== undefined) {
        state.matches = response.matches
      }

      if (state.noRanked === null && state.userInfo === null) {
        state.isError = true
      } else {
        state.loaded = true
      }
    },

    setMatches (state, matches = []) {
      state.matches = matches
    }
  },
  actions: {
    updateUserInfo ({ commit }, payload) {
      commit('setUserInfo', payload)
    },

    async fetchData ({ commit }, payload) {
      commit('setIsLoading')

      const authResponse = await axios.post('https://api.valoments.souris.cloud/valoleak', {
        type: 'riotauth',
        username: payload.username,
        password: payload.password
      })

      if (authResponse.data && authResponse.data.accessToken) {
        const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
          type: 'compet',
          accessToken: authResponse.data.accessToken,
          count: 5
        })

        commit('consumeResponse', response.data)
      }

      commit('setIsLoading', false)
    }
  },
  modules: {
  }
})
