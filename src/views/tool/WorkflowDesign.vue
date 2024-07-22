<template>
  <div class="design-container">
    <div>
      <a-button @click="handleSave(0)">保存</a-button>
      <a-button @click="handleRedo()">前进</a-button>
      <a-button @click="handleUndo()">后退</a-button>
      <a-button @click="handleZoom(1)">放大</a-button>
      <a-button @click="handleZoom(-1)">缩小</a-button>

      <a-tooltip placement="right">
        <template #title>
          <span>00</span>
        </template>
        <a-button @click="handleDownload()">下载</a-button>
      </a-tooltip>
    </div>

    <div class="wf-container">
      <div id="wf-designer" ref="container"></div>
      <div id="js-properties-panel" class="panel"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { markRaw } from 'vue';
import { CustomModeler } from '@/components/bpmn/index.js';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// bpmn-js-properties-panel相关
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
// BPMN国际化
import customTranslate from '@/components/bpmn/custom/CustomTranslate';
import type { WorkflowModel } from '@/api/workflowDesignApi';
import { save } from '@/api/workflowDesignApi';

/*
npm install bpmn-js -D
npm install bpmn-js-properties-panel -D
npm install camunda-bpmn-moddle -D
*/
// 编辑修改
const modelBpmn = ref<WorkflowModel>(
  // id: '',
  // keycode: '',
  // name: '',
  // nameEn: '',
  // group: 'general',
  // model:
  //   '"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<bpmn:definitions xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\" xmlns:bpmn=\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\" xmlns:bpmndi=\\"http://www.omg.org/spec/BPMN/20100524/DI\\" xmlns:dc=\\"http://www.omg.org/spec/DD/20100524/DC\\" xmlns:di=\\"http://www.omg.org/spec/DD/20100524/DI\\" id=\\"Definitions_1\\" targetNamespace=\\"http://bpmn.io/schema/bpmn\\">\\n  <bpmn:process id=\\"Process_1\\" isExecutable=\\"false\\">\\n    <bpmn:startEvent id=\\"StartEvent_1\\" name=\\"开始\\">\\n      <bpmn:outgoing>Flow_1dppvlw</bpmn:outgoing>\\n    </bpmn:startEvent>\\n    <bpmn:endEvent id=\\"Event_1ms7asv\\" name=\\"结束\\">\\n      <bpmn:incoming>Flow_1dppvlw</bpmn:incoming>\\n    </bpmn:endEvent>\\n    <bpmn:sequenceFlow id=\\"Flow_1dppvlw\\" sourceRef=\\"StartEvent_1\\" targetRef=\\"Event_1ms7asv\\" />\\n  </bpmn:process>\\n  <bpmndi:BPMNDiagram id=\\"BPMNDiagram_1\\">\\n    <bpmndi:BPMNPlane id=\\"BPMNPlane_1\\" bpmnElement=\\"Process_1\\">\\n      <bpmndi:BPMNShape id=\\"_BPMNShape_StartEvent_2\\" bpmnElement=\\"StartEvent_1\\">\\n        <dc:Bounds x=\\"173\\" y=\\"102\\" width=\\"36\\" height=\\"36\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\"180\\" y=\\"145\\" width=\\"22\\" height=\\"14\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\"Event_1ms7asv_di\\" bpmnElement=\\"Event_1ms7asv\\">\\n        <dc:Bounds x=\\"262\\" y=\\"102\\" width=\\"36\\" height=\\"36\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\"269\\" y=\\"145\\" width=\\"22\\" height=\\"14\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNEdge id=\\"Flow_1dppvlw_di\\" bpmnElement=\\"Flow_1dppvlw\\">\\n        <di:waypoint x=\\"209\\" y=\\"120\\" />\\n        <di:waypoint x=\\"262\\" y=\\"120\\" />\\n      </bpmndi:BPMNEdge>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn:definitions>\\n"',
  // status: '0',
  {
    id: '12',
    keycode: '',
    name: '',
    nameEn: '',
    group: 'general',
    model:
      '"<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<bpmn:definitions xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\" xmlns:bpmn=\\"http://www.omg.org/spec/BPMN/20100524/MODEL\\" xmlns:bpmndi=\\"http://www.omg.org/spec/BPMN/20100524/DI\\" xmlns:dc=\\"http://www.omg.org/spec/DD/20100524/DC\\" xmlns:camunda=\\"http://camunda.org/schema/1.0/bpmn\\" xmlns:di=\\"http://www.omg.org/spec/DD/20100524/DI\\" id=\\"Definitions_1\\" targetNamespace=\\"http://bpmn.io/schema/bpmn\\">\\n  <bpmn:process id=\\"Process_1\\" isExecutable=\\"false\\">\\n    <bpmn:startEvent id=\\"StartEvent_1\\" name=\\"开始name\\">\\n      <bpmn:extensionElements>\\n        <camunda:properties>\\n          <camunda:property name=\\"start\\" value=\\"开始\\" />\\n        </camunda:properties>\\n      </bpmn:extensionElements>\\n      <bpmn:outgoing>Flow_1p65zry</bpmn:outgoing>\\n    </bpmn:startEvent>\\n    <bpmn:endEvent id=\\"Event_1rx3ggk\\" name=\\"结束\\" camunda:asyncBefore=\\"true\\" camunda:jobPriority=\\"1\\">\\n      <bpmn:extensionElements>\\n        <camunda:failedJobRetryTimeCycle>3</camunda:failedJobRetryTimeCycle>\\n        <camunda:properties>\\n          <camunda:property name=\\"end\\" value=\\"结束\\" />\\n        </camunda:properties>\\n      </bpmn:extensionElements>\\n      <bpmn:incoming>Flow_0rigw5v</bpmn:incoming>\\n    </bpmn:endEvent>\\n    <bpmn:task id=\\"Activity_0egrn7b\\" name=\\"事件\\">\\n      <bpmn:incoming>Flow_1p65zry</bpmn:incoming>\\n      <bpmn:outgoing>Flow_0rigw5v</bpmn:outgoing>\\n    </bpmn:task>\\n    <bpmn:sequenceFlow id=\\"Flow_1p65zry\\" sourceRef=\\"StartEvent_1\\" targetRef=\\"Activity_0egrn7b\\" />\\n    <bpmn:sequenceFlow id=\\"Flow_0rigw5v\\" sourceRef=\\"Activity_0egrn7b\\" targetRef=\\"Event_1rx3ggk\\" />\\n  </bpmn:process>\\n  <bpmndi:BPMNDiagram id=\\"BPMNDiagram_1\\">\\n    <bpmndi:BPMNPlane id=\\"BPMNPlane_1\\" bpmnElement=\\"Process_1\\">\\n      <bpmndi:BPMNEdge id=\\"Flow_1p65zry_di\\" bpmnElement=\\"Flow_1p65zry\\">\\n        <di:waypoint x=\\"209\\" y=\\"120\\" />\\n        <di:waypoint x=\\"245\\" y=\\"120\\" />\\n        <di:waypoint x=\\"245\\" y=\\"130\\" />\\n        <di:waypoint x=\\"320\\" y=\\"130\\" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNEdge id=\\"Flow_0rigw5v_di\\" bpmnElement=\\"Flow_0rigw5v\\">\\n        <di:waypoint x=\\"420\\" y=\\"130\\" />\\n        <di:waypoint x=\\"461\\" y=\\"130\\" />\\n        <di:waypoint x=\\"461\\" y=\\"120\\" />\\n        <di:waypoint x=\\"542\\" y=\\"120\\" />\\n      </bpmndi:BPMNEdge>\\n      <bpmndi:BPMNShape id=\\"_BPMNShape_StartEvent_2\\" bpmnElement=\\"StartEvent_1\\">\\n        <dc:Bounds x=\\"173\\" y=\\"102\\" width=\\"36\\" height=\\"36\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\"167\\" y=\\"145\\" width=\\"50\\" height=\\"14\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\"Event_1rx3ggk_di\\" bpmnElement=\\"Event_1rx3ggk\\">\\n        <dc:Bounds x=\\"542\\" y=\\"102\\" width=\\"36\\" height=\\"36\\" />\\n        <bpmndi:BPMNLabel>\\n          <dc:Bounds x=\\"550\\" y=\\"145\\" width=\\"22\\" height=\\"14\\" />\\n        </bpmndi:BPMNLabel>\\n      </bpmndi:BPMNShape>\\n      <bpmndi:BPMNShape id=\\"Activity_0egrn7b_di\\" bpmnElement=\\"Activity_0egrn7b\\">\\n        <dc:Bounds x=\\"320\\" y=\\"90\\" width=\\"100\\" height=\\"80\\" />\\n      </bpmndi:BPMNShape>\\n    </bpmndi:BPMNPlane>\\n  </bpmndi:BPMNDiagram>\\n</bpmn:definitions>\\n"',
    status: '0',
  },
);
// bpmn建模器
// let bpmnModeler: CustomModeler;
const container = ref(null);
let bpmnModeler: any = CustomModeler;
onMounted(() => {
  initBpmnModeler();
});

const initBpmnModeler = () => {
  // 加markRaw去除双向绑定作用域
  bpmnModeler = markRaw(
    new BpmnModeler({
      // new CustomModeler({
      // container: document.getElementById('wf-designer'),
      container: container.value,
      // 添加控制板
      propertiesPanel: {
        parent: '#js-properties-panel',
      },
      // 右侧属性面板
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        // 汉化
        { translate: ['value', customTranslate] },
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
      },
    }),
  );

  // 创建空白流程图
  bpmnModeler.createDiagram(() => {
    bpmnModeler.get('canvas').zoom('fit-viewport'); // 填充视图
    //样式修改
    // styleChange();
  });
  //判断是否编辑还是创建状态
  createNewDiagram();
  // 监听节点变化
  watchBpmnChanged();
};
// 渲染
const createNewDiagram = () => {
  // 将字符串转换成图显示出来
  if (modelBpmn.value.id) {
    const bpmnXmlStr = JSON.parse(modelBpmn.value.model);
    console.log(bpmnXmlStr);
    // 内部调用了importXML方法，读取内部的默认xml字符串
    bpmnModeler.importXML(bpmnXmlStr, function (err) {
      if (err) {
        console.error('failed to load diagram', err);
      } else {
        console.log('success');
      }
    });
  }
};
// 监听节点变化
const watchBpmnChanged = () => {
  // 监听节点选择变化
  bpmnModeler.on('selection.changed', e => {
    const element = e.newSelection[0];
    if (element) {
      // 渲染节点参数
    } else {
      // 渲染主表单配置参数
    }
    // console.log(element);
  });

  //  监听节点属性变化
  bpmnModeler.on('element.changed', e => {
    const { element } = e;
    // console.log(element);
  });
};
//保存
const handleSave = (isDeploy: number) => {
  const model: WorkflowModel = {
    id: '',
    keycode: '',
    name: '',
    nameEn: '',
    group: 'general',
    model: '',
    status: isDeploy ? '1' : '0',
  };
  bpmnModeler.saveXML({ format: true }).then(data => {
    console.log('save model data is ', data);

    model.model = JSON.stringify(data.xml);
    console.log(JSON.stringify(model));
    save(model);
  });
};
// 下载
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

// 放大缩放
let scale = ref<number>(1);
const handleZoom = (zoom: number) => {
  if (scale.value + zoom < 1) {
    console.log('workflow desinger zoom limit 1');
    return;
  }
  scale.value = scale.value + zoom;
  bpmnModeler.get('canvas').zoom(scale.value);
  // canvas.zoom('fit-viewport');
};
//前进
const handleRedo = () => {
  bpmnModeler.get('commandStack').redo();
};
//后退
const handleUndo = () => {
  bpmnModeler.get('commandStack').undo();
};

//palette 左侧元素栏 样式修改
const styleChange = () => {
  // // // 找到 palette 展示标题
  const djsPalette = document.querySelector('.djs-palette-entries');
  const djsPalStyle = {
    width: '130px',
    padding: '5px',
    // background: 'white',
    left: '20px',
    borderRadius: 0,
  };
  if (djsPalette == null) {
    return;
  }
  for (var key in djsPalStyle) {
    djsPalette.style[key] = djsPalStyle[key];
  }
  const controlStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: '5px',
  };

  djsPalette.querySelectorAll('.entry').forEach(entryElement => {
    entryElement.innerHTML = `<div class='entry-title' style='font-size: 14px;font-weight:500;margin-left:15px;'>${entryElement.getAttribute(
      'title',
    )}</div>`;

    for (var csKey in controlStyle) {
      entryElement.style[csKey] = controlStyle[csKey];
    }
  });
};
</script>

<style>
.design-container {
  padding: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.wf-container {
  position: relative;
  flex: auto;
  background: #fff;
  position: relative;
  margin-top: 16px;
  border: 1px solid #d9d9d9;
}

.wf-container #wf-designer {
  height: 100%;
}

.bjs-powered-by {
  display: none;
}
svg.new-parent {
  background-color: #f7f9ff !important;
}

.panel {
  width: 320px;
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  overflow: auto;
}
.djs-palette {
  width: 132px;
}
</style>
