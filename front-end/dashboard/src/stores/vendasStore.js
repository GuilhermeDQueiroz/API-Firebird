import { defineStore } from "pinia";
import { api } from "../api/api";

export const useVendasStore = defineStore("vendas", {

  state: () => ({
    vendas: [],
    loading: false
  }),

  actions: {

    async carregarVendas() {

      this.loading = true;

      try {

        const response = await api.get("/DOCUMENTO_FATURA?limit=5000");

        this.vendas = response.data;

      } catch (err) {

        console.error(err);

      } finally {

        this.loading = false;

      }

    }

  }

});