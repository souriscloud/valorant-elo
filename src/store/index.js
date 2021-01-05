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
    loaded: false,
    accessToken: null,
    lastCommit: null
  },
  mutations: {
    clearData (state) {
      state.userInfo = null
      state.matches = []
      state.lastMatch = null
      state.noRanked = null
      state.isLoading = null
      state.isError = false
      state.loaded = false
      state.accessToken = null
    },

    setUserInfo (state, userInfo = null) {
      state.userInfo = userInfo
    },

    setIsLoading (state, isLoading = true) {
      state.isLoading = isLoading
    },

    setAccessToken (state, accessToken = null) {
      state.accessToken = accessToken
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
    },

    setLastCommitData (state, lastCommit = null) {
      state.lastCommit = lastCommit
    }
  },
  actions: {
    updateUserInfo ({ commit }, payload) {
      commit('setUserInfo', payload)
    },

    async fetchData ({ commit, rootState }, payload) {
      commit('setIsLoading')

      if (!rootState.accessToken) {
        const authResponse = await axios.post('https://api.valoments.souris.cloud/valoleak', {
          type: 'riotauth',
          username: payload.username,
          password: payload.password
        })

        if (authResponse.data && authResponse.data.accessToken) {
          commit('setAccessToken', authResponse.data.accessToken)
          const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
            type: 'compet',
            accessToken: authResponse.data.accessToken,
            count: 5
          })

          commit('consumeResponse', response.data)
        }
      } else {
        const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
          type: 'compet',
          accessToken: rootState.accessToken,
          count: 5
        })

        commit('consumeResponse', response.data)
      }

      commit('setIsLoading', false)
    },

    clear ({ commit }) {
      commit('clearData')
    },

    async fetchLastCommit ({ commit }) {
      console.log('fetchi last comm')
      const response = await axios.post('https://api.valoments.souris.cloud/valoleak', {
        type: 'git-elo'
      })

      commit('setLastCommitData', response.data)
    }
  },
  modules: {
  }
})
