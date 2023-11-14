<template>
  <v-app>
    <!-- Renderiza o componente DefaultBar apenas se a rota não for 'auth' -->
    <default-bar v-if="$route.name !== 'Auth'"/>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import DefaultBar from './AppBar.vue';
  import DefaultView from './View.vue';

  const $route = useRoute();
</script>
