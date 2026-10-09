<script setup>
import { useText } from '../services/text.service.js';
defineProps({ values: { type: Object, default: () => ({}) } });
const { tr, show } = useText();
</script>
<template>
  <dl>
    <div v-for="(value, label) in values" :key="label" class="detail-row">
      <dt>{{ tr(label) }}</dt>
      <dd>
        <pv-listbox
            v-if="Array.isArray(value) && String(label).includes('Schedule')"
            :options="value"
            :aria-label="tr(label)"
        /><span v-else>{{ show(value, label) }}</span>
      </dd>
    </div>
  </dl>
</template>