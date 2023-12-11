<template >
    <layoutGen>
      <div class="map-container ">

        <button class="btn btn-primary toggle-button" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Tableau de voiture</button>

        <div id="mapContainer"> </div>

        <div class="offcanvas offcanvas-bottom tableau" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Voitires à déplacer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                            Nom
                            </th>
                            <th class="text-left">
                            Marque
                            </th>
                            <th class="text-left">
                            Modèle
                            </th>
                            <th class="text-left">
                            Plaque
                            </th>
                            <th class="text-left">
                            Couleur
                            </th>

                            <th class="text-left">
                            Temps restant
                            </th>

                            <th class="text-left">
                            
                            </th>
                            <th class="text-left">
                            
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                      <tr v-for="(user,index) in this.users" :key="user.username">

                        <td>{{ user.username }}</td>
                        <td>{{ user.voiture.marque }}</td>
                        <td>{{ user.voiture.modele }}</td>
                        <td>{{ user.voiture.plaque }}</td>
                        <td>{{ user.voiture.couleur }}</td>
                        <td>{{ user.voiture.timestamps }}</td>
                        <td @click="getPosition(user)"><img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png" alt=""  style="width: 15px;"></td>
                        <td><a :href="'/movecar/'+ user._id"><img src="https://img.freepik.com/vecteurs-premium/icone-voiture-icone-vehicule-icone-vecteur-voiture_564974-1452.jpg" alt="" style="width: 30px;"></a></td>


                        



                      </tr>
                           
               
                    </tbody>
                    

                </v-table>
          </div>
        </div>

       

        <!-- <div class="container-fluid">
          <div class="map-buttons d-flex justify-content-between mx-auto shadow">
            <button class="btn btn-primary me-3 " @click="findUserLocation">Je laisse ma voiture</button>
            <button class="btn btn-secondary disabled">J'ai recupéré ma voiture</button>
          </div>
        </div> -->

      </div>

    </layoutGen>
  </template>
  
  
  <script>
  import layoutGen from '../layouts/layoutGenerale.vue';
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { jwtDecode } from "jwt-decode";
  
  
  
  export default {
    components:{
      layoutGen,
     
    },
    computed: {
          user() {
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
        showHiddenDiv: false,
        users:null
      };
    },
    async mounted() {
      await this.getVoitureValet();

      this.initMap();
      this.findUserLocation();
      
    },
    methods: {

      toggleHiddenDiv() {
      // Toggle the visibility of the hidden div
      this.showHiddenDiv = !this.showHiddenDiv;
      },

      initMap() {
        this.map = L.map("mapContainer").setView([this.latitude, this.longitude], 16);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        
      },
      getPosition(user){
        this.map.setView([user.voiture.latitude, user.voiture.longitude], 13);
      },

      findUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              //console.log('position', position)
  
              const { latitude, longitude } = position.coords;
              this.latitude = latitude;
              this.longitude = longitude;

              this.map.setView([latitude, longitude], 13);
              let valetIcon = this.getIcon('red')
              var marker=L.marker([latitude, longitude], { draggable: true,icon:valetIcon }).addTo(this.map);
               marker.bindPopup(`Vous êtes ici`).openPopup();

             if(this.users!=null){
              console.log("userssd",this.user)
              this.users.forEach(user => {
              console.log("marque", user.voiture.marque);

              let markers = L.marker([user.voiture.latitude, user.voiture.longitude], { draggable: false }).addTo(this.map);
              markers.bindPopup(`<b>${user.username}</b><br>${user.voiture.marque} <br>${user.voiture.plaque} <br>${user.voiture.couleur} `).openPopup();
              });
             }
  
             
             
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
      async getVoitureValet(){

        await fetch(`http://localhost:3000/users/`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                this.users = data.users
                console.log("users",  this.users)

            })
            .catch(error => {
                console.log(error);
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
      }
  
    },
    
  }
  </script>
  <style lang="scss">

.map-container {
  position: relative;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}







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
    left: 50%;
    transform: translateX(-50%); 
  
    background-color: white; 
    padding: 10px;
    border-radius: 5px; 
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);  */
  }
  
  @media (max-width: 750px) {
    .map-buttons{
       left: 50%;
      transform: translateX(-50%);
    }


  }
  
  
  </style>
  