<template>
  <!-- <div class="design-container">
    <a-card>
      <a-button @click="handleSave(0)">保存</a-button>
      <a-button @click="handleSave(1)">保存并启用</a-button>
      <a-button @click="handleRedo()">前进</a-button>
      <a-button @click="handleUndo()">后退</a-button>
      <a-button @click="handleZoom(1)">放大</a-button>
      <a-button @click="handleZoom(-1)">缩小</a-button>
      <a-button @click="handleDownload()">下载</a-button>
    </a-card>

    <div class="wf-container">
      <div id="wf-designer" ref="container" class="containerBox"></div>
      <div id="js-properties-panel" class="panel"></div>
    </div>
  </div> -->

  <div class="designer-container">
    <a-card>
      <a-button @click="handleSave(0)">保存</a-button>
      <a-button @click="handleRedo()">前进</a-button>
      <a-button @click="handleUndo()">后退</a-button>
      <a-button @click="handleZoom(1)">放大</a-button>
      <a-button @click="handleZoom(-1)">缩小</a-button>
      <a-button @click="handleDownload()">下载</a-button>
    </a-card>
    <!-- <div class="button-box">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button type="warning" @click="handleDownload">下载</el-button>
      </div> -->
    <div ref="container" class="containerBox" />
    <div id="js-properties-panel" class="panel" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
// BPMN国际化
import customTranslate from '@/components/bpmn/custom/CustomTranslate';

const container = ref(null);
let bpmnModeler = null;
onMounted(async () => {
  init();
});
const init = () => {
  const customTranslateModule = {
    translate: ['value', customTranslate],
  };
  bpmnModeler = new BpmnModeler({
    container: container.value,
    propertiesPanel: {
      parent: '#js-properties-panel',
    },
    // 右侧属性面板
    additionalModules: [
      propertiesPanelModule,
      propertiesProviderModule,
      // 国际化
      customTranslateModule,
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptor,
    },
  });
  bpmnModeler.createDiagram(() => {
    bpmnModeler.get('canvas').zoom('fit-viewport');
  });
};
const save = () => {
  bpmnModeler.saveXML({ format: true }, (err, data) => {
    const processInfo = {};
    processInfo.xml = data.replace(/camunda/gi, 'activiti');
    processInfo.processId = document.getElementById('camunda-id').value;
    processInfo.processName = document.getElementById('camunda-name').innerHTML;
    console.log(processInfo, err);
  });
};
const handleDownload = () => {
  bpmnModeler.saveXML({ format: true }, (err, data) => {
    const dataTrack = 'bpmn';
    const a = document.createElement('a');
    const name = `diagram.${dataTrack}`;
    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log(err);
  });
};
</script>
<style>
.designer-container {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
}
.containerBox {
  background: #fff;
  height: 100%;
}

.bjs-powered-by {
  display: none;
}

.button-box {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  position: absolute;
}

.panel {
  width: 400px;
  position: absolute;
  top: 1px;
  right: 1px;
  height: 100%;
  overflow: auto;
}
</style>
