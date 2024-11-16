<template>
  <div class="action-container">
    <button
        class="btn btn-primary"
        @mousedown="config()">
      Config port(s)
    </button>
    <button
        class="btn btn-primary"
        @mousedown="configPO()">
      Config port-channel
    </button>
    <button
        class="btn btn-primary"
        @mousedown="configSys()">
      Config system
    </button>
  </div>
</template>

<script>
import { usePortStore } from '@/stores/portStore';
let portStore

export default {
  setup() {
    portStore = usePortStore();
  },
  props: {

  },
  methods: {
    config() {
      const test = portStore.getSelectedPorts
      console.log(test.toString())
    },
    configPO() {
      const test = portStore.getSelectedPorts
      console.log(test.toString())
    },
    configSys() {
      const test = portStore.getSelectedPorts
      console.log(test.toString())
    }
  }
};
</script>

