<template>
  <div v-if="isOpen" class="modal-container">
    <div class="modal-content">
      <h3 class="modal-title text-center mb-4 fw-bold">Update Management Port</h3>

      <!-- Port Name (non modifiable) -->
      <div class="form-group row mb-3 align-items-center">
        <label class="col-4 text-end">Port</label>
        <div class="col-8">
          <input type="text" :value="selectedPort" class="form-control" disabled/>
        </div>
      </div>

      <!-- Description -->
      <div class="form-group row mb-3 align-items-center">
        <label class="col-4 text-end">Description</label>
        <div class="col-8">
          <input type="text" v-model="localDescription" class="form-control"/>
        </div>
      </div>

      <!-- Port Status -->
      <div class="form-group row mb-3 align-items-center">
        <label class="col-4 text-end">Port Status</label>
        <div class="col-8">
          <div class="btn-group">
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localPortStatus === 'Enabled' }"
                @click="localPortStatus = ('Enabled')"
            >
              Enabled
            </button>
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localPortStatus === 'Disabled' }"
                @click="localPortStatus = ('Disabled')"
            >
              Disabled
            </button>
          </div>
        </div>
      </div>

      <!-- DHCP? -->
      <div class="form-group row mb-3 align-items-center">
        <label class="col-4 text-end">DHCP</label>
        <div class="col-8">
          <div class="btn-group">
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localDHCP === true }"
                @click="localPortStatus = true"
            >
              Enabled
            </button>
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localDHCP === false }"
                @click="localPortStatus = false"
            >
              Disabled
            </button>
          </div>
        </div>
      </div>

      <!-- IP Settings -->
      <div v-if="localDHCP === false">
        <div class="form-group row mb-3 align-items-center">
          <label class="col-4 text-end">IP</label>
          <div class="col-8">
            <input type="text" v-model="localIP" class="form-control"/>
          </div>
        </div>
        <div class="form-group row mb-3 align-items-center">
          <label class="col-4 text-end">Mask</label>
          <div class="col-8">
            <input type="text" v-model="localMask" class="form-control"/>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="modal-footer">
        <button class="btn btn-secondary me-2" @click="close">Cancel</button>
        <button class="btn btn-primary" @click="updatePort">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    selectedPort: String,
    description: String,
    portStatus: Boolean,
    IP: String,
    mask: String,
    dhcp: Boolean,

  },
  data() {
    return {
      localDescription: this.description,
      localPortStatus: this.portStatus,
      localIP: this.IP,
      localMask: this.mask,
      localDHCP: this.dhcp,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    updatePort() {
      this.$emit('update', {
        description: this.localDescription,
        portStatus: this.localPortStatus,
        IP: this.localIP,
        mask: this.localMask,
        DHCP: this.localDHCP,
      });
      this.close();
    }
  }
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 650px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.btn-option {
  border: 1px solid #000;
  margin-right: 5px;
}

.btn {
  border-radius: 0 !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
</style>
