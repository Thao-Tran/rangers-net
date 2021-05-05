import { League, getLeagues } from '@/utils/leagues'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store<{ leagues: League[] }>({
  state: {
    leagues: []
  },
  mutations: {
    getLeagues (state) {
      state.leagues = getLeagues()
    }
  },
  actions: {
  },
  modules: {
  }
})
