import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/DashboardVendas.vue";

const routes = [
  {
    path: "/",
    component: Dashboard
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});