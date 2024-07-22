<!--
 * @Author: yangmiaomiao
 * @Date: 2024-07-22 14:37:44
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-22 14:40:53
 * @Description: 
-->
<template>
  <page-container>
    <a-button @click="goDesign">流程设计</a-button>
  </page-container>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goDesign = () => {
  console.log('流程设计');
  router.push({ name: 'workflowDesign' });
};
</script>
