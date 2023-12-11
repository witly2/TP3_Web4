import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'UserStore',
  state: () => ({ 
    user: null,
  }),
  getters: {
    isLoggedIn(state) {
      // Vérifie si l'utilisateur est connecté en fonction de la présence de l'objet utilisateur
      return state.user !== null;
    },
    // Vous pouvez ajouter d'autres getters en fonction des besoins de votre application
  },
  actions: {
    
    setUser(user) {
      
      this.user = user;
    },
    clearUser() {
      // Effacer l'objet utilisateur lors de la déconnexion
      this.user = null;
    },
    getUser() {
      return this.user;
    },
    
  },
})
