<template>
    <div class="" style="height:100%">
        <a-card>
            <a-button @click="handleBack()">返回</a-button>
            <a-button @click="handleSave(0)">保存</a-button>
            <a-button @click="handleSave(1)">保存并启用</a-button>
            <a-button @click="handleRedo()">前进</a-button>
            <a-button @click="handleUndo()">后退</a-button>
            <a-button @click="handleZoom(1)">放大</a-button>
            <a-button @click="handleZoom(-1)">缩小</a-button>
        </a-card>

        <div class="wf-container">
            <div id="wf-designer"></div>
            <div id="js-properties-panel"></div>
        </div>

        <a-card>
            <a-form :model="modelState"
                :label-col="{ style: { width: '120px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'elipsis' } }">
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item name="key" label="流程标识符" :rules="[{ required: true, message: '请输入流程标识符' }]">
                            <a-input v-model:value="modelState.key" placeholder="placeholder"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="name" label="中文名称" :rules="[{ required: true, message: 'input name cn' }]">
                            <a-input v-model:value="modelState.name" placeholder="placeholder"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="nameEn" label="英文名称" :rules="[{ required: true, message: 'input name en' }]">
                            <a-input v-model:value="modelState.nameEn" placeholder="placeholder"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="表单配置" :required="true">
                            <a-button>还未配置表单，点我配置</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="name" label="流程ID生成前缀"
                            :rules="[{ required: true, message: 'input name cn' }]">
                            <a-input v-model:value="modelState.name" placeholder="placeholder"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="nameEn" label="申请人是否可以终止">
                            <a-checkbox v-model:checked="modelState.definition.allowApplicantStop"></a-checkbox>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item label="表单审计">
                            <a-checkbox v-model:checked="modelState.definition.allowApplicantStop"></a-checkbox>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="name" label="流程ID生成前缀"
                            :rules="[{ required: true, message: 'input name cn' }]">
                            <a-input v-model:value="modelState.name" placeholder="placeholder"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item name="nameEn" label="申请人是否可以终止"
                            :rules="[{ required: true, message: 'input name en' }]">
                            <a-checkbox v-model:checked="modelState.definition.allowApplicantStop"></a-checkbox>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
    </div>
</template>
<script lang="ts" setup>
import { markRaw } from 'vue';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import { CustomModeler } from '@/components/bpmn';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json'
import type { WorkflowModel } from '@/api/workflowDesignApi';
import { save } from '@/api/workflowDesignApi'
import { useRouter } from 'vue-router';

const router = useRouter();
/*
npm install bpmn-js -D
npm install bpmn-js-properties-panel -D
npm install camunda-bpmn-moddle -D
*/

// 流程实例模板，复制
// 自动审批

const modelState = reactive({
    key: "xxx",
    name: "请假",
    nameEn: "",
    definition: {
        allowApplicantStop: false,
        // 流程实例生成前缀，为空时默认使用 流程key + 'yyyyMMdd' + '4位流水号';
        instanceIdPrefix: "",
        forms: [],
        // 操作
        buttons: ["保存草稿", "提交"],

    },
    nodeState: {
        "ServiceTask1": {
            type: "ServiceTask",
            name: "远程服务",
            nameEn: "Service Task1",
            definition: {
                serviceUrl: "http://www.baidu.com/{path_variable}",
                // 请求参数
                request: {
                    method: "post",
                    header: {

                    },
                    path: {

                    },
                    queryString: {

                    },
                    body: {

                    },
                    // 拦截器，java文件，可以提供自定义认证方式
                    interceptor: ""
                },
                // 响应内容
                repsonse: {

                }
            }
        },
        "UserTask1": {
            type: "UserTask",
            name: "用户节点1",
            nameEn: "UserTask1",
            definition: {
                // 处理人
                assignees: [{
                    // user 用户，group 群组, form 人员或群组控件
                    type: "user",
                    value: "xxxx"
                }],
                // 会签配置,为 null 时表示非会签
                countersign: {
                    // 中断条件，无需等待所有实例完成即可实现路径跳转
                    interrupts: {
                        "$and": [{
                            // 表单，main = 主表单, 当前审批节点
                            form: "main",
                            // 字段, 
                            field: "field",
                            // 比较符 equals 等于，not equals 不等于，contains 包含， contains 不包含，greater than 大于，less than 小于
                            operator: "contains",
                            // 根据字段控件选值，字符串，数字，对象等
                            value: null,
                            rate: "100%"
                        }]
                    }

                },

                forms: []
            },
        },
        "sequnceFlow1": {
            type: "SequnceFlow",
            name: "序列流1",
            nameEn: "SequnceFlow1",
            definition: {
                conditions: {
                    "$and": [{
                        // 表单，main = 主表单, 当前审批节点
                        form: "main",
                        // 字段, 
                        field: "field",
                        // 比较符 equals 等于，not equals 不等于，contains 包含， contains 不包含，greater than 大于，less than 小于
                        operator: "contains",
                        // 根据字段控件选值，字符串，数字，对象等
                        value: null,
                        rate: "100%"
                    }]
                }
            }
        }
    }
});


let bpmnModeler: CustomModeler;
onMounted(() => {
    // 加markRaw去除双向绑定作用域
    bpmnModeler = markRaw(new CustomModeler({
        container: document.getElementById('wf-designer'),
        // 添加控制板
        /*
        propertiesPanel: {
            parent: '#js-properties-panel'
        },
        // 右侧属性面板
        additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule
        ],
        */
        moddleExtensions: {
            camunda: camundaModdleDescriptor
        }
    }));

    bpmnModeler.createDiagram(() => {
        // 填充视图
        bpmnModeler.get('canvas').zoom('fit-viewport');

        // 找到 palette 展示标题
        const djsPalette = document.querySelector(".djs-palette-entries");
        const djsPalStyle = {
            width: "130px",
            padding: "5px",
            background: "white",
            left: "20px",
            borderRadius: 0
        };

        if (djsPalette == null) {
            return;
        }
        for (var key in djsPalStyle) {
            djsPalette.style[key] = djsPalStyle[key];
        }


        const controlStyle = {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            padding: "5px"
        };
        djsPalette.querySelectorAll(".entry").forEach(entryElement => {
            entryElement.innerHTML = `<div class='entry-title' style='font-size: 14px;font-weight:500;margin-left:15px;'>${entryElement.getAttribute("title")}</div>`;
            for (var csKey in controlStyle) {
                entryElement.style[csKey] = controlStyle[csKey];
            }
        })
    });

    // 监听节点选择变化
    bpmnModeler.on('selection.changed', (e) => {
        const element = e.newSelection[0]
        if (element) {
            // 渲染节点参数
        } else {
            // 渲染主表单配置参数
        }
        console.log(element)
    })

    //  监听节点属性变化
    bpmnModeler.on('element.changed', (e) => {
        const { element } = e
        console.log(element)
    })
});

const handleBack = ()=> {
    router.push({ name : "workflowList" });
}

const handleSave = (isDeploy: Number) => {
    const model: WorkflowModel = {
        id: "",
        keycode: "",
        name: "",
        nameEn:"",
        group: "general",
        model: "",
        status: isDeploy ? "1" : "0",
    }
    bpmnModeler.saveXML({ format: true },).then((data) => {
        // console.log('save model data is ',data);
        model.model = data.xml;
        save(model);
    });
}

let scale: number = 1;
const handleZoom = (zoom: number) => {
    if ((scale + zoom) < 1) {
        console.log("workflow desinger zoom limit 1");
        return;
    }
    scale = scale + zoom;
    bpmnModeler.get('canvas').zoom(scale);
    // canvas.zoom('fit-viewport');

}

const handleRedo = () => {
    bpmnModeler.get("commandStack").redo();
}

const handleUndo = () => {
    bpmnModeler.get("commandStack").undo();
}

</script>

<style >
.wf-container {
    height: 67%;

    background: #FFF;
    position: relative;
}

.wf-container #wf-designer {
    height: 100%;
}

.djs-palette {
    width: 132px;
}
</style>