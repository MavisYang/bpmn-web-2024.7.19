<template>
    <div class="container">
        <div class="header">
            <a-input v-model:value="pageState.keyword" placeholder="输入关键字" />
            <a-space>
                <ClusterOutlined /> {{ pageState.datasourceUser }}@{{ pageState.datasourceHost }}
            </a-space>
        </div>
        <div class="main-content">
            <a-tree v-model:expandedKeys="pageState.expandedKeys" v-model:selectedKeys="pageState.selectedKeys"
                :tree-data="pageState.treeData" show-icon>
                <template #icon="{ key, selected }">
                    <DatabaseOutlined v-if="key.startsWith('database-')" />
                    <TableOutlined v-else-if="key.startsWith('table-')" />
                    <BorderOutlined v-else-if="key.startsWith('view-')" />
                    <BuildOutlined v-else-if="key.startsWith('procdure-')" />
                    <FunctionOutlined v-else-if="key.startsWith('function-')" />
                    <CalculatorOutlined v-else-if="key.startsWith('trigger-')" />
                    <ThunderboltOutlined v-else-if="key.startsWith('event-')" />
                </template>
            </a-tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ClusterOutlined, DatabaseOutlined, TableOutlined, BorderOutlined, ThunderboltOutlined, BuildOutlined, CalculatorOutlined, FunctionOutlined } from '@ant-design/icons-vue';
import { connectByDataSource } from '@/api/databaseApi';
import type { TreeProps } from 'ant-design-vue';

const pageProp = defineProps({
    dataSourceId: String
})

const pageState = reactive({
    keyword: "",
    datasourceHost: "",
    datasourceUser: "",
    datasourceDatabase: "",
    expandedKeys: [],
    selectedKeys: [],
    treeData: [],
});

// 
onMounted(() => {
    // 加载数据源信息
    if (pageProp.dataSourceId) {
        connectByDataSource(pageProp.dataSourceId).then(ret => {
            console.log(ret.content)
            pageState.datasourceHost = ret.meta.datasourceHost;
            pageState.datasourceUser = ret.meta.datasourceUser;
            pageState.datasourceDatabase = ret.meta.datasourceDatabase;
            // 组装数据
            const treeData: TreeProps['treeData'] = [];
            ret.content.forEach(item => {
                // 表(列，索引)
                const tables = item.tables.map(table => {

                    let columns: TreeProps['treeData'] = [];
                    if (table.columns) {
                        columns = table.columns.map(column => {
                            return {
                                title: column.name,
                                key: `column--${item.name}-${table.name}-${column.name}`,
                            }
                        })
                    }
                    let indexs: TreeProps['treeData'] = [];
                    if (table.indexs) {
                        indexs = table.indexs.map(index => {
                            return {
                                title: index.name,
                                key: `index-${item.name}-${table.name}-${index.name}`,
                            }
                        })
                    }
                    const tableChildren = [];
                    tableChildren.push({ title: "列", key: `column-${item.name}-${table.name}`, children: columns })
                    tableChildren.push({ title: "索引", key: `index-${item.name}-${table.name}`, children: indexs })
                    return {
                        title: table.name,
                        key: `table-${item.name}-${table.name}`,
                        children: tableChildren
                    }
                })

                const views = item.views.map(view => {
                    return {
                        title: view.name,
                        key: `view-${item.name}-${view.name}`
                    }
                });

                const procdures = item.procedures.map(procdure => {
                    return {
                        title: procdure.name,
                        key: `procdure-${item.name}-${procdure.name}`
                    }
                });

                const functions = item.functions.map(func => {
                    return {
                        title: func.name,
                        key: `function-${item.name}-${func.name}`
                    }
                });

                const triggers = item.triggers.map(trigger => {
                    return {
                        title: trigger.name,
                        key: `trigger-${item.name}-${trigger.name}`
                    }
                });

                const events = item.events.map(event => {
                    return {
                        title: event.name,
                        key: `event-${item.name}-${event.name}`
                    }
                });

                // 第一层是database
                const databaseChildren = [];
                databaseChildren.push({ title: "表", key: `table-${item.name}`, children: tables, isLeaf: tables.length === 0 });
                databaseChildren.push({ title: "视图", key: `view-${item.name}`, children: views, isLeaf: views.length === 0 });
                databaseChildren.push({ title: "存储过程", key: `procdure-${item.name}`, children: procdures, isLeaf: procdures.length === 0 });
                databaseChildren.push({ title: "函数", key: `function-${item.name}`, children: functions, isLeaf: functions.length === 0 });
                databaseChildren.push({ title: "触发器", key: `trigger-${item.name}`, children: triggers, isLeaf: triggers.length === 0 });
                databaseChildren.push({ title: "事件", key: `event-${item.name}`, children: events, isLeaf: events.length === 0 });
                treeData.push({ title: item.name, key: `database-${item.name}`, children: databaseChildren });

            });
            pageState.treeData = treeData as never[];
            pageState.expandedKeys = [];
            pageState.expandedKeys.push(`database-${pageState.datasourceDatabase}` as never);
        });
    } else {
        alert("请通过数据源列表界面进入");
    }
});

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 90vh; /* 100% of the viewport height */
}
 
.header {
  height: 50px;
}
 
.main-content {
  flex: 1;
  overflow: auto;
}
</style>