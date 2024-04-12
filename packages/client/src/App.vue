<template>
  <div class="app-containers" v-if="bpmnXml">
    <Modeler :bpmnXml="bpmnXml" @elementChanged="xmlChanged" :key="bpmnXml" />
    <Panel />
    <BpmnActions />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BpmnActions from './components/bpmn-actions';
import Modeler from './components/modeler';
import Panel from './components/panel';

export default defineComponent({
  name: 'App',
  components: {
    Modeler, Panel, BpmnActions
  },
  data: () => ({
    bpmnXml: ''
  }),
  methods: {
    xmlChanged(xml: string) {
      this.bpmnXml = xml;
      this.updateXml();
    },
    loadXml(xml: string) {
      this.bpmnXml = xml;
      console.log('loadXml', xml);
    }, updateXml() {
      vscode.postMessage({
        message: 'updateXml', 'xml': this.bpmnXml
      })
    }
  },
  mounted() {
    window.addEventListener("message", (event) => {
      const vscodeData = event.data;
      if (vscodeData.command === "loadXml") {
        if (vscodeData?.data) {
          this.loadXml(vscodeData?.data);
        }
      }
    });
  }

});
</script>

<style>
.centered-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-larger {
  font-size: x-large;
  margin-bottom: 1rem;
}

.text-large {
  font-size: large;
  margin-bottom: 1rem;
}
</style>