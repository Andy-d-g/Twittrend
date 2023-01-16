<script setup lang="ts">
import api, { type Score } from "./api";
import { onMounted } from "vue";
import Spin from "@/components/Spin.vue";

let keyword = $ref("");
let scores = $ref<Score[]>([]);
let series = $ref<{ name: string; data: number[] }[]>([]);
let chartOptions = $ref<Record<string, any>>({
  chart: {
    height: 350,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: [],
  },
});

onMounted(async () => {
  keyword = await api.fetchKeyword();
  scores = await api.fetchScores();
  scores.forEach(s => s.score = Math.floor(s.score))
  chartOptions.xaxis.categories = scores.map((s) => s.date);
  chartOptions.title.text = `Keyword '${keyword}' popularity`;
  series = [{ name: "Popularity", data: scores.map((s) => s.score) }];
});
</script>

<template>
  <main>
    <div id="chart" v-if="series.length">
      <apexchart
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      />
    </div>
    <Spin v-else class="spin" />
  </main>
</template>

<style scoped>
.spin {
  position: fixed;
  left: 50%;
  top: 40%;
}

#chart {
  position: fixed;
  top: 20%;
  width: 100%;
}
</style>
