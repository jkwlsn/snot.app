<script setup>
import { useUserSettings } from '../composables/useUserSettings';
import PollenSensitivity from './PollenSensitivity.vue';
import GeoLocation from './GeoLocation.vue';
import PollenData from './PollenData.vue';
import PollenAlert from './PollenAlert.vue';

const { settings } = useUserSettings();
</script>

<template>
  <main>
    <PollenSensitivity v-model="settings.sensitivity" />
    <GeoLocation v-model:location="settings.location" />
    <PollenAlert
      :pollenData="pollenData"
      :times="times"
      :threshold="settings.sensitivity"
    />
    <PollenData />
  </main>
</template>
