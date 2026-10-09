<script setup>
import DetailList from '../../shared/components/detail-list.component.vue';
import { useText } from '../../shared/services/text.service.js';
defineProps({
  form: Object,
  fields: Array,
  options: Function,
  details: Object,
  selectedBook: Object,
  catalogLoading: Boolean,
  catalogError: String,
  error: String,
  busy: Boolean,
  button: String,
});
defineEmits(['submit', 'cancel', 'retry']);
const { tr } = useText();
</script>
<template>
  <form class="form-stack" @submit.prevent="$emit('submit')" novalidate>
    <div v-for="field in fields" :key="field.name" class="field">
      <label :for="'field-' + field.name"
      >{{ tr(field.label)
        }}<span v-if="field.type !== 'readonly'" aria-hidden="true"> *</span></label
      >
      <pv-select
          v-if="field.type === 'select'"
          :input-id="'field-' + field.name"
          v-model="form[field.name]"
          :options="options(field)"
          option-label="label"
          option-value="value"
          :placeholder="tr('Select an option')"
          :loading="field.name === 'bookKey' && catalogLoading"
          :aria-required="true"
      />
      <pv-datepicker
          v-else-if="field.type === 'date'"
          :input-id="'field-' + field.name"
          v-model="form[field.name]"
          date-format="yy-mm-dd"
          show-icon
          :manual-input="false"
          :aria-required="true"
      />
      <pv-textarea
          v-else-if="field.type === 'textarea'"
          :id="'field-' + field.name"
          v-model="form[field.name]"
          rows="3"
          :aria-required="true"
      />
      <pv-input-text
          v-else
          :id="'field-' + field.name"
          v-model="form[field.name]"
          :type="field.type === 'number' ? 'number' : 'text'"
          :step="field.name === 'quantity' ? '1' : 'any'"
          :readonly="field.type === 'readonly'"
          :aria-required="field.type !== 'readonly'"
      />
    </div>
    <pv-message v-if="catalogError" severity="error" role="alert"
    >{{ tr(catalogError) }} <pv-button :label="tr('Retry')" size="small" @click="$emit('retry')"
    /></pv-message>
    <div v-if="selectedBook" class="book-details">
      <h2>{{ tr('Book details') }}</h2>
      <detail-list
          :values="{
          Book: selectedBook.title,
          'Author Names': selectedBook.author_name,
          'First Publish Year': selectedBook.first_publish_year,
        }"
      />
    </div>
    <detail-list v-if="details" :values="details" />
    <pv-message v-if="error" severity="error" role="alert">{{ tr(error) }}</pv-message>
    <div class="actions">
      <pv-button
          type="submit"
          :label="tr(button)"
          icon="pi pi-check"
          :loading="busy"
          :disabled="catalogLoading"
      /><pv-button
        type="button"
        :label="tr('Cancel')"
        severity="secondary"
        :disabled="busy"
        @click="$emit('cancel')"
    />
    </div>
  </form>
</template>