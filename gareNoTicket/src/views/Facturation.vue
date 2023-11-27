<!-- eslint-disable vue/multi-word-component-names -->
<template >
   <layoutGen>
    <div class="container mh py-5 ">
        <div class="shadow d-flex p-3 justify-content-around ">
            <p class="my-auto">Total à payer: <span class="text-white fs-bold my-auto rounded-5 px-3 py-2 bg-info">30$</span></p> 
            <a class="btn btn-info text-white fs-bold" type="submit">Payer</a>
        </div>
        <p><strong>Historique des factures</strong></p>

        <div class="hist shadow card">
            <v-data-table :items="items"></v-data-table>
            <!-- <b-table :items="items" :fields="fields"></b-table> -->
        </div>
        <p><strong>Historique des déplacements</strong></p>

        <div class="hist shadow card">

        </div>
    </div>
   </layoutGen>
</template>
<script>

import layoutGen from '../layouts/layoutGenerale.vue';
//import { jwtDecode } from "jwt-decode";

export default {
    components:{
        layoutGen,

    
    },
    created() {
        const items = this.items
        console.log("Items: ",items );
    },

    computed:{
        items() {
            const items=[
                {
                    name: 'African Elephant',
                    species: 'Loxodonta africana',
                    diet: 'Herbivore',
                    habitat: 'Savanna, Forests',
                },
            // ... more items
            ];
            return items
        },
    }
}
</script>

<!-- <script setup>
import layoutGen from '../layouts/layoutGenerale.vue';
  const items = [
    {
      name: 'African Elephant',
      species: 'Loxodonta africana',
      diet: 'Herbivore',
      habitat: 'Savanna, Forests',
    },
    // ... more items
  ]
</script> -->
<style >
    .mh{
        min-height: 90vh;
    }

    /* .hist{
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3);
    } */
</style>