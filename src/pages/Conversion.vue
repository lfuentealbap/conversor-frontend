<template>
  <Navbar />
  <section class="container">
    <form @submit.prevent="convertir">
      <h1 class="mb-5">Convertir de UF a CLP</h1>
      <div class="mb-3">
        <label for="fechaConversion" class="form-label">Fecha de Conversion</label>
        <input type="date" class="form-control" id="fechaConversion" :max="fechaActual" v-model="fechaConversion">
      </div>
      <div class="mb-3">
        <label for="montoOrigen" class="form-label">Monto UF a convertir</label>
        <input type="number" class="form-control" id="montoOrigen" step="any" min="1" v-model="montoOrigen">
      </div>
      <button type="submit" class="btn btn-primary">Convertir</button>
    </form>

  </section>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

//Variable fecha actual para aplicar restricción en input de fecha conversión
let fechaActual = format(new Date(), 'yyyy-MM-dd');
let fechaConversion = '';
let usuario = jwtDecode(localStorage.getItem('token')).userId;
let montoOrigen = 0;
let valorMoneda = 0;
let montoConversion = 0;

const convertir = async () => {
  let fechaFormateada = format(new Date(fechaConversion), 'dd-MM-yyyy');
  try {
    const responseConversor = await Axios.get(`https://mindicador.cl/api/uf/${fechaFormateada}`);
    console.log(responseConversor.data);
    valorMoneda = responseConversor.data.serie[0].valor;
    montoConversion = montoOrigen * valorMoneda;
    //Redondea sin decimales el monto final de conversión
    montoConversion = Math.round(montoConversion);

    //Muestra el resultado de la conversión en una alerta
    Swal.fire({
      title: '<strong>Resultado conversión</strong>',
      icon: 'success',
      html:
        'Monto ingresado: <b>' + montoOrigen + ' UF</b> <br>' +
        'Con valor UF: <b>$' + valorMoneda + '</b><br> a la fecha ingresada: <b>' + fechaFormateada + '</b> <br>' +
        'El resultado es: <h3><b>$' + montoConversion + '</b></h3>',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Listo!',
    })

    //llama a la función encargada de guardar la conversión en la base de datos
    guardarDB(fechaConversion, usuario, montoOrigen, valorMoneda, montoConversion);

  } catch (error) {
    console.error(error);
  }
};
//Función encargada de guardar la conversión en la base de datos
const guardarDB = async (fechaConversion, usuario, montoOrigen, valorMoneda, montoConversion) => {
  try {
    const response = await Axios.post(`${import.meta.env.VITE_API_URL}/api/conversion`, {
      fechaConversion,
      usuario,
      montoOrigen,
      valorMoneda,
      montoConversion
    });
    console.log("Conversión registrada en la base de datos:");

  } catch (error) {
    console.error(error);
  }
};

</script>



<style scoped></style>
