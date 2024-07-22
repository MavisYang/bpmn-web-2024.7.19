<template>
  <a-card>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item label="Url" name="url" :rules="[{ required: true, message: 'Please input your url' }]">
        <a-input
          v-model:value="formState.url"
          addon-before="jdbc:mysql://"
          addon-after="?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
        <a-button type="primary" html-type="submit">连接数据库</a-button>
        <a-input v-model:value="packageName" placeholder="org.example" />
        <a-button type="primary" @click="onConfig()">配置</a-button>
      </a-form-item>
    </a-form>

    <a-table :dataSource="dataSource" :columns="columns"></a-table>
    <a-button type="primary" @click="onGenerate()">生成代码</a-button>
    <a-button type="primary" @click="onPreview()">在线查看</a-button>
  </a-card>
</template>

<script lang="ts" setup>
import type { DbConnection } from '@/api/codeGenerator';
import { testConnection, generateConfig, generateCode } from '@/api/codeGenerator';

const formState = reactive<DbConnection>({
  username: 'root',
  password: 'root',
  url: 'localhost:3306/test',
});

const packageName = ref('');
const columns = [
  {
    title: '表名',
    dataIndex: 'tableName',
    key: 'tableName',
  },
  {
    title: '模型名',
    dataIndex: 'modelName',
    key: 'modelName',
  },
  {
    title: '服务名',
    dataIndex: 'serviceName',
    key: 'serviceName',
  },
  {
    title: 'Mapper名',
    dataIndex: 'mapperName',
    key: 'mapperName',
  },
  {
    title: '控制器',
    dataIndex: 'controllerName',
    key: 'controllerName',
  },
  {
    title: '包',
    dataIndex: 'packageName',
    key: 'packageName',
  },
];

const dataSource = reactive<Object[]>([]);

const onFinish = () => {
  const jdbcUrl =
    'jdbc:mysql://' + formState.url + '?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai';
  testConnection({ ...formState, url: jdbcUrl });
  console.log('finish');
};

const onFinishFailed = () => {
  console.log('faild');
};

const onConfig = () => {
  generateConfig(packageName.value || 'org.example').then(ret => {
    dataSource.splice(0, dataSource.length);
    dataSource.push(...ret.content);
  });
};

const onGenerate = () => {
  generateCode();
};

const onPreview = () => {};
</script>
