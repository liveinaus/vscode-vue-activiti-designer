<template>
  <div class="app-containers">
    <Modeler v-if="bpmnXml" :bpmnXml="bpmnXml" />
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
    counter: 0,
    bpmnXml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
             id="definitions"
             targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="process" name="Simple Process" isExecutable="true">
    <startEvent id="startEvent" name="Start"></startEvent>
    <endEvent id="endEvent" name="End"></endEvent>
    <sequenceFlow id="flow" sourceRef="startEvent" targetRef="endEvent"></sequenceFlow>
  </process>
</definitions>
`
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