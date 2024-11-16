<template>
  <div class="port-container">
    <div class="port-row">
      <!-- Ligne supérieure : ports impairs et 2 ports-channel -->
      <div
          v-for="(port, index) in orderedPorts.top"
          :key="'port-top-' + index"
          :class="['port-box', { 'port-channel': isPortInChannel(port), 'selected': isSelected(port) }]"
          :style="{ backgroundColor: getPortColor(port) }"
          @mousedown="handleClick($event, port)"

          :title="port"
      >
        {{ getShortPortName(port) }}
      </div>
    </div>

    <div class="port-row">
      <!-- Ligne inférieure : ports pairs, Management et 2 ports-channel -->
      <div
          v-for="(port, index) in orderedPorts.bottom"
          :key="'port-bottom-' + index"
          :class="['port-box', { 'port-channel': isPortInChannel(port), 'selected': isSelected(port) }]"
          :style="{ backgroundColor: getPortColor(port) }"
          @click="handleClick($event, port)"
          :title="port"
      >
        {{ getShortPortName(port) }}
      </div>
    </div>

    <PortSettingsComponent
        v-if="showPSettings"
        :isOpen="showPSettings"
        :selectedPort="selectedPort"
        :description="description"
        :portStatus="portStatus"
        :portType="portType"
        :nativeVlan="nativeVlan"
        :allowedVlans="allowedVlans"
        :vlan="vlan"
        @close="showPSettings = false"
    />
    <ManagementSettingsModal
        v-if="showMSettings"
        :isOpen="showMSettings"
        :selectedPort="selectedPort"
        :description="description"
        :portStatus="portStatus"
        :dhcp="dhcp"
        :IP="IP"
        :mask="mask"
        @close="showMSettings = false"
    />
  </div>
</template>

<script>
import PortSettingsComponent from '../modal/PortSettingsModal.vue';
import {usePortStore} from '@/stores/portStore';
import {getShortPortName, sendEapiRequest} from '@/js/EAPI'
import ManagementSettingsModal from "@/modal/ManagementSettingsModal.vue";

let portStore;

export default {
  setup() {
    portStore = usePortStore();
  },
  components: {ManagementSettingsModal, PortSettingsComponent},
  props: {
    auth: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ports: [],
      orderedPorts: {top: [], bottom: []},
      showPSettings: false,
      showMSettings: false,
      selectedPort: null,
      description: null,
      portStatus: null,
      portType: null,
      accessPolicy: null,
      nativeVlan: null,
      allowedVlans: null,
      vlan: null,
      selectedPorts: [],
      IP: null,
      dhcp: false,
      portChannelMembers: {},
      portChannelColors: {},
      colors: [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#33FFF5',
        '#FF0000', '#FF8C00', '#FFD700', '#ADFF2F', '#32CD32', '#00FA9A',
        '#00CED1', '#1E90FF', '#4169E1', '#8A2BE2', '#FF69B4', '#FF1493',
        '#DB7093', '#FF6347', '#FF4500', '#DA70D6', '#BA55D3', '#9370DB',
        '#7B68EE', '#00FF7F', '#40E0D0', '#00BFFF', '#FF00FF', '#C71585',
        '#DC143C', '#8B0000'
      ]

    };
  },
  created() {
    this.fetchPorts();
    this.fetchPortChannelInfo();
  },
  methods: {
    getShortPortName,
    async fetchPorts() {
      try {
        const response = await sendEapiRequest(this.auth, 'show interfaces status');
        const interfaces = response.interfaceStatuses;
        this.ports = Object.keys(interfaces);
        this.orderedPorts = this.formatPorts(this.ports);
      } catch (error) {
        console.error('Error while loading ports:', error);
      }
    },
    handleClick(event, port) {
      event.preventDefault();
      event.stopPropagation();
      if (event.shiftKey) {
        const portIndex = this.selectedPorts.indexOf(port);
        if (portIndex === -1) {
          //Add port
          if (this.containsPOInSelectedPort() && this.selectedPorts.length > 0) {
            this.selectedPorts = []
          }
          if (this.isPortInChannel(port)) {
            this.selectedPorts = []
            this.findPortColleagues(port).forEach((p) => {
              this.selectedPorts = [...this.selectedPorts, p];
            })
          }
          this.selectedPorts = [...this.selectedPorts, port];

        } else {
          this.selectedPorts = this.selectedPorts.filter(p => p !== port);
          if (this.isPortInChannel(port)) {
            this.findPortColleagues(port).forEach((p) => {
              this.selectedPorts = this.selectedPorts.filter(p => p !== p);
            })
          }
        }
        portStore.setSelectedPorts(this.selectedPorts);
      } else {
        if (this.selectedPorts.length > 0) {
          this.selectedPorts = []
        } else {
          this.fetchPortInfo(port, this.isPortInChannel(port));
        }
      }
    },
    containsPOInSelectedPort() {
      let bool = false;
      if (this.selectedPorts.length > 0) {
        this.selectedPorts.forEach((p) => {
          if (this.isPortInChannel(p)) {
            bool = true;
          }
        })
      } else {
        bool = false;
      }
      return bool;
    },
    isSelected(port) {
      return this.selectedPorts.includes(port);
    },
    findPortColleagues(port) {
      const targetChannel = this.portChannelMembers[port];

      const colleagues = Object.keys(this.portChannelMembers).filter(
          key => this.portChannelMembers[key] === targetChannel && key !== port
      );

      return colleagues ? colleagues : []
    },

    formatPorts(ports) {
      const ethernetPorts = ports
          .filter(port => port.startsWith('Ethernet'))
          .sort((a, b) => parseInt(a.replace('Ethernet', '')) - parseInt(b.replace('Ethernet', '')));
      const portChannels = ports.filter(port => port.startsWith('Port-Channel')).sort();
      const managementPort = ports.find(port => port.startsWith('Management'));

      const topRow = ethernetPorts.filter(port => {
        const portNumber = parseInt(port.replace('Ethernet', ''), 10);
        return portNumber % 2 !== 0; // Ports impairs
      });

      const bottomRow = ethernetPorts.filter(port => {
        const portNumber = parseInt(port.replace('Ethernet', ''), 10);
        return portNumber % 2 === 0;
      });

      const topPortChannels = portChannels.slice(0, 2);
      const bottomPortChannels = portChannels.slice(2, 4);
      topRow.push(...topPortChannels);
      bottomRow.push(...bottomPortChannels);

      if (managementPort) {
        bottomRow.push(managementPort);
      }

      while (topRow.length < bottomRow.length) {
        topRow.push('');
      }
      while (bottomRow.length < topRow.length) {
        bottomRow.push('');
      }

      return {top: topRow, bottom: bottomRow};
    }
    ,

    async fetchPortChannelInfo() {
      try {
        const response = await sendEapiRequest(this.auth, 'show port-channel');
        const portChannels = response.portChannels;

        let colorIndex = 0;
        Object.keys(portChannels).forEach((channel) => {
          const color = this.colors[colorIndex % this.colors.length];
          colorIndex++;

          Object.keys(portChannels[channel].activePorts).forEach(port => {
            this.portChannelMembers[port] = channel;
            this.portChannelColors[channel] = color;
          });
        });
      } catch (error) {
        console.error('Error while loading port-channel port info :', error);
      }
    },

    isPortInChannel(port) {
      return this.portChannelMembers.hasOwnProperty(port);
    },

    getPortColor(port) {
      const channel = this.portChannelMembers[port];
      return this.portChannelColors[channel] || '#2c2c2c'; // Couleur par défaut
    },

    async fetchPortInfo(port, isPortChannel) {
      try {
        if (isPortChannel) {
          console.log("handle PO")
        } else {
          let number;
          if (String(port).includes('Ethernet')) {
            number = parseInt(port.match(/\d+$/)?.[0], 10);
          } else if (String(port).includes('Port-Channel')) {
            number = 48 + parseInt(port.match(/\d+$/)?.[0], 10);
          } else {
            //Handle that
            const response = await sendEapiRequest(this.auth, [`enable`, `configure`, `interface ${port}`, `show ip interface`]);
            const portInfo = response[response.length - 1].interfaces["Management1"]

            if (portInfo.interfaceStatus === "disabled") {
              this.portStatus = "Disabled"
            } else {
              this.portStatus = "Enabled";
            }
            if (!portInfo.interfaceAddress.dhcp) {
              this.IP = portInfo.interfaceAddress.primaryIp.address
              this.mask = portInfo.interfaceAddress.primaryIp.maskLen
            } else {
              this.dhcp = true
            }

            this.description = portInfo.description

            this.selectedPort = port;
            this.showMSettings = true;
            return false;
          }

          const response = await sendEapiRequest(this.auth, [`show interfaces ${port}`, `show interfaces ethernet ${number} trunk`]);

          const portInfo = response[0].interfaces[`${port}`]
          const switchMode = response[1].trunks[`${port}`]

          if (switchMode.portMode === "access") {
            this.portType = "Access"
            this.vlan = String(switchMode.nativeVlan)
          } else {
            this.portType = "Trunk"
            this.allowedVlans = [...switchMode.allowedVlans.vlanIds].toString()
          }
          if (portInfo.interfaceStatus === "disabled") {
            this.portStatus = "Disabled"
          } else {
            this.portStatus = "Enabled";
          }

          this.description = portInfo.description;
          this.selectedPort = port;
          this.showPSettings = true;

        }
      } catch (error) {
        console.error('Error while loading port info:', error);
      }
    },
  }
};
</script>
