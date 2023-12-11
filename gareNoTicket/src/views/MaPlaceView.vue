<template >
  <layoutGen>
    <div id="mapContainer"> </div>
        

    <div class="container-fluid">
      <div class="map-buttons d-flex justify-content-between mx-auto shadow">
        <button class="btn btn-primary me-3 " @click="findUserLocation">Je laisse ma voiture</button>
        <button class="btn btn-secondary disabled">J'ai recupéré ma voiture</button>
      </div>
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
    };
  },
  async mounted() {
    this.initMap();
    this.findUserLocation();
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

            if(this.user.voiture.latitude && this.user.voiture.longitude){
              this.latitude = this.user.voiture.latitude;
              this.longitude = this.user.voiture.longitude;
              console.log("oui")
            }
            else{
              this.latitude = latitude;
              this.longitude = longitude;

            }
           

            this.map.setView([latitude, longitude], 13);
            var marker= L.marker([latitude, longitude], { draggable: true }).addTo(this.map);
            marker.bindPopup(`<b>${this.user.username}</b><br>${this.user.voiture.marque} <br>${this.user.voiture.plaque} <br>${this.user.voiture.couleur} `).openPopup();
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
  }
}
</script>
<style >
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

  background-color: white; 
  padding: 10px;
  border-radius: 5px; 
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);  */
}

@media (min-width: 750px) {
  .map-buttons{
     left: 50%;
      transform: translateX(-50%);
  }
}


</style>
