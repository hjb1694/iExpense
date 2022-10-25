<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/Header.vue'
import { onMounted } from 'vue'
import { useStore } from '@/stores';

const { fetchFromLocalStorage } = useStore();

onMounted(() => fetchFromLocalStorage());



</script>

<template>
  <div> 
    <app-header />
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
    .container{
      max-width:120rem;
      margin:2rem auto;
    }
</style>
