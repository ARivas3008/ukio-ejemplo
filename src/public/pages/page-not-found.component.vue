<script setup>
import { useRoute } from 'vue-router';
import { useText } from '../../shared/services/text.service.js';
const route = useRoute(),
    { tr } = useText();
</script>
<template>
  <header class="hero">
    <span class="eyebrow">404</span>
    <h1>{{ tr('Page not found') }}</h1>
    <p>{{ tr('Route not found') }}: {{ route.fullPath }}</p>
    <router-link to="/home"
    ><pv-button class="mt-4" :label="tr('Back to Home')" icon="pi pi-arrow-left"
    /></router-link>
  </header>
</template>
