<template>
  <PageContainer>
    <a-result
      status="404"
      :style="{
        height: '100%',
        background: '#fff',
      }"
      title="你访问的页面不存在"
      sub-title="Sorry, you are access page is not found."
    >
      <template #extra>
        <a-button type="primary" @click="handleClick">Back</a-button>
      </template>
    </a-result>
  </PageContainer>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import { PageContainer as PageContainer } from '@ant-design-vue/pro-layout';

const handleClick = () => {
  console.log('info');
  message.info('BackHome button clicked!');
};

</script>
