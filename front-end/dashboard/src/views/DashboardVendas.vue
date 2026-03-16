<script setup>
import { onMounted, computed } from "vue";
import { useVendasStore } from "../stores/vendasStore";
import VueApexCharts from "vue3-apexcharts";

const store = useVendasStore();

onMounted(() => {
  store.carregarVendas();
});

// ==========================================
// 1. FUNÇÕES DE FORMATAÇÃO
// ==========================================
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
};

const formatarData = (dataString) => {
  if (!dataString) return '-';
  return new Date(dataString).toLocaleDateString('pt-BR');
};

const formatarNumero = (valor) => {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(valor || 0);
};

// ==========================================
// 2. CÁLCULO DOS KPIs (Cards Superiores)
// ==========================================
const kpis = computed(() => {
  const totalVendas = store.vendas.length;
  const faturamentoTotal = store.vendas.reduce((acc, v) => acc + (v.VLRLIQUIDO_DOCFAT || 0), 0);
  const pesoTotal = store.vendas.reduce((acc, v) => acc + (v.PESO_DOCFAT || 0), 0);
  const volumeM3Total = store.vendas.reduce((acc, v) => acc + (v.VOLUMEM3_DOCFAT || 0), 0);

  return { totalVendas, faturamentoTotal, pesoTotal, volumeM3Total };
});

// ==========================================
// 3. AGRUPAMENTO DE DADOS PARA OS GRÁFICOS
// ==========================================
// Agrupa os dados por dia para não repetir datas no eixo X
const dadosAgrupadosPorDia = computed(() => {
  const mapa = {};
  
  store.vendas.forEach(v => {
    const data = formatarData(v.DTEMISSAO_DOCFAT);
    if (!mapa[data]) {
      mapa[data] = { valor: 0, volumes: 0 };
    }
    mapa[data].valor += (v.VLRLIQUIDO_DOCFAT || 0);
    mapa[data].volumes += (v.VOLUMES_DOCFAT || 0);
  });

  // Ordena pelas datas (simplificado)
  const datas = Object.keys(mapa).sort();
  const valores = datas.map(d => mapa[d].valor.toFixed(2));
  const volumes = datas.map(d => mapa[d].volumes);

  return { datas, valores, volumes };
});

// ==========================================
// 4. CONFIGURAÇÃO DOS GRÁFICOS (ApexCharts)
// ==========================================
// Gráfico 1: Faturamento Financeiro (Área)
const chartOptionsFinanceiro = computed(() => ({
  chart: { type: 'area', toolbar: { show: false } },
  colors: ['#00E396'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  xaxis: { categories: dadosAgrupadosPorDia.value.datas },
  yaxis: { labels: { formatter: (val) => formatarMoeda(val) } },
  title: { text: 'Faturamento por Dia', align: 'left' }
}));

const seriesFinanceiro = computed(() => [
  { name: 'Faturamento Bruto', data: dadosAgrupadosPorDia.value.valores }
]);

// Gráfico 2: Logística - Volumes (Barras)
const chartOptionsLogistica = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: ['#FEB019'],
  dataLabels: { enabled: true },
  xaxis: { categories: dadosAgrupadosPorDia.value.datas },
  title: { text: 'Qtd de Volumes Expedidos por Dia', align: 'left' }
}));

const seriesLogistica = computed(() => [
  { name: 'Volumes', data: dadosAgrupadosPorDia.value.volumes }
]);

</script>

<template>
  <div class="dashboard-container">
    <header class="header">
      <h1>Painel de Controle Comercial e Logístico</h1>
      <p>Acompanhamento de Vendas e Expedição</p>
    </header>

    <div class="kpi-grid">
      <div class="kpi-card">
        <h3>Total de Pedidos</h3>
        <p class="kpi-value">{{ kpis.totalVendas }}</p>
      </div>
      <div class="kpi-card">
        <h3>Faturamento Total</h3>
        <p class="kpi-value financeiro">{{ formatarMoeda(kpis.faturamentoTotal) }}</p>
      </div>
      <div class="kpi-card">
        <h3>Peso Total (Kg)</h3>
        <p class="kpi-value logistica">{{ formatarNumero(kpis.pesoTotal) }} kg</p>
      </div>
      <div class="kpi-card">
        <h3>Cubagem Total (m³)</h3>
        <p class="kpi-value logistica">{{ formatarNumero(kpis.volumeM3Total) }} m³</p>
      </div>
    </div>

    <div class="charts-grid" v-if="store.vendas.length > 0">
      <div class="chart-box">
        <VueApexCharts type="area" height="300" :options="chartOptionsFinanceiro" :series="seriesFinanceiro" />
      </div>
      <div class="chart-box">
        <VueApexCharts type="bar" height="300" :options="chartOptionsLogistica" :series="seriesLogistica" />
      </div>
    </div>

    <div class="table-container">
      <h2>Detalhamento dos Pedidos</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Emissão</th>
            <th>Cliente</th>
            <th>Qtd Itens</th>
            <th>Volumes</th>
            <th>Peso Bruto (Kg)</th>
            <th>Valor Líquido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in store.vendas" :key="v.CODIGO_DOCFAT">
            <td>#{{ v.CODIGO_DOCFAT }}</td>
            <td>{{ formatarData(v.DTEMISSAO_DOCFAT) }}</td>
            <td>{{ v.CLIENTE_DOCFAT }}</td>
            <td>{{ v.QTDETOTALITENS_DOCFAT }}</td>
            <td>{{ v.VOLUMES_DOCFAT }}</td>
            <td>{{ formatarNumero(v.PESO_DOCFAT) }}</td>
            <td class="valor-col">{{ formatarMoeda(v.VLRLIQUIDO_DOCFAT) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para deixar o Dashboard com cara de sistema profissional */
.dashboard-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: #333;
}

.header h1 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.header p {
  color: #7f8c8d;
  margin-top: 0;
  margin-bottom: 30px;
}

/* Grid dos KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.kpi-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.kpi-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
}

.kpi-value {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}
.kpi-value.financeiro { color: #00E396; }
.kpi-value.logistica { color: #FEB019; }

/* Grid dos Gráficos */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-box {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

/* Estilos da Tabela */
.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.data-table tr:hover {
  background-color: #f1f2f6;
}

.valor-col {
  font-weight: bold;
  color: #27ae60;
}
</style>