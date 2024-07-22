<!--
 * @Author: yangmiaomiao
 * @Date: 2024-07-22 14:37:44
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 16:01:45
 * @Description: 
  yarn add bpmn-js@7.3.1 
  yarn add bpmn-js-properties-panel@0.37.2
  yarn add camunda-bpmn-moddle@^4.5.0
  yarn add  codemirror@^6.0.1
-->
<template>
  <div class="design-container">
    <div>
      <a-button @click="handleBack()">返回</a-button>
      <a-button @click="handleSave(0)">保存</a-button>
      <a-button @click="handleRedo()">前进</a-button>
      <a-button @click="handleUndo()">后退</a-button>
      <a-button @click="handleZoom(1)">放大</a-button>
      <a-button @click="handleZoom(-1)">缩小</a-button>
      <a-button @click="handleDownload()">下载</a-button>
    </div>

    <div class="wf-container">
      <div id="wf-designer" ref="container"></div>
      <div id="js-properties-panel" class="panel"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { markRaw, watch } from 'vue';
import { CustomModeler } from '@/components/bpmn/index.js'; //自定义

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
// bpmn-js-properties-panel相关
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
// BPMN国际化
import customTranslate from '@/components/bpmn/custom/CustomTranslate.js';
import type { WorkflowModel } from '@/api/workflowDesignApi';
import { getXmlData, save } from '@/api/workflowDesignApi';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

//流程图 保存内容
const modelBpmn = ref<WorkflowModel>({
  id: '',
  keycode: '',
  name: '',
  nameEn: '',
  group: 'general',
  model: '',
  status: '0',
});

// bpmn建模器
const container = ref(null);
const type = ref(route.query.type || '');

onMounted(() => {
  initModeler();
});

watch(
  () => route.query,
  newVal => {
    type.value = newVal.type || '';
    if (newVal) {
      createNewDiagram();
    }
    console.log(type.value, 'newVal');
  },
);
let bpmnModeler: any = CustomModeler;
const initModeler = () => {
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
  //Passing callbacks to createDiagram is deprecated and will be removed in a future major release.
  //createDiagram 已经不在支持回调函数
  // bpmnModeler.createDiagram(() => {
  //   bpmnModeler.get('canvas').zoom('fit-viewport'); // 填充视图
  //   //样式修改
  //   // styleChange();
  // });

  //判断是否编辑还是创建状态
  createNewDiagram();
  // 监听节点变化
  watchBpmnChanged();
};
// 创建空白流程图 == 渲染
const createNewDiagram = async () => {
  if (type.value == 'edit') {
    console.log('1');
    //根据请求数据渲染流程图
    await getXmlData().then(res => {
      modelBpmn.value = res.data || {};
      // 将字符串转换成图显示出来
      try {
        const bpmnXmlStr = JSON.parse(modelBpmn.value?.model || '');
        const result = bpmnModeler.importXML(bpmnXmlStr);
        const { warnings } = result;
        console.log(warnings);
      } catch (err: any) {
        console.log(err.message, err.warnings);
      }
    });
  } else {
    console.log('2');
    //创建空白流程图
    await bpmnModeler.createDiagram();
  }
};
//保存
const handleSave = (isDeploy: number) => {
  const model: WorkflowModel = {
    id: Math.random().toString().slice(2),
    keycode: '',
    name: '',
    nameEn: '',
    group: 'general',
    model: '',
    status: isDeploy ? '1' : '0',
  };
  bpmnModeler.saveXML({ format: true }).then(data => {
    model.model = JSON.stringify(data.xml);
    console.log(JSON.stringify(model));
    save(model);
  });
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

// 放大缩放
let scale = ref<number>(1);
const handleZoom = (zoom: number) => {
  if (scale.value + zoom < 1) {
    console.log('workflow desinger zoom limit 1');
    return;
  }
  scale.value = scale.value + zoom;
  bpmnModeler.get('canvas').zoom(scale.value);
};
//前进
const handleRedo = () => {
  bpmnModeler.get('commandStack').redo();
};
//后退
const handleUndo = () => {
  bpmnModeler.get('commandStack').undo();
};
//返回
const handleBack = () => {
  router.push({ name: 'workflowList' });
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
