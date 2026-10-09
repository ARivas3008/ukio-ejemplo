import { defineStore } from 'pinia';
export const usePropertiesStore = defineStore('properties', {
    state: () => ({ resources: {} }),
    actions: {
        replace(data) {
            this.resources = Object.fromEntries(
                ['cities', 'apartments'].map((key) => [key, data[key] || []])
            );
        },
    },
});
