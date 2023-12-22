<!-- eslint-disable vue/multi-word-component-names -->
<script >
import layoutAuthentification from '../layouts/layoutAuthentification.vue';
import InputAuth from '../components/InputAuth.vue';
import {toast} from 'vue3-toastify'

// import { inject } from 'vue';
// import {vue3GoogleOauth2} from 'vue3-google-oauth2';
export default{
  components:{
    layoutAuthentification,
    InputAuth
  },
  // setup(){
  //   const vue3GoogleOauth = inject(vue3GoogleOauth2);
  //   return vue3GoogleOauth
  // },
  data(){
    return {
      courriel:"",
      password:"",
      cPassword:"",
      nom:""
    }
  },

  methods: {
    // handleInputChangeC(value) {
    //   this.courriel = value;
      
    // },
    // handleInputChangeM(value) {
    //   this.password = value;
    // },
    async handleSignin(){
      try {
        const googleUser = await this.$gAuth.signIn();
        
        if (!googleUser) {
          console.log("nullUser", googleUser);
          return null;
        } else {
          console.log("googleUser", googleUser);
        }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion Google :", error);
      // Vous pouvez traiter l'erreur de manière appropriée ici
    }
    },
      signup(){
        console.log("courrielle "+ this.courriel)
        console.log("password " +this.password)
        
        if(this.courriel==="" || this.password===""||this.nom===""||this.cPassword===""){
          toast.error('Veullez remplir tous les champs',{
                        autoClose:3000
                    });

          this.password=""
          this.cPassword=""
        }
        else if(this.password!==this.cPassword){
          toast.error('Les mots de passe ne doivent être différents',{
                        autoClose:3000
                    });
          this.password=""
          this.cPassword=""
        }
        else if(this.password.length<6){
          toast.error('Les mots de passe doit avoir plus de 6 caractères',{
                        autoClose:3000
                    });
          this.password=""
          this.cPassword=""
        }
        else{
          fetch("https://garenoticket.vercel.app/auth/signup",{

            method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: this.courriel,
                password: this.password,
                username:this.nom,
                confirmPassword:this.cPassword
              }),
            })
            .then((response) => {
              if (response.status === 201) {
                return response.json();
              } else {
                throw new Error("Erreur !");
              }
            })
            .then((data) => {
              console.log('data', data)
              localStorage.setItem("token", data.token);
              console.log("token "+ data.token)
              localStorage.setItem("user", JSON.stringify(data.user));

              toast.success('Compte créer avec succès',{
                        autoClose:3000
                    });
              this.$router.push({name: 'login'});
            })
            .catch((error) => {
              console.log(error);
            });
        }
      },
    
    
  }
}



</script>


<template>

  <layoutAuthentification>
    <main class="about">
      <div class="container-fluid">
          <div class="row mh-100vh">
              <div class="col-10 col-sm-8 col-md-6 col-lg-6 offset-1 offset-sm-2 offset-md-3 offset-lg-0 align-self-center d-lg-flex align-items-lg-center align-self-lg-stretch bg-white p-5 rounded rounded-lg-0 my-5 my-lg-0" id="login-block">
                  <div class="m-auto w-lg-75 w-xl-50">
                      <h2 class="text-info fw-light mb-5"><i class="fa fa-diamond"></i>&nbsp;GareNoTicket</h2>

                      <div class="login-card-social mx-auto py-4 align-content-center">
             

             <div class="log-card-social-btn d-flex">
                 <div>
                     <a href="#">
                         <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-github" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                             <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                         </svg>

                     </a>
                     <div style="font-size:calc(1rem*.8); opacity:.8;">Github </div>
                 </div>

                 <div @click="handleSignin">
                     <a href="#">
                         <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-google" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                             <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                             <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
                         </svg>

                     </a>
                     <div style="font-size:calc(1rem*.8); opacity:.8;">Google</div>
                 </div>
             </div>

         </div>

         <div class="my-3 align-items-center d-flex ou">
             <span class="w-50 border border-1 "></span>
             <span style="font-size:calc(1rem*.8); opacity:.8;">Ou</span>
             <span class="w-50 border border-1 "></span>
         </div>
                      <form v-on:submit.prevent="signup">
                        <InputAuth type="mail" name="fCourriel" label="Courriel" v-model="courriel"/>
                        <InputAuth type="text" label="Nom" name="fNom" v-model="nom"/>
                        <InputAuth type="password" label="Mot de passe" name="fPassword" v-model="password"/>
                        <InputAuth type="password" label="Confirmé le mot  de passe" name="fCPassword" v-model="cPassword"/>
                         <button class="btn btn-info mt-2" type="submit">inscription</button>
                          
                      </form>
                      <p class="mt-3 mb-0">Vous êtes déjà un menbre? <a class="text-info small" href="/">Se connecter</a></p>
                  </div>
              </div>
              <div class="col-lg-6 d-flex align-items-end" id="bg-block" style="">
                  <p class="ms-auto small text-dark mb-2"><em>Photo by&nbsp;</em><a class="text-dark" href="https://unsplash.com/photos/v0zVmWULYTg?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank"><em>Aldain Austria</em></a><br></p>
              </div>
          </div>
      </div>
    </main>
  </layoutAuthentification>

</template>

<style scoped>
.mh-100vh {
  min-height: 100vh;
}

#login-block {
  -webkit-box-shadow: 0px 0px 45px 0px rgba(0,0,0,0.4);
  -moz-box-shadow: 0px 0px 45px 0px rgba(0,0,0,0.4);
  box-shadow: 0px 0px 45px 0px rgba(0,0,0,0.4);
  z-index: 2;
}

#bg-block{
  background-image: url('../../public/img/aldain-austria-316143-unsplash.jpg');
  background-size:cover;
  background-position:center;
}

@media (max-width: 991.98px) {
  #login-block {
    opacity: .95;
  }
}

@media (max-width: 991.98px) {
  #bg-block {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

@media (min-width: 992px) {
  .w-lg-75 {
    width: 75%;
  }
}

@media (min-width: 992px) {
  .rounded-lg-0 {
    border-radius: 0 !important;
  }
}

@media (min-width: 1200px) {
  .w-xl-50 {
    width: 50%;
  }
}


</style>
