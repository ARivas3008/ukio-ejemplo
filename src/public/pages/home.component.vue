<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkspace } from '../../properties/services/workspace.store.js';
import { config } from '../../config.js';
import CitySummary from '../../properties/components/city-summary.component.vue';
import RecordsTable from '../../shared/components/records-table.component.vue';
import DetailList from '../../shared/components/detail-list.component.vue';
import { useText } from '../../shared/services/text.service.js';
const { tr } = useText();
const router = useRouter(),
    store = useWorkspace(),
    selected = ref(null),
    tick = ref(0);
const cards = computed(() => {
  tick.value;
  return store.ready ? store.service.summarize(store.data, selected.value) : [];
});
const rows = computed(() =>
    store.ready && store.service.rows ? store.service.rows(store.data, selected.value) : []
);
const next = computed(() =>
    store.ready && store.service.next ? store.service.next(store.data) : null
);
async function refresh() {
  await store.load();
  if (config.kind === 'hussmann' && selected.value === null)
    selected.value = store.data.stores?.[0]?.id ?? null;
}
let timer;
onMounted(() => {
  refresh();
  if (config.nextTitle) timer = setInterval(() => tick.value++, 60000);
});
onUnmounted(() => clearInterval(timer));
</script>
<template>
  <header class="hero">
    <span class="eyebrow">{{ config.brand }}</span>
    <h1>{{ tr(config.homeTitle) }}</h1>
    <p>{{ tr(config.subtitle) }}</p>
  </header>
  <div class="section-heading">
    <h2>{{ tr(config.section) }}</h2>
    <pv-button
        :label="tr('Refresh')"
        icon="pi pi-refresh"
        severity="secondary"
        :loading="store.loading"
        @click="refresh"
    />
  </div>
  <pv-message v-if="store.error" severity="error" role="alert" class="inline-message">{{
      tr(store.error)
    }}</pv-message>
  <p v-if="store.loading" role="status">{{ tr('Loading') }}…</p>
  <template v-if="store.ready">
    <div v-if="config.kind === 'hussmann'" class="field store-select">
      <label for="home-store">{{ tr('Select Store') }}</label
      ><pv-select
        input-id="home-store"
        v-model="selected"
        :options="store.data.stores"
        option-label="name"
        option-value="id"
    />
    </div>
    <div v-if="cards.length" class="summary-grid" :style="{ '--columns': config.columns }">
      <city-summary v-for="(item, index) in cards" :key="index" :item="item" />
    </div>
    <div v-else-if="!config.homeTable" class="empty">
      <i class="pi pi-inbox" aria-hidden="true" />{{ tr('Empty') }}
    </div>
    <h2 v-if="config.kind === 'hussmann'" class="section-heading">
      {{ tr('Store Equipment Assets') }}
    </h2>
    <records-table
        v-if="config.homeTable"
        :rows="rows"
        :columns="config.table"
        :inspection="config.kind === 'tend'"
        @inspect="(id) => router.push('/plots/' + id + '/inspections')"
    />
    <template v-if="config.nextTitle"
    ><div class="section-heading">
      <h2>{{ tr(config.nextTitle) }}</h2>
    </div>
      <pv-card v-if="next" class="form-card"
      ><template #content><detail-list :values="next" /></template
      ></pv-card>
      <div v-else class="empty">{{ tr('Empty') }}</div></template
    >
  </template>
</template>
