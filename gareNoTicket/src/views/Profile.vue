<!-- eslint-disable vue/multi-word-component-names -->
<script>

import layoutGen from '../layouts/layoutGenerale.vue';
//import { jwtDecode } from "jwt-decode";
import InputAuth from '../components/InputAuth.vue';
import {toast} from 'vue3-toastify'

//import {mapState} from 'vuex'
//import store from '../Store';

//const user = this.$store.state.user

export default {
    
    components:{
        layoutGen,
        InputAuth,
    
    },
    
    data() {
        return {
            user:null,
            plaque: '',
            marque: '',
            modele: '',
            couleur: '',
            error:"",
                
        };
    },
    methods:{
       async getUser(){
            
            await fetch("https://garenoticket.vercel.app/user/", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                this.user = data.user
                console.log("data", this.user)

            })
            .catch(error => {
                console.log(error);
            });
        },
        createVoitureForm() {
            const formContainer = document.getElementById('voiture');

            const form = this.$createElement('div', [
                this.$createElement('p', { style: 'font-weight: bold;' }, 'Ajouter une voiture'),
                this.$createElement('InputAuth', { props: { type: 'text', name: 'matricule', label: 'Immatriculation', value: this.matricule } }),
                this.$createElement('InputAuth', { props: { type: 'text', name: 'fMarque', label: 'Marque', value: this.marque } }),
                this.$createElement('InputAuth', { props: { type: 'text', name: 'modele', label: 'Modèle', value: this.modele } }),
                this.$createElement('InputAuth', { props: { type: 'text', name: 'couleur', label: 'Couleur', value: this.couleur } })
        ]);

  

  // Ajouter le formulaire au DOM
  formContainer.appendChild(form.$el);
        },
       async creerVoiture(){

            console.log('marque', this.marque)
            console.log('plaque', this.plaque)
            let formMarque, formPlaque, formModel, formCouleur, valet;

            
            if(this.user.voiture===null || this.user.voiture===undefined){
                formMarque=this.marque;
                formCouleur=this.couleur;
                formPlaque=this.plaque;
                formModel=this.modele;
                valet="650dbef77bc86e471e5c0af6"
            }
            else{
                formMarque=this.user.voiture.marque;
                formCouleur=this.user.voiture.couleur;
                formPlaque=this.user.voiture.plaque;
                formModel=this.user.voiture.modele;
                valet=this.user.voiture.valet;
            }

            console.log('formMarque', formMarque)

            if ( formMarque!=="" && ! formCouleur!=="" && formPlaque!=="" && formModel!=="") {
                console.log('marque dedans')

                await fetch(`https://garenoticket.vercel.app/car/${this.user._id}`,{

                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
                body: JSON.stringify( {
                marque:formMarque,
                modele:formModel,
                couleur:formCouleur,
                plaque:formPlaque,
                valet:valet
                }),
                    
                    

                })
                .then((response) => {
                if (response.status === 200) {
                    let data= response.json();
                    console.log('data', data)
                     
                    if(this.user.voiture===null){
                    toast.success('Voiture créer avec succès',{
                        autoClose:3000
                    });
                   }


                } else {
                    throw new Error("Erreur !");
                    
                }
                })
                // .then((data) => {
                // console.log('data', data)

                // })
                .catch((error) => {
                console.log("erreur",error);

                toast.error(error,{
                    autoClose:3000
                });
               
                });

            }
            else{
                console.log('marque dehors')
                 
               if(this.user.voiture===null){
                toast.error('Données Manquantes',{
                    autoClose:3000
                });
               }

            }


      
        },
        async updateUser(){
            let prices=0;
            if(this.user.isValet){
                prices=this.user.price
            }

            if(this.user.username!==""&&this.user.email!=="" && this.user.voiture.plaque!=="" 
            && this.user.voiture.modele!=="" && this.user.voiture.couleur!=="" && this.user.voiture.marque!==""){

              if(!this.user.voiture.isMoving){

                this.error=""

                await this.creerVoiture();
            await fetch(`https://garenoticket.vercel.app/user/${this.user._id}`,{

                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
                body: JSON.stringify( {
                    username:this.user.username,
                    email:this.user.email,
                    price:prices

                }),
                    
                    

                })
                .then((response) => {
                if (response.status === 200) {
                    let data= response.json();
                    console.log('data', data)
                    
                    toast.success('Modification effectuée',{
                        autoClose:3000
                    });


                } else {
                    throw new Error("Erreur !");
                    
                }
                })
                // .then((data) => {
                // console.log('data', data)

                // })
                .catch((error) => {
                console.log("erreur",error);
                });

              }else{
                // toast.error('votre voiture est en co',{
                //     autoClose:3000
                // });
                document.getElementById("erreur").classList.remove("d-none")
                this.error="Mise à jour impossible, car un valet déplace votre voiture"
              }
            }
            else{
                toast.error('Données Manquantes',{
                    autoClose:3000
                });
            }
           
                        },
        deleteVoiture(){
       
            document.getElementById("btnAL").classList.add("disabled");
            document.getElementById("deletevoiture").classList.add("disabled");
            document.getElementById("deleteConfirmation").classList.remove("d-none");

        },
        AnnulerDelete(){
            document.getElementById("btnAL").classList.remove("disabled");
            document.getElementById("deletevoiture").classList.remove("disabled");
            document.getElementById("deleteConfirmation").classList.add("d-none");
        },
        async confirmDelete(){

            console.log("userVoiuy", this.user)
           if(!this.user.voiture.isMoving){
            await fetch(`https://garenoticket.vercel.app/user/`,{

                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                },
                })
                .then((response) => {
                if (response.status === 204) {
                    let data= response.json();
                    console.log('data', data)
                    
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                   
                    toast.success('Votre compte è été supprimé avec succès',{
                        autoClose:3000
                    });

                    this.$router.push({name: 'login'});

                } else {
                    throw new Error("Erreur !");
                    
                }
                })

                .catch((error) => {
                console.log("erreur",error);



                });
           }
           else{
            this.error="Opération impossible, car un valet déplace votre voiture"
            toast.error('Votre voiture est en cour de déplacement',{
                        autoClose:3000
                    });
           }

        }
        

    },
    async created() {
    
            await this.getUser();
                console.log("user", this.user.username);
            
        },
        // Mon userSession
        computed: {
            // user() {
            //     // console.log("user: ",localStorage.getItem("user"))
            //     // //store.getters('user')
            //     // return this.$store.state.user || {};

            //     const token = localStorage.getItem("token");

            //     if (token) {
            //        const storedUser=jwtDecode(token);
            //     //    this.infos = [
            //     //         { id: 'Pseudo', valeur: storedUser?.username },
            //     //         { id: 'Email', valeur: storedUser?.email },
            //     //     ];
            //         return storedUser
            //     } else {
            //         return null; // ou une valeur par défaut appropriée
            //     }
            // },
            

        },
    
  

   

}


</script>


<template >
<layoutGen>
    <div class="profile my-auto">
        
        <div class="  mx-auto info my-5  p-5 ">
            <div class="bg-danger w-100 text-center mt-4 py-2 fw-bold text-white small d-none" id="erreur">{{ this.error }}</div>
            <h5 class="text-center">Profil</h5>
            <div class=" pof shadow card mx-auto flex-wrap">
                <div class="   col-sm-12 w-lg-75 w-xl-50 p-3">
                    <p v-if="this.user && this.user.voiture!=null"><strong>Informations personnelles </strong></p>
                    <InputAuth type="mail" name="fCourriel " label="Courriel" v-model="user.email"  v-if="this.user.isValet || this.user.voiture!=null"/>
                        <InputAuth type="text" name="username" label="pseudo" v-model="user.username" v-if="this.user.isValet || this.user.voiture!=null"/>

                         <div v-if="!this.user.isValet && this.user.voiture!=null"   >
                            <p><strong>Voiture</strong></p>
                            <InputAuth type="text" name="matricule" label="Imatriculation" v-model="user.voiture.plaque" />
                            <InputAuth type="text" name="fMarque " label="Marque" v-model="user.voiture.marque" />
                            <InputAuth type="text" name="modele" label="Modèle" v-model="user.voiture.modele" />
                            <InputAuth type="text" name="couleur" label="Couleur" v-model="user.voiture.couleur" />
                        </div>
                        
                        <div v-if="this.user.voiture == null && !this.user.isValet" id="voiture">
                            <p><strong>Ajouter une voiture</strong></p>
                            <InputAuth type="text" name="matricule" label="Immatriculation" v-model="plaque" />
                            <InputAuth type="text" name="fMarque" label="Marque" v-model="marque" />
                            <InputAuth type="text" name="modele" label="Modèle" v-model="modele" />
                            <InputAuth type="text" name="couleur" label="Couleur" v-model="couleur" />

                            <!-- <button class="btn btn-info mt-2" type="submit" @click="createVoitureForm">Ajouter une voiture</button> -->
                        </div>

                        <div v-if="this.user.isValet" >
                            <InputAuth type="number" name="fNumber " label="Tarif" v-model="user.price" />
                        </div>

                        
                        <div d-flex justify-content-between>
                            <button class="btn btn-info mt-2" id="btnAL" @click="updateUser" v-if="this.user.voiture!=null || user.isValet">Soumettre</button>
                            <button class="btn btn-info mt-2" id="btnAl"  @click="creerVoiture" v-else>Ajouter</button>
                            <button class="btn btn-danger mt-2 ms-3" id="deletevoiture" @click="deleteVoiture" >Supprimer</button>
                        </div>

                        <div class="shadow my-3  text-center d-none  py-2" id="deleteConfirmation">
                            <p class="small fw-bold"> Ce compte doit être définitivement supprimer.  </p>
                            <div class="d-flex mx-auto">
                                <a class="ms-2 text-black small btn fw-bold shadow " @click="confirmDelete" >Confirmé</a>
                                <a class="ms-2 text-black small btn btn-secondary fw-bold shadow " @click="AnnulerDelete" >annulé</a>
                            </div>
                        </div>

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
    /* box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3); */
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