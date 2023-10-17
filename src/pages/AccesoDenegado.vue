<template>
  <Navbar/>
  <div class="container">
    <div class="row">
      <div class="col-md-8 offset-md-3">
        <div class="alert alert-danger mt-5">
          <h4 class="alert-heading">Acceso Denegado</h4>
          <p>No tienes permiso para acceder a esta página.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert {
  text-align: center;
}
</style>
<script setup>
import Navbar from '../components/Navbar.vue';
</script>