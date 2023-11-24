<!-- eslint-disable vue/multi-word-component-names -->
<template >
<layoutGen>
    <div class="page" style="min-height: 100%;">
    <section class="clean-block about-us">
     
        <div class="row" style="margin-right: 0px;margin-left: 0px;">
            <div class="col  text-center">
                <h2 class="text-info ">Nombre Completo</h2>
            </div>
        </div>
        <div class="row justify-content-center" style="margin-right: 0px;margin-left: 0px;">
            <div class="col-sm-6 col-lg-4" style="padding-right: 0px;padding-left: 0px;">
                <div class="card clean-card"><img class="card-img-top w-100 d-block" src="https://avatar.iran.liara.run/public/[ID]" />
                    <div class="card-body info">
                        <div class="row" style="margin-top: -24px;">
                            <div class="col-md-12" style="margin-top: 22px;">
                                <div class="row">
                                    <div class="col">
                                        <p class="labels"><strong>{{user.username}}</strong></p>
                                    </div>
                                    <div class="col">
                                        <p class="labels">usuarioPrueba</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p class="labels"><strong>Teléfono</strong></p>
                                    </div>
                                    <div class="col">
                                        <p class="labels">6622971893</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p class="labels"><strong>País</strong></p>
                                    </div>
                                    <div class="col">
                                        <p class="labels">México</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p class="labels"><strong>Estado</strong></p>
                                    </div>
                                    <div class="col">
                                        <p class="labels">Sonora</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <p class="labels"><strong>Ciudad</strong></p>
                                    </div>
                                    <div class="col">
                                        <p class="labels">Hermosillo</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12"><a class="btn btn-success" role="button" href="editProfile.html"><i class="fas fa-pencil-alt"></i> Editar</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</layoutGen>
</template>
<script>
import layoutGen from '../layouts/layoutGenerale.vue';
import { jwtDecode } from "jwt-decode";
//import {mapState} from 'vuex'
//import store from '../Store';

//const user = this.$store.state.user

export default {
    
    components:{
        layoutGen,
    
    },



    created() {
        console.log('Component created. User:', this.$store.state.user);
    },

    // Mon userSession
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

   

}
</script>
<style scoped>
  


.clean-block {
  padding-bottom: 50px;
}

@media (min-width:576px) {
  .clean-block {
    padding-bottom: 100px;
  }
}

.card {
    font-weight: 400;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.card-body {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
}
</style>