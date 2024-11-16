<template>
  <div id="app">
    <div id="loading" class="spinner-border text-danger" role="status" style="display: none"></div>
    <SwitchComponent />
  </div>
</template>

<script>
import SwitchComponent from './components/SwitchComponent.vue';

export default {
  name: 'App',
  components: {
    SwitchComponent
  }
};
</script>
