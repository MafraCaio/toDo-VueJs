<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col cols="4" class="categories-list">
          Caio
        </v-col>
        <v-col cols="8" class="task-list">
          Caio
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
  .home {
    display: flex;
    flex-direction: row;
    padding: 10px;
  }

  .categories-list {
    background-color: aqua;
  }

  .task-list {
    background-color: azure;
  }
</style>
