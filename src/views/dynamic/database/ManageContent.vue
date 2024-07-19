<template>
    <splitpanes class="default-theme" horizontal="horizontal">
        <pane min-size="50">
            <Codemirror v-model="pageState.code" :tab-size="4" :autofocus="true" :indent-with-tab="true"
                :style="{ height: '100%' }" :extensions="pageState.extentions"
                placeholder="在此处录入查询语句，F9 执行选中查询，Ctrl + F9 执行全部" @keydown="handleCodemirrorKeydown" />
        </pane>
        <pane>
            <a-tabs>
                <a-tab-pane :key="1" :tab="'打印'" :active="true">

                </a-tab-pane>
                <a-tab-pane :key="2" :tab="'数据'">

                </a-tab-pane>
                <a-tab-pane :key="3" :tab="'信息'">

                </a-tab-pane>
            </a-tabs>
        </pane>
    </splitpanes>
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { sql } from '@codemirror/lang-sql';
import sqlFormatter from 'sql-formatter';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'
import {executeSql} from "@/api/databaseApi";

const props = defineProps({
    dataSourceId:{
        require:true,
        type:String
    }
})

// 实现tab bar 的拖拽
// https://blog.csdn.net/m0_61342618/article/details/127360847

const pageState = reactive({
    code: '',
    extentions: sql()
});

const handleCodemirrorKeydown = (e: KeyboardEvent) => {
    if(props.dataSourceId === undefined){
        alert("the datasource id not set");
        return;
    }
    if (e.key === 'F9') {
        // ctrl + F9
        if (e.ctrlKey) {
            pageState.code
            executeSql(props.dataSourceId, pageState.code);
        } else {

        }
    }
}


</script>

<style scoped></style>
