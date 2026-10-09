<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePrimeVue } from 'primevue/config';
import { config } from './config.js';
import { useText } from './shared/services/text.service.js';
const { tr } = useText();
const { locale } = useI18n();
const prime = usePrimeVue();
const originalLocale = { ...prime.config.locale, aria: { ...prime.config.locale.aria } };
const spanishLocale = {
  startsWith: 'Empieza con',
  contains: 'Contiene',
  notContains: 'No contiene',
  endsWith: 'Termina con',
  equals: 'Igual',
  notEquals: 'Diferente',
  noFilter: 'Sin filtro',
  filter: 'Filtrar',
  clear: 'Limpiar',
  apply: 'Aplicar',
  matchAll: 'Coincidir todos',
  matchAny: 'Coincidir cualquiera',
  addRule: 'Agregar regla',
  removeRule: 'Eliminar regla',
  accept: 'Sí',
  reject: 'No',
  choose: 'Elegir',
  upload: 'Subir',
  cancel: 'Cancelar',
  today: 'Hoy',
  weekHeader: 'Sem',
  firstDayOfWeek: 1,
  dateFormat: 'yy-mm-dd',
  emptyMessage: 'Sin resultados',
  emptyFilterMessage: 'Sin resultados',
  emptySelectionMessage: 'Sin selección',
  selectionMessage: '{0} elementos seleccionados',
  searchMessage: '{0} resultados disponibles',
  emptySearchMessage: 'Sin resultados',
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'],
  monthNames: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  monthNamesShort: [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ],
  aria: {
    ...originalLocale.aria,
    firstPageLabel: 'Primera página',
    lastPageLabel: 'Última página',
    nextPageLabel: 'Página siguiente',
    prevPageLabel: 'Página anterior',
    pageLabel: 'Página {page}',
    rowsPerPageLabel: 'Filas por página',
    selectRow: 'Seleccionar fila',
    unselectRow: 'Quitar selección',
    close: 'Cerrar',
    nextMonth: 'Mes siguiente',
    prevMonth: 'Mes anterior',
    nextYear: 'Año siguiente',
    prevYear: 'Año anterior',
    chooseDate: 'Elegir fecha',
    chooseMonth: 'Elegir mes',
    chooseYear: 'Elegir año',
    previous: 'Anterior',
    next: 'Siguiente',
    navigation: 'Navegación',
    showFilterMenu: 'Mostrar filtros',
    hideFilterMenu: 'Ocultar filtros',
  },
};
const languages = ['EN', 'ES'];
const language = computed({
  get: () => locale.value.toUpperCase(),
  set: (value) => {
    if (value) locale.value = value.toLowerCase();
  },
});
const failedLogo = ref(false);
const logo =
    config.slug === 'open-library'
        ? import.meta.env.VITE_LOGO_DEV_TOKEN
            ? `${import.meta.env.VITE_LOGO_URL}/${config.website}?token=${import.meta.env.VITE_LOGO_DEV_TOKEN}`
            : '/brand.svg'
        : `${import.meta.env.VITE_LOGO_URL}/${config.website}`;
watch(
    locale,
    (value) => {
      document.documentElement.lang = value;
      Object.assign(
          prime.config.locale,
          value === 'es' ? { ...originalLocale, ...spanishLocale } : originalLocale
      );
    },
    { immediate: true }
);
</script>
<template>
  <a href="#main-content" class="skip-link">{{ tr('Skip to content') }}</a>
  <pv-toast />
  <pv-toolbar class="shell-toolbar" :aria-label="tr('Navigation')">
    <template #start>
      <pv-select-button
          v-if="config.reverseToolbar"
          v-model="language"
          :options="languages"
          :allow-empty="false"
          :aria-label="tr('Language')"
      />
      <div v-else class="brand">
        <img
            :src="failedLogo ? '/brand.svg' : logo"
            :alt="config.brand"
            class="brand-logo"
            @error="failedLogo = true"
        />
        <div>
          <strong>{{ config.brand }}</strong
          ><small>{{ tr(config.tagline) }}</small>
        </div>
      </div>
    </template>
    <template #center
    ><nav :aria-label="tr('Navigation')">
      <router-link to="/home">{{ tr('Home') }}</router-link
      ><router-link v-if="config.kind !== 'tend'" :to="config.route">{{
        tr(config.nav)
      }}</router-link
    ><router-link v-if="config.kind === 'tambo'" to="/commerce/stores/new">{{
        tr('New Store')
      }}</router-link>
    </nav></template
    >
    <template #end>
      <div v-if="config.reverseToolbar" class="brand">
        <img
            :src="failedLogo ? '/brand.svg' : logo"
            :alt="config.brand"
            class="brand-logo"
            @error="failedLogo = true"
        />
        <div>
          <strong>{{ config.brand }}</strong
          ><small>{{ tr(config.tagline) }}</small>
        </div>
      </div>
      <pv-select-button
          v-else
          v-model="language"
          :options="languages"
          :allow-empty="false"
          :aria-label="tr('Language')"
      />
    </template>
  </pv-toolbar>
  <main id="main-content"><router-view /></main>
  <footer class="footer">
    <span>{{ config.brand }} · {{ tr(config.section) }}</span
    ><span>Bernie Aarón Rivas Méndez · u20241f109</span>
  </footer>
</template>
