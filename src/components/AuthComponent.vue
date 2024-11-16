<template>
  <div class="auth-container">
    <input type="text" v-model="auth.ipAddress" placeholder="IP" class="form-control auth-input" />
    <input type="text" v-model="auth.username" placeholder="Utilisateur" class="form-control auth-input" />
    <input type="password" v-model="auth.password" placeholder="Mot de passe" class="form-control auth-input" />
    <button
        class="btn btn-primary"
        @click="login()">
      Login
    </button>
  </div>
</template>

<script>
export default {
  props: {
    auth: {
      type: Object,
      required: true
    }
  }
};
</script>
