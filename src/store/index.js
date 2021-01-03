import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  mutations: {
    setUserInfo (state, userInfo = null) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updateUserInfo ({ commit }, payload) {
      commit('setUserInfo', payload)
    }
  },
  modules: {
  }
})
