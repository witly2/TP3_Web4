  import { defineStore } from 'pinia'
  import { jwtDecode } from 'jwt-decode'

  export const useAuthStore = defineStore({
    id: 'AuthStore',
    state: () => ({ 
      token: null,
    }),
    getters: {
      isAuthenticated(state) {
        // vérifie si le token existe et n'est pas expiré
        if (state.token) {
          const decoded = jwtDecode(state.token)
          const now = Date.now() / 1000
          if (decoded.exp < now) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
    },
    actions: { 
      // login avec courriel et mot de passe
      async login(login, password) {
        // const response = await fetch('http://localhost:3000/auth/login', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     login,
        //     password
        //   })
        // })
        // if (response.status===200) {
        //   const data = await response.json()
        //   this.token = data.token // On stocke le token dans le store
        //   localStorage.setItem("token", this.token);
        //   localStorage.setItem("user", data.user);
        //   console.log("token "+ this.token)
        // } else {
        //   throw new Error('Impossible de se connecter')
        // }

        fetch("http://localhost:3000/auth/login",{

        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: login,
            password: password,
          }),
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Erreur !");
        }
      })
      .then((data) => {
        console.log('data', data)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("token "+ data.token)

        const decoded = jwtDecode(data.token);
      

        console.log("userId", decoded.username)

        // if(decoded.isValet===true){
        //   this.$router.push({name: 'valet'});
        // }
        // else{
        //   this.$router.push({name: 'home'});
        // }

        // toast.success('Message de réussite!',{
        //   autoClose:3000
        // });
        
      })
      .catch((error) => {
        console.log(error);
      });

        
      },
      logout() {
        // On supprime le token du store
        this.token = null
      },
    },
  })