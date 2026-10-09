import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Listbox from 'primevue/listbox';
import App from './app.component.vue';
import router from './router.js';
import i18n from './i18n.js';
import { config } from './config.js';
import './style.css';
const app = createApp(App);
app
    .use(createPinia())
    .use(router)
    .use(i18n)
    .use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: false } } })
    .use(ToastService);
app.component('pv-toolbar', Toolbar);
app.component('pv-button', Button);
app.component('pv-card', Card);
app.component('pv-select-button', SelectButton);
app.component('pv-input-text', InputText);
app.component('pv-textarea', Textarea);
app.component('pv-select', Select);
app.component('pv-datepicker', DatePicker);
app.component('pv-data-table', DataTable);
app.component('pv-column', Column);
app.component('pv-message', Message);
app.component('pv-dialog', Dialog);
app.component('pv-toast', Toast);
app.component('pv-listbox', Listbox);
document.documentElement.style.setProperty('--brand', config.color);
app.mount('#app');