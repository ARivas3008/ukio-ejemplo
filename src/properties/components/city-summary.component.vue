<script setup>
import DetailList from '../../shared/components/detail-list.component.vue';
import { useText } from '../../shared/services/text.service.js';
defineProps({ item: { type: Object, required: true } });
const { tr, show } = useText();
</script>
<template>
  <pv-card class="summary-card"
  ><template #header
  ><div class="card-heading">
    <i class="pi pi-th-large" aria-hidden="true" /><span>{{ tr(item.title) }}</span>
  </div></template
  ><template #content><detail-list :values="item.content" /></template
  ><template #footer
  ><div v-if="Object.keys(item.stats || {}).length" class="metrics">
    <div v-for="(value, label) in item.stats" :key="label" class="metric">
          <span>{{ tr(label) }}</span
          ><strong>{{ show(value, label) }}{{ label.includes('%') ? '%' : '' }}</strong>
    </div>
  </div>
    <detail-list :values="item.footer" /><slot /></template
  ></pv-card>
</template>
