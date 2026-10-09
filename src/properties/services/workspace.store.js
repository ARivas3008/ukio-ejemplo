import { defineStore } from 'pinia';
import { markRaw } from 'vue';
import { WorkspaceService } from './ukio.service.js';
import { usePropertiesStore } from './properties.store.js';
export const useWorkspace = defineStore('workspace', {
    state: () => ({
        data: {},
        loading: false,
        ready: false,
        error: '',
        service: markRaw(new WorkspaceService()),
    }),
    actions: {
        async load() {
            this.loading = true;
            this.error = '';
            try {
                const data = await this.service.load();
                this.data = data;
                usePropertiesStore().replace(data);
                this.ready = true;
            } catch (error) {
                this.error = 'Unable to connect to the API. Start the server and try again.';
                this.ready = false;
            } finally {
                this.loading = false;
            }
        },
    },
});