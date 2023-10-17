<template>
  <Navbar />
  <h1 class="mb-5 mt-2 text-center">Historial de conversiones</h1>
  <section class="container-fluid">
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Fecha Hora Actividad</th>
            <th>Usuario</th>
            <th>Monto Origen</th>
            <th>Fecha conversión</th>
            <th>Valor de la Moneda</th>
            <th>Resultado Conversión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="conversion in conversiones" :key="conversion.id">
            <td>{{ format(new Date(conversion.fechaHoraActividad), 'dd-MM-yyyy HH:mm') }} hrs</td>
            <td>{{ conversion.usuario.nombre }}</td>
            <td>{{ conversion.montoOrigen }} UF</td>
            <td>{{ format(new Date(conversion.fechaConversion), 'dd-MM-yyyy') }}</td>
            <td>${{ conversion.valorMoneda }} CLP</td>
            <td><b>${{ conversion.montoConversion }}</b> CLP</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { format } from 'date-fns';
import Axios from 'axios';


// Arreglo de conversiones reactiva
const conversiones = ref([]);

// Función encargada de obtener la lista de conversiones desde la base de datos
const obtenerHistorial = async () => {
  try {
    const response = await Axios.get(`${import.meta.env.VITE_API_URL}/api/historial`);
    conversiones.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

// Hook de montaje
onMounted(() => {
  obtenerHistorial();
});
</script>


<style scoped></style>
