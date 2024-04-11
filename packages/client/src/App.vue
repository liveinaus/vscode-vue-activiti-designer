<template>
  <div class="app-containers">
    <Modeler />
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
    counter: 0
  }),
  methods: {
    increment() {
      this.counter += 1
      vscode.postMessage({
        message: 'extension can listen to vue events by using postMessage method!'
      })
    },
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