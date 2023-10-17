<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">App conversiones</a>

      <button class="navbar-toggler" type="button" @click="toggleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div :class="navbarClass" id="navbarScroll">
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
          <li class="nav-item">
            <router-link to="/conversion" class="nav-link" aria-current="page">Conversor</router-link>
          </li>
          <li v-if="isAuthenticated && isAdmin" class="nav-item">
            <router-link to="/historial" class="nav-link">Historial Conversiones</router-link>
          </li>
        </ul>
        <ul v-if="isAuthenticated" class="navbar-nav">
          <li class="nav-item dropdown" style="max-width: 1%;">
            <a class="nav-link dropdown-toggle" href="#" role="button" @click="toggleDropdown" id="navbarDropdown"
              data-bs-toggle="dropdown" aria-expanded="false" style="max-width: 1%;">
              {{ username }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li class="navbar-nav">
                <a class="dropdown-item" role="button" @click="logout">
                  Salir
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  data() {
    return {
      isAuthenticated: false,
      isAdmin: false,
      username: '',
      showNavbar: false,
    };
  },
  computed: {
    //Para mostrar el navbar
    navbarClass() {
      return {
        'collapse navbar-collapse': true,
        show: this.showNavbar,
      };
    },
  },
  //Para verificar si el usuario está logueado y si es administrador
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.isAuthenticated = true;
      this.isAdmin = decodedToken.role === 'admin';
      this.username = decodedToken.username;
    }
  },
  methods: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    toggleDropdown(event) {
      event.preventDefault();
    },
    //Para cerrar la sesión
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.username = '';
      this.$router.push('/');
    },
  },
};
</script>
