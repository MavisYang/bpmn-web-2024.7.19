<template>
    <div class="dbserver-container">
        <div class="dbserver-container-sidber">
            <ManageSidbar :data-source-id="pageProp.dataSourceId"></ManageSidbar>
        </div>
        <div class="dbserver-container-content">
            <a-tabs class="dbserver-container-content-tabs" v-model:activeKey="pageState.contentActiveKey" type="editable-card" @edit="onContentEdit">
                <a-tab-pane v-for="pane in pageState.contentTabPanes" :key="pane.key" :tab="pane.title"
                    :closable="pane.closable">
                    <component :is="pane.component" />
                </a-tab-pane>
            </a-tabs>
            <!--<ManageContent :data-source-id="pageProp.dataSourceId"></ManageContent>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import ManageSidbar from './ManageSidbar.vue';
import ManageContent from './ManageContent.vue';
var pageProp = defineProps({
    dataSourceId: String,
});

const pageState = reactive({
    contentActiveKey: "1",
    contentTabPanes: [
        { key: '1', title: 'Tab 1', component: ManageContent },
    ]
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
.dbserver-container {
    display: flex;
}

.dbserver-container-sidber {
    /* 左边容器的固定宽度 */
    width: 400px;

}

.dbserver-container-content {
    /* 右边容器自适应占满剩余空间 */
    flex-grow: 1;
    /* background-color: rgb(217, 217, 247); */
}

.dbserver-container-content .ant-tabs {
    height: 90vh;
}

.dbserver-container-content .dbserver-container-content-tabs .ant-tabs-nav {
    height: 50px;
    /* 设置标签栏的高度 */
}

.dbserver-container-content .dbserver-container-content-tabs .ant-tabs-ant-tabs-content {
    height: 150px;
}
</style>