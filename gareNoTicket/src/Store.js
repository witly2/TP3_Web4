// src/store.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null, // Les informations de l'utilisateur seront stockées ici
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },

  getters: {
    getUser: (state) => state.user,
  }
});

export default store;
