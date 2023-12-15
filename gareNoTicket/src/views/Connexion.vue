<!-- eslint-disable vue/multi-word-component-names -->
<script >
import layoutAuthentification from '../layouts/layoutAuthentification.vue';
import InputAuth from '../components/InputAuth.vue';
import { jwtDecode } from "jwt-decode";
import {toast} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
import { useUserStore } from '../stores/user'

//import store from '../Store';
export default{
  components:{
    layoutAuthentification,
    InputAuth
  },
  data(){
    return {
      courriel:"",
      password:"",
      //userStore:null,
    }
  },
  

  methods: {
    // handleInputChangeC(value) {
    //   this.courriel = value;
      
    // },
    // handleInputChangeM(value) {
    //   this.password = value;
    // },
   
    login(){
      console.log("courrielle "+ this.courriel)
      console.log("password " +this.password)

      if(this.courriel==="" || this.password===""){
        toast.error('information insuffisante',{
            autoClose:3000
          });
      }
      else{
        fetch("https://garenoticket.vercel.app/auth/login",{

method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: this.courriel,
    password: this.password,
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
  //console.log('data', data)
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  //console.log("token "+ data.token)
  // localStorage.setItem("user", JSON.stringify(data.user));

  // Décodage du JWT
  const decoded = jwtDecode(data.token);


  console.log("userId", decoded.username)
  
  // this.$toasted.show('Connexion réussie', {
  //   theme: 'toasted-primary', // vous pouvez personnaliser le thème
  //   position: 'top-center',   // position du toast
  //   duration: 3000             // durée d'affichage en millisecondes
  // })

  toast.success('Message de réussite!',{
    autoClose:3000
  });
  const userStore = useUserStore();
  userStore.setUser(decoded)
  console.log("userStore",userStore.getUser().username)

  // if(decoded.isValet===true){
  //   this.$router.push({name: 'valet'});
  // }
  // else{
    this.$router.push({name: 'home'});
  //}

  
 
})
.catch((error) => {
  console.log(error);
  toast.error(`une erreur s'est produite`,{
    autoClose:3000
  });
});
      }
      },
    
  }, 

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
                      <form @submit.prevent="login">
                          
                      
                          <InputAuth type="mail" name="fCourriel " label="Courriel" v-model="courriel" />
                          <InputAuth type="password" name="password" label="Mot de passe" v-model="password" />
                         <button class="btn btn-info mt-2" type="submit">Connexion</button>
                      </form>
                      <p class="mt-3 mb-0">Vous êtes nouveau? <a class="text-info small" href="/inscription">S'inscrire</a></p>
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

/* @import 'vue3-toastify/dist/index.css'; */
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


