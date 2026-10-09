<script setup>
import { ref, computed } from 'vue';
import { useText } from '../services/text.service.js';
const props = defineProps({
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  inspection: Boolean,
  filtering: Boolean,
});
defineEmits(['inspect']);
const { tr, show } = useText();
const query = ref('');
const filtered = computed(() =>
    props.rows.filter(
        (row) =>
            !query.value ||
            props.columns.some((column) =>
                String(row[column.field] ?? '')
                    .toLowerCase()
                    .includes(query.value.toLowerCase())
            )
    )
);
</script>
<template>
  <div class="table-wrap">
    <div v-if="filtering" class="table-search">
      <i class="pi pi-search" aria-hidden="true" /><pv-input-text
        v-model="query"
        :placeholder="tr('Search records')"
        :aria-label="tr('Search records')"
    />
    </div>
    <pv-data-table
        :value="filtered"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        data-key="id"
        removable-sort
        scrollable
        :aria-label="tr('Records')"
    ><template #empty>{{ tr('Empty') }}</template
    ><pv-column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :header="tr(column.label)"
        sortable
    ><template #body="slotProps">{{ show(slotProps.data[column.field]) }}</template></pv-column
    ><pv-column v-if="inspection" :header="tr('Register Inspection')"
    ><template #body="slotProps"
    ><pv-button
        :label="tr('Register Inspection')"
        size="small"
        :disabled="slotProps.data.disabled"
        @click="$emit('inspect', slotProps.data.id)" /></template></pv-column
    ></pv-data-table>
  </div>
</template>