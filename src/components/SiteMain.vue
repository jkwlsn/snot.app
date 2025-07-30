<script setup>
import { ref } from 'vue';
import PollenSensitivity from './PollenSensitivity.vue';

const sensitivity = ref(5);
</script>

<template>
  <main>
    <PollenSensitivity v-model="sensitivity" />
  </main>
</template>
