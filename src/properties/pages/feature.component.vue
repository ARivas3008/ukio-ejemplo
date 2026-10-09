<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { config } from '../../config.js';
import { useWorkspace } from '../services/workspace.store.js';
import { useText } from '../../shared/services/text.service.js';
import CitySummary from '../components/city-summary.component.vue';
import RecordsTable from '../../shared/components/records-table.component.vue';
import DetailList from '../../shared/components/detail-list.component.vue';
import FeatureForm from '../components/feature-form.component.vue';

const { tr, show } = useText();
const route = useRoute(),
    router = useRouter(),
    toast = useToast(),
    store = useWorkspace();
const form = reactive({}),
    error = ref(''),
    result = ref(null),
    busy = ref(false),
    dialog = ref(false),
    confirming = ref(false);
const catalog = ref([]),
    catalogLoading = ref(false),
    catalogError = ref('');
let searchVersion = 0;
const isStore = computed(() => route.path === '/commerce/stores/new');
const fields = computed(() => (isStore.value ? config.storeFields : config.fields));
const items = computed(() =>
    store.ready && store.service.items ? store.service.items(store.data) : []
);
const rows = computed(() =>
    store.ready && store.service.rows ? store.service.rows(store.data) : []
);
const details = computed(() =>
    config.kind === 'hussmann' && store.ready
        ? store.service.assetDetails(store.data, form.assetId)
        : null
);
const selectedBook = computed(() => catalog.value.find((book) => book.key === form.bookKey));
function options(field) {
  if (Array.isArray(field.source))
    return field.source.map((value) => ({ label: tr(value), value }));
  if (field.source === 'catalog')
    return catalog.value.map((book) => ({
      label: `${book.title} (${book.first_publish_year ?? '?'})`,
      value: book.key,
    }));
  let rows = store.data[field.source] || [];
  if (config.kind === 'hussmann' && field.name === 'storeId') {
    const asset = store.data['equipment-assets']?.find(
        (row) => String(row.id) === String(form.assetId)
    );
    const current = store.data.stores?.find((row) => String(row.id) === String(asset?.storeId));
    rows = rows.filter(
        (row) =>
            current &&
            String(row.retailerId) === String(current.retailerId) &&
            String(row.id) !== String(current.id)
    );
  }
  return rows.map((row) => ({ label: row[field.optionLabel || 'name'], value: row.id }));
}
function reset() {
  Object.keys(form).forEach((key) => delete form[key]);
  if (config.kind === 'tend') form.plotId = route.params.id;
}
function choose(item) {
  reset();
  form.itemId = item.id;
  form.productName = item.title;
  form.description = item.content.Description;
  error.value = '';
  result.value = null;
  dialog.value = true;
}
async function searchBooks() {
  return;
}
watch(() => form.topic, searchBooks);
watch(
    () => form.assetId,
    () => {
      form.storeId = null;
    }
);
watch(
    () => route.fullPath,
    () => {
      reset();
      error.value = '';
      result.value = null;
    }
);
async function save() {
  if (busy.value) return;
  busy.value = true;
  error.value = '';
  result.value = null;
  confirming.value = false;
  try {
    const input = {
      ...form,
      ...(config.kind === 'open-library' ? { book: selectedBook.value } : {}),
    };
    const outcome = isStore.value
        ? await store.service.createStore(input)
        : await store.service.submit(input);
    result.value = outcome.details || null;
    toast.add({
      severity: 'success',
      summary: tr('Success'),
      detail: tr(outcome.message || 'Operation completed'),
      life: 5000,
    });
    if (outcome.warning)
      toast.add({
        severity: 'warn',
        summary: tr('Warning'),
        detail: tr(outcome.warning),
        life: 8000,
      });
    if (outcome.close) dialog.value = false;
    if (outcome.reset) reset();
    await store.load();
    if (outcome.redirect) await router.push('/home');
  } catch (err) {
    error.value = err.isAxiosError ? 'Request failed. Please try again.' : err.message;
  } finally {
    busy.value = false;
  }
}
function submit() {
  error.value = '';
  if (config.kind === 'goodnews') {
    if (form.quantity === undefined || form.quantity === null || form.quantity === '') {
      error.value = 'Completing the quantity field is mandatory';
      return;
    }
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) <= 0) {
      error.value = 'Quantity must be a positive integer';
      return;
    }
  }
  if (config.kind === 'ukio') {
    if (!form.startDate || !form.endDate) {
      error.value = 'Completing the quantity field is mandatory';
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      error.value = 'End Date must be after Start Date';
      return;
    }
  }
  if (config.kind === 'goodnews' || config.kind === 'ukio') confirming.value = true;
  else save();
}
onMounted(async () => {
  reset();
  await store.load();
});
</script>
<template>
  <header class="hero">
    <span class="eyebrow">{{ config.brand }}</span>
    <h1>{{ tr(isStore ? 'New Store' : config.title) }}</h1>
    <p>{{ tr(isStore ? 'New Store' : config.formSection || config.title) }}</p>
  </header>
  <pv-message v-if="store.error" severity="error" role="alert"
  >{{ tr(store.error) }} <pv-button :label="tr('Retry')" @click="store.load()"
  /></pv-message>
  <p v-if="store.loading" role="status">{{ tr('Loading') }}…</p>
  <template v-if="store.ready">
    <records-table
        v-if="config.kind === 'technogym'"
        :rows="rows"
        :columns="config.table"
        filtering
    />
    <template v-else>
      <div v-if="config.kind === 'ukio' || config.kind === 'goodnews'" class="summary-grid">
        <city-summary v-for="item in items" :key="item.id" :item="item"
        ><pv-button
            :label="tr(item.disabled ? 'Completed' : config.kind === 'ukio' ? 'Rent' : 'Shop')"
            :disabled="item.disabled"
            class="mt-3"
            @click="choose(item)"
        /></city-summary>
        <div v-if="!items.length" class="empty">{{ tr('Empty') }}</div>
      </div>
      <component
          :is="config.kind === 'ukio' || config.kind === 'goodnews' ? 'pv-dialog' : 'pv-card'"
          v-if="!['ukio', 'goodnews'].includes(config.kind) || dialog"
          v-model:visible="dialog"
          :modal="true"
          :header="tr(config.title)"
          :style="['ukio', 'goodnews'].includes(config.kind) ? { width: 'min(92vw,620px)' } : {}"
          class="form-card"
      >
        <template #content v-if="!['ukio', 'goodnews'].includes(config.kind)"
        ><feature-form
            :form="form"
            :fields="fields"
            :options="options"
            :details="details"
            :selected-book="selectedBook"
            :catalog-loading="catalogLoading"
            :catalog-error="catalogError"
            :error="error"
            :busy="busy"
            :button="isStore ? 'Save' : config.button"
            @submit="submit"
            @cancel="
              dialog = false;
              router.push('/home');
            "
            @retry="searchBooks"
        /></template>
        <feature-form
            v-if="['ukio', 'goodnews'].includes(config.kind)"
            :form="form"
            :fields="fields"
            :options="options"
            :details="details"
            :selected-book="selectedBook"
            :catalog-loading="catalogLoading"
            :catalog-error="catalogError"
            :error="error"
            :busy="busy"
            :button="isStore ? 'Save' : config.button"
            @submit="submit"
            @cancel="
            dialog = false;
            router.push('/home');
          "
            @retry="searchBooks"
        />
      </component>
      <pv-dialog
          v-model:visible="confirming"
          modal
          :header="tr('Confirm')"
          :style="{ width: 'min(90vw,430px)' }"
      ><p>{{ tr('Please confirm this operation') }}</p>
        <template #footer
        ><pv-button
            :label="tr('Cancel')"
            severity="secondary"
            @click="confirming = false" /><pv-button
            :label="tr('Confirm')"
            :loading="busy"
            @click="save" /></template
        ></pv-dialog>
      <pv-card v-if="result" class="result" role="status"
      ><template #title>{{ tr('Result') }}</template
      ><template #content><detail-list :values="result" /></template
      ></pv-card>
    </template>
  </template>
</template>