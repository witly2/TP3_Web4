<!-- eslint-disable vue/multi-word-component-names -->
<script>

import layoutGen from '../layouts/layoutGenerale.vue';
import { jwtDecode } from "jwt-decode";
import InputAuth from '../components/InputAuth.vue';
//import {mapState} from 'vuex'
//import store from '../Store';

//const user = this.$store.state.user

export default {
    
    components:{
        layoutGen,
        InputAuth,
    
    },
    // data() {
    //     return {
    //         user:{}
                
    //     };
    // },
    // created () {
    //     this.getUser()
    //     console.log("user", this.user.username)
    // },
    // Mon userSession
    computed: {
        user() {
            // console.log("user: ",localStorage.getItem("user"))
            // //store.getters('user')
            // return this.$store.state.user || {};

            const token = localStorage.getItem("token");

            if (token) {
               const storedUser=jwtDecode(token);
            //    this.infos = [
            //         { id: 'Pseudo', valeur: storedUser?.username },
            //         { id: 'Email', valeur: storedUser?.email },
            //     ];
                return storedUser
            } else {
                return null; // ou une valeur par défaut appropriée
            }
        },
        

    },
    
    // methods:{
    //     getUser(){
            
    //         fetch("http://localhost:3000/user/", {
    //         method: "GET",
    //         headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": "Bearer " + localStorage.getItem('token'),
    //     },
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     this.user = data
    //     console.log("data",data)
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    //     }
    // }

   

}


</script>


<template >
<layoutGen>
    <div class="profile my-auto">
        <div class="  mx-auto info my-5  p-3 ">
            <h5>Profil</h5>
            <div class=" pof  mx-3 flex-wrap">
                <div class="   col-sm-12 w-lg-75 w-xl-50 p-3">
                    <p><strong>Informations personnelles</strong></p>
                    <form>
                        <!-- <div v-for="(info, index) in infos" :key="index">
                        </div> -->

                        <InputAuth type="mail" name="fCourriel " label="Courriel" v-model="user.email" />
                        <InputAuth type="text" name="username" label="pseudo" v-model="user.username" />

                         <div v-if="!user.isValet"   >
                            <p><strong>Voiture</strong></p>
                            <InputAuth type="text" name="matricule" label="Imatriculation" v-model="user.voiture.plaque" />
                            <InputAuth type="text" name="fMarque " label="Marque" v-model="user.voiture.marque" />
                            <InputAuth type="text" name="modele" label="Modèle" v-model="user.voiture.modele" />
                            <InputAuth type="text" name="couleur" label="Couleur" v-model="user.voiture.couleur" />
                        </div>

                        <div v-else >
                            <InputAuth type="number" name="fNumber " label="Tarif" v-model="user.price" />
                        </div>
                        <button class="btn btn-info mt-2" type="submit">Soumettre</button>

                    </form>
                </div>

               
           
            </div>
            
        </div>

    </div>
</layoutGen>
</template>

<style>
.profile{
    min-height: 90vh;
    
}

.info{
    
    /* background-color: #3498db; */
    /* min-height: 400px; */
    width: 50%;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3);
}

.pof{
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3);
    width: 50%;
}

@media (max-width: 500px) {
  .pof {
    width: 100%;
  }
  .info{
    width: 90%;
  }
}

@media (min-width: 500px) and (max-width: 1000px) {
  .pof {
    width: 75%;
  }
  .info{
    width: 75%;
  }
}

</style>