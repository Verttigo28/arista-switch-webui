<template>
  <div class="switch-container">
    <h2 class="text-white text-center mb-4">Arista Switch Configurator</h2>
    <AuthComponent :auth.sync="auth" />
    <ActionComponent />
    <PortsComponent :auth="auth" />
  </div>
</template>

<script>
import AuthComponent from './AuthComponent.vue';
import PortsComponent from './PortsComponent.vue';
import ActionComponent from "@/components/ActionComponent.vue";

export default {
  components: {ActionComponent, AuthComponent, PortsComponent },
  data() {
    return {
      auth: {
        ipAddress: '10.99.99.245',
        username: 'admin',
        password: 'test1234'
      }
    };
  }
};
</script>
