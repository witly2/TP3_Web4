<!-- eslint-disable vue/multi-word-component-names -->

<template lang="">
<header>
    <nav class="navbar navbar-light navbar-expand-md navbar-fixed-top navigation-clean-button" style="background: rgb(34, 34, 34);border-radius: 20;border-top-left-radius: 20;border-top-right-radius: 20;border-bottom-right-radius: 20;border-bottom-left-radius: 20;border-style: none;padding-top: 0;padding-bottom: 10px;">
    <div class="container"><button class="navbar-toggler bg-white" data-bs-toggle="collapse" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
        <div><a class="navbar-brand" href="/"><span>GareNoTicket </span></a></div>
        <div id="navcol-1" class="collapse navbar-collapse" style="color: rgb(255,255,255);">
            <ul class="navbar-nav nav-right">
                <li v-if="!this.user.isValet" class="nav-item"><a class="nav-link active" href="/" style="color: rgba(224,217,217,0.9);">Ma Place </a></li>
                <li class="nav-item"><a class="nav-link active" href="/profil" style="color: rgba(224,217,217,0.9);">Profil </a></li>
                <!-- <li class="nav-item dropdown"><a class="dropdown-toggle nav-link" aria-expanded="false" data-bs-toggle="dropdown" href="#" style="color: rgba(224,217,217,0.9);">Services </a>
                    <div class="dropdown-menu"><a class="dropdown-item" href="services.html">Price Packages</a><a class="dropdown-item" href="#">Order Services</a><a class="dropdown-item" href="#">Custom Request</a></div>
                </li> -->
                <li v-if="!this.user.isValet" class="nav-item"><a class="nav-link" href="/transaction" style="color: rgba(224,217,217,0.9);">Transaction </a></li>
                <!-- <li class="nav-item"><a class="nav-link" href="faq.html" style="color: rgba(224,217,217,0.9);">faq </a></li>
                <li class="nav-item"><a class="nav-link" href="contact.html" style="color: rgba(224,217,217,0.9);">contact </a></li> -->
            </ul>
            <div class="ms-auto navbar-text actions">
                
                <a class="btn btn-light action-button" role="button" href="#" @click="logout" style="color: rgba(0,0,0,0.9);background: var(--bs-gray-200);border-radius: 10px;border-style: solid;border-color: rgba(0,0,0,0.9);font-size: 16px;padding: 5px 8px;">Déconnexion</a>
            </div>
            
        </div>
    </div>
</nav>
</header>
</template>
<script>
export default {

  computed: {
  user() {
      const userData = localStorage.getItem('user');

    
      const userObject = JSON.parse(userData);
    return userObject;
  },
},
created(){
  console.log("user",this.user)
},
  methods:{
    logout(){
      // Supprimer le token d'authentification du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$store.commit('clearUser');
    }
  }
    
}
</script>
<style>
  .navigation-clean-search .action-button, .navigation-clean-button .action-button:active {
  background: #56c6c6;
  border-radius: 20px;
  font-size: inherit;
  color: #fff !important;
  box-shadow: none;
  border: none;
  text-shadow: none;
  padding: 8px 20px;
  transition: background-color 0.25s;
}

.navigation-clean-button {
  background: #222222;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #f2f5f8;
  border-radius: 0;
  box-shadow: none;
  border: none;
  margin-bottom: 0;
}

@media (max-width:767px) {
  .navigation-clean-button {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.navigation-clean-button .navbar-brand {
  font-weight: bold;
  color: inherit;
}

.navigation-clean-button .navbar-brand:hover {
  color: #1485ee;
}

.navigation-clean-button .navbar-collapse, .navigation-clean-button .navbar-form {
  border-top-color: #ddd;
}

.navigation-clean-button.navbar .navbar-nav > li > a {
  padding-left: 18px;
  padding-right: 18px;
}

.navigation-clean-button .navbar-nav > li > .dropdown-menu {
  margin-top: -5px;
  box-shadow: 0 4px 8px rgba(0,0,0,.1);
  background-color: #222222;
  border-radius: 2px;
}

.navigation-clean-button .actions {
  margin-top: 7px;
  margin-bottom: 0;
}

.navigation-clean-button .actions .login {
  margin-right: 7px;
  text-decoration: none;
  color: #ffffff;
}

.navigation-clean-button .action-button, .navigation-clean-button .action-button:active {
  background: transparent;
  border-radius: 0;
  color: #e04c40;
  box-shadow: none;
  border: 1px solid #e04c40;
  text-shadow: none;
  padding: 10px 22px;
  transition: background-color 0.25s;
}

.navigation-clean-button .action-button:hover {
  background: #e04c40;
  color: #fff;
  font-weight: 400;
  border: 1px solid #df4c40;
}

.navbar {
  margin-bottom: 0;
}

.btn {
  border-radius: 0;
}

.btn.focus, .btn:focus, .btn:hover {
  color: #ffffff;
  text-decoration: none;
  background-color: #1485ee;
  border: none;
}

.btn {
  font-family: 'Roboto';
  font-weight: 400;
}  
</style>