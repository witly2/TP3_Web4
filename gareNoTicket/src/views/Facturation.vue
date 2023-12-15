<!-- eslint-disable vue/multi-word-component-names -->
<template >
   <layoutGen>
    <div class="container mh py-5 my-5 ">
        <div class="shadow d-flex p-3 justify-content-around scroll">
            <p class="my-auto">Total à payer: <span class="text-white fs-bold my-auto rounded-5 px-3 py-2 bg-info">{{ this.Total }}$</span></p> 
            <a class="btn btn-info text-white fs-bold" id="payer" @click="paid">Payer</a>
        </div>
        <h5 class="pt-3"><strong>Historique des factures</strong></h5>

        <div class="hist shadow card" v-if="factures">
            <!-- <div v-for="item in items" :key="item.id">
                {{ item.name }} 
            </div> -->

            <!-- <v-data-table :items="factures" :headers="headerFacture" class="scrollspy-example" ></v-data-table> -->
            <v-infinite-scroll :height="300" :items="factures" :headers="headerFacture" :onLoad="load">

                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                            Date
                            </th>
                            <th class="text-left">
                            Montant
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="(item, index) in factures"
                            :key="item.name"
                            :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : ''], my-3"
                        >
                            <td >{{ item.createdAt }}</td>
                            <td>{{ item.price }}</td>
                        </tr>
                    </tbody>
                    

                </v-table>



            </v-infinite-scroll>
       
        </div>
        <div v-else> </div>
        <p><strong>Historique des déplacements</strong></p>

        <div class="hist shadow card">
            <v-data-table :items="historiques" :headers="headerDep">
                <template v-slot:item.isPaid="{ item }">
                    {{ item.isPaid ? 'Oui' : 'Non' }}
                </template>
            </v-data-table>
                     

           
        </div>
    </div>
   </layoutGen>
</template>
<script>

import layoutGen from '../layouts/layoutGenerale.vue';
import {toast} from 'vue3-toastify'
//import { jwtDecode } from "jwt-decode";

export default {
    components:{
        layoutGen,

    
    },
    data(){
       
        // const items = [
        //     {
        //         id: 1,
        //         name: {
        //             first: 'John',
        //             last: 'Doe',
        //         },
        //     }
        // ],
        // headers = [
        //     { title: 'First Name', value: 'name.first' },
        //     { title: 'Last Name', key: 'name.last' },
        //     {
        //         title: 'Full Name',
        //         key: 'fullName',
        //         value: item => `${item.name.first} ${item.name.last}`,
        //     },
        // ]

        return {factures:
        [],
        historiques:[]
        , headerFacture: [
            { title: 'Date', value: 'createdAt' },
            { title: 'Montant', key: 'price' },
         
        ],
        headerDep:[
            { title: 'Date', value: 'createdAt' },
            { title: 'Montant', key: 'price' },
            { title: 'Payé', key: 'isPaid' },
        ],page:1,
        Total:0,
    }
         
        
        
    },
    methods:{
        async getFacture(){
            
            await fetch("https://garenoticket.vercel.app/facture/", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                this.factures = data.factures
                console.log("data", this.factures)

            })
            .catch(error => {
                console.log(error);
            });
        },

        async getHistorique(){
            
            await fetch("https://garenoticket.vercel.app/historique/", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                this.historiques = data.histo
                console.log("data", data)

            })
            .catch(error => {
                console.log(error);
            });
        },

        getMontantTotal(){

            for(const histo of this.historiques){
                if(!histo.isPaid){
                    this.Total += histo.price
                }
            }

            if (this.Total === 0) {
                document.getElementById("payer").classList.add("disabled");
    }

        },

        async paid(){

            await fetch("https://garenoticket.vercel.app/effectuerPaiement/", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('token'),
            },
            })
            .then(response => response.json())
            .then(data => {
                toast.success(data.message,{
                    autoClose:3000
                });
                console.log("data", data.facture)
               

            })
            .catch(error => {
                toast.error(error,{
            autoClose:3000
          });
                console.log(error);
            });

            await this.getFacture();
            await this.getHistorique();
            this.getMontantTotal();

        },
       
         async  load ({ done }) {
            setTimeout(() => {
            this.items.push(...Array.from({ length: 10 }, (k, v) => v + this.getFacture.at(-1) + 1))

            done('ok')
            }, 1000)
        },
    


        },
    async created() {
       await this.getFacture()
       await this.getHistorique()
       await this.getMontantTotal()
       

    //    if(this.Total===0){
    //     document.getElementById("payer").classList.add("disabled")
    //    }
        
    },

    computed:{
        
      
    }
}
</script>

<style >
    .mh{
        min-height: 90vh;
    }

    /* .hist{
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.3);
    } */
</style>