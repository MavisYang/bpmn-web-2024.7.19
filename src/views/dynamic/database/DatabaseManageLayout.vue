<template>
    <splitpanes class="default-theme">
        <pane min-size="20"  max-size="30">
            <ManageSidbar :data-source-id="pageProp.dataSourceId"></ManageSidbar>
        </pane>
        <pane>
            <a-tabs class="dbserver-content" v-model:activeKey="pageState.contentActiveKey"
                type="editable-card" @edit="onContentEdit">
                <a-tab-pane v-for="pane in pageState.contentTabPanes" :key="pane.key" :tab="pane.title" style="height: 80vh;"
                    :closable="pane.closable">
                    <component :is="pane.component" />
                </a-tab-pane>
            </a-tabs>
        </pane>
    </splitpanes>
    <!-- <splitpanes style="height: 400px" class="default-theme">

        <pane min-size="5">
           
        </pane>
        <pane>
            
        </pane> 
    </splitpanes> -->
</template>

<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'
import ManageSidbar from './ManageSidbar.vue';
import ManageContent from './ManageContent.vue';
import { Codemirror } from 'vue-codemirror';
import { sql } from '@codemirror/lang-sql';
import sqlFormatter from 'sql-formatter';

var pageProp = defineProps({
    dataSourceId: String,
});

const pageState = reactive({
    contentActiveKey: "1",
    contentTabPanes: [
        { key: '1', title: 'Tab 1', component: ManageContent },
    ],
    code: 'const A = 10',
    extentions: sql()
})

const onContentEdit = (event: any, action: String) => {
    // 如果是新增，则添加Tab页
    if (action === 'add') {
        const paneIndex = (pageState.contentTabPanes.length + 1) + '';
        pageState.contentTabPanes.push({ key: paneIndex, title: 'Tab ' + paneIndex, component: ManageContent });
        pageState.contentActiveKey = paneIndex;
    } else if (action === 'remove') {
        // 如果是移除，删除当前页，并且将当前页定位到后一页
        // 找到当前页索引
        let contentActiveIndex: number = -1;
        for (let i = 0; i < pageState.contentTabPanes.length; i++) {
            if (pageState.contentTabPanes[i].key === pageState.contentActiveKey) {
                contentActiveIndex = i;
                break;
            }
        }
        if (contentActiveIndex > -1) {
            pageState.contentTabPanes.splice(contentActiveIndex, 1);
            pageState.contentActiveKey = pageState.contentTabPanes[0].key;
        }
    } else {
        alert('不支持tab操作的类型 ' + action)
    }
}
</script>

<style scoped>
.splitpanes {
    background-color: #f8f8f8;
}

.splitpanes__splitter {
    background-color: #ccc;
    position: relative;
}

.splitpanes__splitter:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    transition: opacity 0.4s;
    background-color: rgba(255, 0, 0, 0.3);
    opacity: 0;
    z-index: 1;
}

.splitpanes__splitter:hover:before {
    opacity: 1;
}

.splitpanes--vertical>.splitpanes__splitter:before {
    left: -30px;
    right: -30px;
    height: 100%;
}

.splitpanes--horizontal>.splitpanes__splitter:before {
    top: -30px;
    bottom: -30px;
    width: 100%;
}

.dbserver-content.ant-tabs {
    height: 100%;
}

.dbserver-content.ant-tabs.ant-tabs-top>.ant-tabs-nav {
    margin-bottom: 0;
}

.dbserver-content.ant-tabs .ant-tabs-content-holder {
    flex:1;
}
.dbserver-content.ant-tabs>.ant-tabs-content-holder>.ant-tabs-content {
    height: 100%;
}
</style>