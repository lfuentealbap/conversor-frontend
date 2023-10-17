<template>
  <div class="container">
    <form @submit.prevent="login">
      <h1 class="mb-3">Conversor de UF a CLP</h1>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" v-model="username">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" class="form-control" id="password" v-model="password">
      </div>
      <button type="submit" class="btn btn-primary">Acceder</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      console.log(import.meta.env.VITE_API_URL + '/api/login');
      axios.post(import.meta.env.VITE_API_URL + '/api/login', {
        username: this.username,
        password: this.password
      })
      .then(response => {
        const token = response.data.token;
        // Aquí puedes almacenar el token en el almacenamiento local o en una cookie
        localStorage.setItem('token', token);
        // y redirigir al usuario a la página principal
        this.$router.push({ name: 'Conversion' });
      })
      .catch(error => {
        console.error(error);
      });
    }
  }
};
</script>