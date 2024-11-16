import { defineStore } from 'pinia';

export const usePortStore = defineStore('portStore', {
    state: () => ({
        selectedPorts: [],
    }),
    actions: {
        setSelectedPorts(ports) {
            this.selectedPorts = ports;
        },
    },
    getters: {
        getSelectedPorts() {
            return this.selectedPorts
        }
    }
});
