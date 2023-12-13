<template >
    <layoutGen>
      <div id="mapContainer"> </div>
          
  
      <div class="container-fluid row justify-center">
        <div class="map-buttons d-flex justify-content-between mx-auto shadow align-center  col-sm-12 col-md-3">
          <button class="btn bg-black fw-bold me-3 small " @click="parkCar" id="parkcarbtn" >Je déplace la voiture</button>
          <button class="btn bg-black small fw-bold disabled" id="validationBtn" @click="confirmPosition">Validation de destinatiopn</button>
          <span @click="getPosition" class="localisation ms-2 border border-1 border-black p-1"><img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png" alt=""  style="width: 15px;"></span>
          
        </div>
        <div class="map-confirm bg-white text-center d-none col-md-6  col-sm-12 align-items-center shadow" id="map-confirm">
          <p class="fw-bold small">Vérifier la position de la voiture ou déplacer le marqueur rouge pour corriger puis valider le stationement </p>
        </div>
      </div>
    </layoutGen>
  </template>
  
  
  <script>
  import layoutGen from '../layouts/layoutGenerale.vue';
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import {toast} from 'vue3-toastify'

  
  export default {
    components:{
      layoutGen,
     
    },
 
    data() {
      return {
        map: null,
        latitude: 0,
        longitude: 0,
        latitudeUser: 0,
        longitudeUser: 0,
        user:null,
        makerVal:null,
        markerUser:null,
      };
    },
    async mounted() {
      this.initMap();
      await this.getUser()
     
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
      findUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('position', position)
  
              const { latitude, longitude } = position.coords;
              

              //this.map.setView([latitude, longitude], 13);
              let valetIcon = this.getIcon('red')
              this.markerVal=L.marker([latitude, longitude], { draggable: true,icon:valetIcon }).addTo(this.map);
              this.markerVal.bindPopup(`Vous êtes ici`).openPopup();
              
              if(this.user){
                this.latitude = this.user.voiture.latitude;
                this.longitude = this.user.voiture.longitude;
                console.log("oui",this.longitude)

                this.map.setView([this.latitude, this.longitude], 16);
               if(!this.user.voiture.isMoving){
                  this.markerUser= L.marker([this.latitude, this.longitude], { draggable: false }).addTo(this.map);
                  this.markerUser.bindPopup(`<b>${this.user.username}</b><br>${this.user.voiture.marque} <br>${this.user.voiture.plaque} <br>${this.user.voiture.couleur} `).openPopup();
               }
               
              }
              this.markerVal.on('dragend',this.getLatlng)
             
  
              
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

      async getUser(){

        console.log("Id:",this.$route.params.id)

        
        await fetch(`http://localhost:3000/user/${this.$route.params.id}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                this.user = data.user
                console.log("usera",  this.user)

            })
            .catch(error => {
                console.log(error);
            });

           

      },

      etatVoiture(){
        if(!this.user.isValet && this.user.voiture.isMoving){
              document.getElementById('parkcarbtn').classList.add('disabled')
              document.getElementById('validationBtn').classList.remove('disabled')
              document.getElementById('map-confirm').classList.remove('d-none')
              
              // this.map.removeLayer(this.markerUser)
              // this.markerUser=null

            }
      },

      getPosition(){
        //this.map.setView([this.user.voiture.latitude, this.user.voiture.longitude], 17);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.map.setView([latitude, longitude], 17);
             //L.marker([this.latitude, this.longitude], { draggable: false }).addTo(this.map);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            // Gérer les erreurs ici
          }
        );
      },
      getLatlng(e){
        //console.log("e.latlng",e)
        this.latitude=e.target._latlng.lat
        this.longitude=e.target._latlng.lng
        //console.log("larir",this.latitude)

      },
      async parkCar(){
        //console.log("fkpfvvgd",this.latitude);
        document.getElementById('parkcarbtn').classList.add('disabled')
        document.getElementById('validationBtn').classList.remove('disabled')
        document.getElementById('map-confirm').classList.remove('d-none')
        // console.log("larir",this.markerUser)

         this.map.removeLayer(this.markerUser)
         this.markerUser=null
         //this.user.voiture.isMoving=false

       await this.updateCar(true)
      
        console.log("Move",this.user.voiture.isMoving)


      },

      async confirmPosition(){

        document.getElementById('parkcarbtn').classList.remove('disabled')
        document.getElementById('validationBtn').classList.add('disabled')
        document.getElementById('map-confirm').classList.add('d-none')

        await this.updateCar(false,this.latitude,this.longitude)

       
        toast.success('Voiture stationnée',{
            autoClose:3000
          });

      },
      getIcon(couleur) {
        return new L.Icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${couleur}.png`,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
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
          console.log("startime4",ttLeave.getHours())
         
        }
        else{ // 1h - 9h
          ttLeave.setHours(heureLimiteMatin.getHours())
          console.log("startime5",ttLeave.getHours())
        }

        requestBody = { isParked:true,isMoving:false,latitude:lat,longitude:lng, timeToLeave:ttLeave };
      }

      console.log("reques",requestBody)
      await fetch(`http://localhost:3000/car/${this.$route.params.id}`,{

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
           
          })
          .catch((error) => {
            console.log(error);
          });
      }
      
    }
  }
  </script>
  <style lang="scss" >
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
    /* left: 50%;
    transform: translateX(-50%); */
  
    /* background-color: white;  */
    padding: 10px;
    border-radius: 5px; 
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);  */
  }
  .map-confirm {
    position: absolute;
    bottom: 40px;
    z-index: 100;
    /* left: 50%;
    transform: translateX(-50%); */
  
    /* background-color: white;  */
    padding: 10px;
    border-radius: 5px; 
    max-height: 60vh; /* Ajustez cette valeur en fonction de vos besoins */
    overflow-y: auto;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);  */

    // p{
    //   font-size: 2vw;
    // }
  }
  
  @media (min-width: 750px) {
    .map-buttons{
       left: 50%;
        transform: translateX(-50%);
    }
  }
  .localisation{
    cursor: pointer;
  }
  
  </style>
  