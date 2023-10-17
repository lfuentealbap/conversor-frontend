<template>
  <Navbar />
  <h1 class="mb-5 mt-2 text-center">Historial de conversiones</h1>
  <div class="container-fluid mb-5">
    <button @click="exportarExcel" class="btn btn-success">
       <icon><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-type-xls" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
       <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
       <path d="M14 3v4a1 1 0 0 0 1 1h4" />
       <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
       <path d="M4 15l4 6" />
       <path d="M4 21l4 -6" />
       <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
       <path d="M11 15v6h3" />
      </svg></icon> Exportar a Excel
    </button>
  </div>
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
import ExcelJS from 'exceljs';


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


const exportarExcel = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Historial de Conversiones');
  
  // Agregar encabezados de columna
  const headers = [
    'Fecha Hora Actividad',
    'Usuario',
    'Monto Origen',
    'Fecha Conversión',
    'Valor de la Moneda',
    'Resultado Conversión'
  ];
  worksheet.addRow(headers);
  
  // Agregar filas de datos
  conversiones.value.forEach((conversion) => {
    const rowData = [
      format(new Date(conversion.fechaHoraActividad), 'dd-MM-yyyy HH:mm') + ' hrs',
      conversion.usuario.nombre,
      conversion.montoOrigen + ' UF',
      format(new Date(conversion.fechaConversion), 'dd-MM-yyyy'),
      '$' + conversion.valorMoneda + ' CLP',
      '$' + conversion.montoConversion + ' CLP'
    ];
    worksheet.addRow(rowData);
  });
  
  // Escribir el archivo de Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historial_conversiones.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  });
};


// Hook de montaje
onMounted(() => {
  obtenerHistorial();
});
</script>


<style scoped></style>
