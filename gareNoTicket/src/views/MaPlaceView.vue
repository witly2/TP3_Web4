<template >
  <layoutGen>
    <div id="mapContainer"> </div>
        

    <div class="container-fluid row justify-center">
        <div class="map-buttons d-flex justify-content-between mx-auto shadow align-center  col-sm-12 col-md-3">
          <button class="btn bg-black fw-bold me-3 small " @click="parkCar" id="parkcarbtn" >Je laisse ma voiture</button>
          <button class="btn bg-black small fw-bold disabled" id="validationBtn" @click="recupererVoiture">J'ai recupéré ma voiture</button>
          <span @click="getPosition" class="localisation ms-2 border border-1 border-black p-1"><img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png" alt=""  style="width: 15px;"></span>
          
        </div>
        <div class="map-confirm bg-white text-center d-none col-md-6  col-sm-12 align-items-center shadow" id="map-confirm">
          <p class="fw-bold small" v-if="this.user && this.user.voiture.isMoving">Présentement, votre voiture est déplacé par un valet </p>
          <p class="fw-bold small" v-else>Veuiller vérifier que votre voiture est bien stationné à l'endroit indiqué sur la carte ou déplacer le marqueur sur la position de votre voiture <a class="ms-2 text-white small btn btn-secondary shadow " @click="confirmPosition" >Confirmé</a>  </p>
        </div>
      </div>
  </layoutGen>
</template>


<script>
import layoutGen from '../layouts/layoutGenerale.vue';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { jwtDecode } from "jwt-decode";
import {toast} from 'vue3-toastify'

export default {
  components:{
    layoutGen,
   
  },
  computed: {
          userLocastorage() {
            // console.log("user: ",localStorage.getItem("user"))
            // //store.getters('user')
            // return this.$store.state.user || {};

            const token = localStorage.getItem("token");

            if (token) {
               const storedUser=jwtDecode(token);
                return storedUser
            } else {
                return null; // ou une valeur par défaut appropriée
            }
        },

    },
  data() {
    return {
      map: null,
      latitude: 0,
      longitude: 0,
      user:null,
      marker:null
    };
  },
  async mounted() {
    await this.getUser();
    this.initMap();
    
    
    this.findUserLocation();
    this.etatVoiture()
  },
  methods: {
    initMap() {
      this.map = L.map("mapContainer").setView([this.latitude, this.longitude], 16);
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
      //  // Créez un marqueur et ajoutez-le à la carte
      //   const marker = L.marker([this.latitude, this.longitude]).addTo(this.map);

      //   // Ajoutez une popup au marqueur
      //   marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    },
    async getUser(){

      console.log("Id:",this.userLocastorage.userId)
      const userid=this.userLocastorage.userId

      await fetch(`http://localhost:3000/user/${userid}`, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('token'),
          },
          })
          .then(response => response.json())
          .then(data => {
              this.user = data.user
              console.log("usera",  this.user.voiture.isMoving)

          })
          .catch(error => {
              console.log(error);
          });

        

},
    findUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('position', position)

            const { latitude, longitude } = position.coords;

           if(this.user.voiture!=null){
              if(this.user.voiture.isParked && !this.user.voiture.isMoving){
                this.latitude = this.user.voiture.latitude;
                this.longitude = this.user.voiture.longitude;
                console.log("oui")
              }
              else{
                this.latitude = latitude;
                this.longitude = longitude;

              }
           }
           else{ //utilisateur qui n'a pas de voiture
                this.latitude = latitude;
                this.longitude = longitude;

            }
           

            this.map.setView([this.latitude, this.longitude], 13);
            this.marker= L.marker([this.latitude, this.longitude], { draggable: false }).addTo(this.map);
            this.marker.bindPopup(`<b>${this.user.username}</b><br>${this.user.voiture.marque} <br>${this.user.voiture.plaque} <br>${this.user.voiture.couleur} `).openPopup();
            this.marker.on('dragend',this.getLatlng)
          },
          (error) => {
            console.error("erreur:", error);
            if (error.code == error.PERMISSION_DENIED) {
              alert("Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.");
            }
          }
        );
      } else {
        console.error("La géolocalisation n'est pas supportée par votre navigateur.");
      }
    },
    getPosition(){
      this.map.setView([this.latitude, this.longitude], 17);
    },
    etatVoiture(){
      console.log("voitureU", this.user.voiture.isMoving)
        if( this.user.voiture.isMoving ){
              document.getElementById('parkcarbtn').classList.add('disabled')
              //document.getElementById('validationBtn').classList.remove('disabled')
              document.getElementById('map-confirm').classList.remove('d-none')

        }
        else if(this.user.voiture.isParked===true){
          document.getElementById('parkcarbtn').classList.add('disabled')
          console.log("je suis ici")
          document.getElementById('validationBtn').classList.remove('disabled')
        }
        
      },
      async parkCar(){
        //console.log("fkpfvvgd",this.latitude);
        document.getElementById('parkcarbtn').classList.add('disabled')
        //document.getElementById('validationBtn').classList.remove('disabled')
        document.getElementById('map-confirm').classList.remove('d-none')
        // console.log("larir",this.markerUser)
        //todo: dragable=true
        this.marker.dragging.enable();



      },

      async confirmPosition(){

        document.getElementById('parkcarbtn').classList.add('disabled')
        document.getElementById('validationBtn').classList.remove('disabled')
        document.getElementById('map-confirm').classList.add('d-none')

        await this.updateCar(false,this.latitude,this.longitude)
        this.marker.dragging.disable();

        // toast.success('Voiture stationnée',{
        //     autoClose:3000
        //   });

      },
      getLatlng(e){
        //console.log("e.latlng",e)
        this.latitude=e.target._latlng.lat
        this.longitude=e.target._latlng.lng
        //console.log("larir",this.latitude)

      },

      async updateCar(deplacement, lat=null, lng=null){

        let requestBody = {};
        if (deplacement) {

          requestBody = { isMoving:true,isParked:false};
          
          
        } else {

          let heureLimiteMatin = new Date();
          heureLimiteMatin.setHours(9,0,0)
          let heureLimiteMidi=new Date()
          heureLimiteMidi.setHours(13,0,0)
          heureLimiteMidi.setMinutes(30, 0);

          let now = new Date()
          let ttLeave = new Date()
          console.log("startime0",ttLeave.getHours())
        
          if(now.getHours()>=heureLimiteMatin.getHours() &&now.getHours()<=11 ){
            ttLeave.setHours(now.getHours()+1)
            console.log("startime1",ttLeave.getHours())
          }
          else if(now.getHours()>=11 &&now.getHours()<=12){
            ttLeave=heureLimiteMidi
            console.log("startime",ttLeave.getHours())
          }
          else if(now.getHours()>12 &&now.getHours()<=heureLimiteMidi.getHours()){
            ttLeave.setHours(heureLimiteMidi.getHours()+1)
            console.log("startime2",ttLeave.getHours())
          }
          else if(now.getHours()>heureLimiteMidi.getHours() &&now.getHours()<16){
            ttLeave.setHours(now.getHours()+1)
            console.log("startime3",ttLeave.getHours())
          }
          else if(now.getHours()>=16 && now.getHours()<=24){  //on passe au jour suivant
            ttLeave.setDate(now.getDate()+1);
            ttLeave.setHours(heureLimiteMatin.getHours())
            ttLeave.setMinutes(0, 0)
            console.log("startime4",ttLeave.getHours())
          
          }
          else{ // 1h - 9h
            ttLeave.setHours(heureLimiteMatin.getHours())
            console.log("startime5",ttLeave.getHours())
          }

          requestBody = { isParked:true,isMoving:false,latitude:lat,longitude:lng, timeToLeave:ttLeave };
        }

        console.log("reques",requestBody)
        await fetch(`http://localhost:3000/car/${this.user._id}`,{

            method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token'),
              },
              body: JSON.stringify( requestBody),
                
                  
            
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
                toast.success('Voiture stationnée',{
              autoClose:3000
            });
            
            })
            .catch((error) => {
              console.log(error);
            });
          },

      async recupererVoiture(){
        
        if(!this.user.voiture.isMoving){
          document.getElementById('parkcarbtn').classList.remove('disabled')
        document.getElementById('validationBtn').classList.add('disabled')

        //requête dans l'api

        await fetch(`http://localhost:3000/car/${this.user._id}`,{

          method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            body: JSON.stringify( {
              isParked:false,
              isMoving:false,
              latitude:undefined,
              logitude:undefined,
              timeToLeave:undefined
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
              toast.success('Voiture récupérer',{
            autoClose:3000
          });

          })
          .catch((error) => {
            console.log(error);
          });
        }
        else{
          document.getElementById('parkcarbtn').classList.add('disabled')
          document.getElementById('map-confirm').classList.remove('d-none')
        }
        
      }
  }
}
</script>
<style lang="scss">
#mapContainer {
  width: 100%;
  height: 90vh;
  position: relative;
  z-index: 50;
}


  
.map-buttons {
  position: absolute;
  bottom: 100px;
  z-index: 100;

  padding: 10px;
  border-radius: 5px; 
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);  */
}

.map-confirm {
    position: absolute;
    bottom: 20px;
    z-index: 100;
  
    padding: 10px;
    border-radius: 5px; 
    max-height: 60vh; /* Ajustez cette valeur en fonction de vos besoins */
    overflow-y: auto;
  
  }

@media (min-width: 750px) {
  .map-buttons{
     left: 50%;
      transform: translateX(-50%);
  }
}




</style>
