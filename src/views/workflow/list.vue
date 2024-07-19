<template>
  <page-container title="模型列表">
    <template #content>
      <a-descriptions size="small" :column="2">
        <a-descriptions-item label="创建人">张三</a-descriptions-item>
        <a-descriptions-item label="联系方式">
          <a>421421</a>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">2017-01-10</a-descriptions-item>
        <a-descriptions-item label="更新时间">2017-10-10</a-descriptions-item>
        <a-descriptions-item label="备注">中国浙江省杭州市西湖区古翠路</a-descriptions-item>
      </a-descriptions>
    </template>
    <template #extra>
      <a-button key="3">操作</a-button>
      <a-button key="2">操作</a-button>
      <a-button key="1" type="primary" @click="handleCreateModel()">新增模型</a-button>
    </template>
    <template #extraContent>
      <a-space>
        <a-statistic title="Feedback" :value="1128">
          <template #prefix>
            <LikeOutlined />
          </template>
        </a-statistic>
        <a-statistic title="Unmerged" :value="93" suffix="/ 100" />
      </a-space>
    </template>
    <!-- 主内容区 -->
    <div style="height: 120vh">
      <a-skeleton active :loading="loading" />

      <div v-if="!loading">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card :bordered="false"> 
              <template #actions>
                <edit-outlined key="edit" />
                 
                <a-dropdown>
                  <a class="ant-dropdown-link" @click.prevent>
                    <ellipsis-outlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a href="javascript:;"><download-outlined /> 下载 BPMN 模型</a>
                      </a-menu-item>
                       <a-menu-item>
                        <a href="javascript:;"><delete-outlined /> 删除</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
              <a-card-meta >
                <template #title> 
                  <h3 style="float:left">请求流程<small>v2</small></h3>
                  <div style="float:right">
                    <a-switch />
                  </div>
                </template>
                <template #description>
                  <p>
                    员工请假流程
                  </p> 
                  <ul>
                    <li><label>创建人:</label> zhangsan</li>
                    <li><label>创建时间:</label> zhangsan</li>
                    <li><label>最后修改人:</label> zhangsan</li>
                    <li><label>最后修改时间:</label> zhangsan</li>
                    <li><label>业务类型:</label> 通用</li>
                    <li><label>版本号:</label> 1</li>
                  </ul> 
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="Card title" :bordered="false">
              <p>card content</p>
            </a-card>
          </a-col>
          <a-col :span="8">
            <a-card title="Card title" :bordered="false">
              <p>card content</p>
            </a-card>
          </a-col>
        </a-row>
        <a-pagination v-model:current="query.page" v-model:pageSize="query.size" :total="data.meta?.totalElements" />
      </div>
    </div>
  </page-container>
</template>
<script lang="ts" setup>
import type { Page } from "@/utils/request";
import type { WorkflowModel, WorkflowPageQuery } from "@/api/workflowDesignApi";
import { findPageList } from "@/api/workflowDesignApi";
import { SettingOutlined, EditOutlined, EllipsisOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref<boolean>(true);
const query = reactive<WorkflowPageQuery>({
  page: 1,
  size: 20,
  keyword: ""
});

const data = reactive<Page<WorkflowModel>>({})

const queryShake = (falg: object) => {
  return setTimeout(() => {
    findPageList(query).then((ret) => {
      loading.value = false;
      data.content = ret.content;
      data.meta = ret.meta;
    }).catch(ret => {
      loading.value = false;
    });
  }, 500);
}

watchEffect((onInvalidate) => {
  let shakeTimer = queryShake(query);
  onInvalidate(() => clearInterval(shakeTimer));
});

onMounted(() => {

})

const onShowSizeChange = () => {

}

const handleCreateModel = () => {
  router.push({ name:"workflowDesign" });
}

</script>