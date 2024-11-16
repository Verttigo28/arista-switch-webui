<template>
  <div v-if="isOpen" class="modal-container">
    <div class="modal-content">
      <h3 class="modal-title text-center mb-4 fw-bold">Update Port-Channel</h3>

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

      <!-- Port Type -->
      <div class="form-group row mb-3 align-items-center">
        <label class="col-4 text-end">Type</label>
        <div class="col-8">
          <div class="btn-group">
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localPortType === 'Trunk' }"
                @click="localPortType = 'Trunk'"
            >
              Trunk
            </button>
            <button
                class="btn btn-option"
                :class="{ 'btn-primary': localPortType === 'Access' }"
                @click="localPortType = ('Access')"
            >
              Access
            </button>
          </div>
        </div>
      </div>

      <!-- VLAN Inputs -->
      <div v-if="localPortType === 'Trunk'">
        <div class="form-group row mb-3 align-items-center">
          <label class="col-4 text-end">Native VLAN</label>
          <div class="col-8">
            <input type="text" v-model="localNativeVlan" class="form-control"/>
          </div>
        </div>
        <div class="form-group row mb-3 align-items-center">
          <label class="col-4 text-end">Allowed VLANs</label>
          <div class="col-8">
            <input type="text" v-model="localAllowedVlans" class="form-control"/>
          </div>
        </div>
      </div>

      <!-- Access Mode VLANs -->
      <div v-else>
        <div class="form-group row mb-3 align-items-center">
          <label class="col-4 text-end">VLAN</label>
          <div class="col-8">
            <input type="text" v-model="localVlan" class="form-control"/>
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
    portStatus: String,
    portType: String,
    nativeVlan: String,
    allowedVlans: String,
    vlan: String,
  },
  data() {
    return {
      localDescription: this.description,
      localPortStatus: this.portStatus,
      localPortType: this.portType,
      localNativeVlan: this.nativeVlan,
      localAllowedVlans: this.allowedVlans,
      localVlan: this.vlan,
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
        portType: this.localPortType,
        nativeVlan: this.localNativeVlan,
        allowedVlans: this.localAllowedVlans,
        vlan: this.localVlan,
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
