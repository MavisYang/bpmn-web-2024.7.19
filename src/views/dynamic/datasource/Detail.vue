<template>
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="数据源名称">
            <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="数据源描述">
            <a-textarea v-model:value="formState.remark" />
        </a-form-item>
        <a-form-item label="数据库类型">
            <a-select ref="select" v-model:value="formState.databaseType">
                <a-select-option value="mysql">MySql</a-select-option>
                <a-select-option value="pgsql">PostgreSQL</a-select-option>
                <a-select-option value="oracle">Oracle</a-select-option>
                <a-select-option value="sqlserver" disabled>SqlServer</a-select-option>
                <a-select-option value="mongo">Mongodb</a-select-option>
                <a-select-option value="guass">GuassDB</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="主机&端口">
            <a-input-group compact>
                <a-input v-model:value="formState.host" style="width: 65%" />
                <a-input style="width: 10%; border-left: 0; pointer-events: none" placeholder=":" disabled />
                <a-input v-model:value="formState.port" style="width: 25%" />
            </a-input-group>
        </a-form-item>
        <a-form-item label="数据库">
            <a-input v-model:value="formState.database" />
        </a-form-item>
        <a-form-item label="用户名">
            <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item label="密码">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button @click="onTestConnection">测试连接</a-button>
            <a-button type="primary" style="margin-left: 10px" @click="onSubmit">创建</a-button>
            <a-button style="margin-left: 10px">关闭</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { testConnection, createDataSource, type DataSource } from '@/api/dataSourceApi';
import type {  UnwrapRef } from 'vue'; 

// 定义组件属性
const properties = defineProps({
    id: {
        type: String,
        required: false,
        default: ""
    }
});

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const formState: UnwrapRef<DataSource> = reactive({
    id: undefined,
    name: "",
    remark: "",
    databaseType: "mysql",
    host: "",
    port: "3306",
});

// 测试连接
const onTestConnection = ()=>{
    testConnection(formState).then(ret => {
        alert(JSON.stringify(ret));
        console.log("success", ret);
    }).catch(ret => {
        alert(JSON.stringify(ret.response.data));
        console.log("err", ret);
    });
}

// 提交
const onSubmit = () => {
    createDataSource(formState).then(ret => {
        alert(JSON.stringify(ret));
        console.log("success", ret);
    }).catch(ret => {
        alert(JSON.stringify(ret.response.data));
        console.log("err", ret);
    });
}


</script>

<style scoped></style>