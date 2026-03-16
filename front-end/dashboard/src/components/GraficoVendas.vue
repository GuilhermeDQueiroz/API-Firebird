<script setup>

import VueApexCharts from "vue3-apexcharts";
import { computed } from "vue";
import { useVendasStore } from "../stores/storeVendas";

const store = useVendasStore();

const series = computed(() => [

  {
    name: "Vendas",

    data: store.vendas.map(v => v.VLRLIQUIDO_DOCFAT)
  }

]);

const chartOptions = computed(() => ({

  chart: {
    type: "line"
  },

  xaxis: {
    categories: store.vendas.map(v =>
      new Date(v.DTEMISSAO_DOCFAT).toLocaleDateString()
    )
  }

}));

</script>

<template>

  <apexchart type="line" height="350" :options="chartOptions" :series="series" />

</template>