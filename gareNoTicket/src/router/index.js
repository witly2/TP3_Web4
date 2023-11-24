/* eslint-disable no-undef */
import { createRouter, createWebHistory } from 'vue-router'
import Connexion from '../views/Connexion.vue'
import NotFound from '../views/NotFound.vue';
//const jwtDecode = require('jwt-decode');
import {jwtDecode} from "jwt-decode"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        requiresAuth: false
      },
      component: Connexion,

    },
    {
      path: '/inscription',
      name: 'inscription',
      meta: {
        requiresAuth: false
      },
      component: () => import('../views/Inscription.vue'),
    },
    {
      path: '/',
      name: 'home',
  
      component: () => import('../views/MaplaceView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
  
      component: () => import('../views/Profile.vue'),
      meta: {
        requiresAuth: true
      }
    },
    { path: '/:notFound(.*)', component: NotFound }
  ]
});

// "Guarde de navigation", exécutée avant chaque navigation  
router.beforeEach((to, from, next) => {
  // Vérification de la présence d'un token
  // Mais on ne vérifie pas sa validité dans cet exemple
  // Pour une "vraie" application, il faudrait vérifier sa validité
 try {
    const token=localStorage.getItem('token')
    
    if (to.meta.requiresAuth) {
      
      if (token) {

        const decoded = jwtDecode(token);
         // Exemple : vérifiez la date d'expiration
         const expirationTime = decoded.exp * 1000; // Convertissez en millisecondes
         const currentTime = new Date().getTime();

        if(token && currentTime<expirationTime){
            next();
        }
        else{
          localStorage.removeItem('token');
          console.log("Date: ", expirationTime)
          next({ name: 'login' });
        }
        
      } else {
        next({ name: 'login' });
      }
    } 
    else {
      if (!token) {
        next();
      } else {
        next({ path: '/' });
      }
    }
  } catch (error) {
    console.error('Erreur lors du décodage du jeton :', error);
    localStorage.removeItem('token');
    next({ path: '/login' });
  }
});

// "Guarde de navigation", exécutée après chaque navigation
router.afterEach((to, from) => {
  console.log('router.afterEach', to, from);
});

export default router
