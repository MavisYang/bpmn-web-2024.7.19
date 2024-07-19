<template>
  <page-container>
    <template #content>
      <a-form :model="query" name="horizontal_login" layout="inline" autocomplete="off">
        <a-form-item label="keyword" name="keyword">
          <a-input v-model:value="query.keyword" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" @click="handleSearch()">查找</a-button>
        </a-form-item>
      </a-form>

      <a-space>
        <a-button @click="handleNew">新增</a-button>
        <a-button>测试连接</a-button>
        <a-button>删除</a-button>
      </a-space>

      <a-table :row-selection="{ selectedRowKeys: pageState.selectedRowKeys, onChange: handleDataSourceSelectChange }"
        :columns="columns" :row-key="record => record.id" :data-source="pageState.tableData" :pagination="pagination"
        :loading="pageState.loading" @change="handleTableChange">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'operation'">
            <a-button type="link">测试连接</a-button>
            <a-button type="link" @click="handleDataSourceManage(record)">管理</a-button>
            <a-button type="link">编辑</a-button>
            <a-button type="link">删除</a-button>
          </template>
        </template>

      </a-table>
      <a-modal v-model:open="pageState.aopen" title="数据源信息" :footer="null">
        <Detail></Detail>
      </a-modal>
      <a-modal v-model:open="pageState.databaseDialogOpen" title="数据源信息" :footer="null" width="100%"
        wrap-class-name="full-modal">
        <DatabaseManageLayout :data-source-id="pageState.databaseDialogDataId"></DatabaseManageLayout>
      </a-modal>
      {{ data.content?.length }}

    </template>
  </page-container>
</template>

<script lang="ts" setup>
import type { Page } from '@/utils/request';
import { findPageList, type DataSource, type DataSourcePageQuery } from '@/api/dataSourceApi';
import type { TableProps } from 'ant-design-vue';
import type { UnwrapRef } from 'vue';
import Detail from './Detail.vue';
import DatabaseManage from '../database/DatabaseManage.vue';
import DatabaseManageLayout from '../database/DatabaseManageLayout.vue';

const query: DataSourcePageQuery = reactive({
  page: 1,
  size: 20,
  keyword: ""
});

const pageState = reactive({
  current: 1,
  pageSize: 20,
  loading: true,
  aopen: false,
  databaseDialogOpen: false,
  databaseDialogDataId: "",
  tableData: [],
  selectedRowKeys: []
})


const pagination = computed(() => ({
  total: 1,
  current: pageState.current,
  pageSize: pageState.pageSize,
}));

const columns = [
  {
    title: '数据源名称',
    dataIndex: 'name',
    sorter: true,
    width: '20%',
  },
  {
    title: '数据源描述',
    dataIndex: 'remark',
    ellipsis: true,
    width: '20%',
  },
  {
    title: '数据库类型',
    dataIndex: 'databaseType',
    width: '20%',
  },
  {
    title: '数据库服务器',
    dataIndex: 'host',
    width: '20%',
  }, {
    title: "操作",
    dataIndex: "operation"
  }
  /*
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },*/
];

const data = ref({});

/*
watch(query, () => {
  findPageList(query).then(ret=>{
    alert(ret.content?.length);
  });
})
*/

onMounted(() => {
  findPageList(query).then(ret => {
    pageState.loading = false;
    pageState.tableData = ret.content as never[];
  }).catch(ret => {
    pageState.loading = false
  });
})


const handleSearch = () => {
  findPageList(query).then(ret => {
    pageState.tableData = ret.content as never[];
    pageState.selectedRowKeys = [];
  });
}

const handleTableChange = (
  pag: { pageSize: number; current: number },
  filters: any,
  sorter: any,
) => {
  console.log(pag, filters, sorter);
  findPageList(query).then(ret => {
    pageState.loading = false;
    data.value = { ...ret };
  }).catch(ret => {
    pageState.loading = false
  });
};

const handleNew = () => {
  pageState.aopen = true;
  console.log(pageState.aopen);

}

const handleOk = () => {

}

const handleDataSourceSelectChange = (selectedRowKeys: any[], selectedRows: any[]) => {
  pageState.selectedRowKeys = selectedRowKeys as never[];
}

const handleDataSourceManage = (record: DataSource) => {
  pageState.databaseDialogDataId = record.id || '';
  pageState.databaseDialogOpen = true;
}
</script>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>