import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';
import WelcomePage from '../views/Page1.vue';

// only githubpages preview site used, if use template please remove this check
// and use `createWebHistory` is recommend
const hasGithubPages = import.meta.env.VITE_GHPAGES;

export default createRouter({
  // history: hasGithubPages ? createWebHashHistory() : createWebHistory(),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: { title: 'Home' },
      component: BasicLayout,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          meta: { title: '欢迎', icon: 'icon-icon-test' },
          component: WelcomePage,
        },
        {
          path: '/admin',
          name: 'admin',
          meta: { title: '管理页', icon: 'icon-tuijian', flat: true },
          component: BlankLayout,
          redirect: () => ({ name: 'workflowList' }),
          children: [
            // {
            //   path: '/admin/tools/code',
            //   name: 'codeGenerator',
            //   meta: { title: '代码生成器' },
            //   component: () => import('../views/tool/CodeGenerator.vue'),
            // },
            // {
            //   path: '/admin/tools/form-design',
            //   name: 'formDesign',
            //   meta: { title: '表单设计工具' },
            //   component: () => import('../views/tool/FormDesign.vue'),
            // },
            {
              path: '/workflow/list',
              name: 'workflowList',
              meta: { title: '模型列表' },
              component: () => import('../views/workflow/list.vue'),
            },
            {
              path: '/workflow/design',
              name: 'workflowDesign',
              meta: { title: '流程设计器' },
              component: () => import('../views/WorkflowDesign/WorkflowDesign.vue'),
            },
            // {
            //   path: '/dynamic/datasource/list',
            //   name: 'dataSourceList',
            //   meta: { title: '数据源列表' },
            //   component: () => import('../views/dynamic/datasource/List.vue'),
            // },
            // {
            //   path: 'page-1',
            //   name: 'page1',
            //   meta: { title: '一级页面' },
            //   component: () => import('../views/admins/PageInfo.vue'),
            //   children: [
            //     {
            //       path: 'page-1',
            //       name: 'page1',
            //       meta: { title: '一级页面' },
            //       component: () => import('../views/admins/PageInfo.vue'),
            //     },
            //   ],
            // },
            // {
            //   path: 'page-2',
            //   name: 'page2',
            //   meta: { title: '二级页面' },
            //   component: () => import('../views/admins/PageTypography.vue'),
            // },
            // {
            //   path: 'dynamic-match/:id(\\d+)',
            //   name: 'dynamic-match',
            //   // 路由 path 默认参数再 meta.params 里
            //   meta: { title: '动态参数页面', params: { id: 1 } },
            //   component: () => import('../views/admins/DynamicMatch.vue'),
            // },
          ],
        },
        // {
        //   path: '/version',
        //   name: 'version',
        //   meta: { title: 'Version', icon: 'icon-antdesign' },
        //   component: () => import('../views/Detail.vue'),
        // },
        // {
        //   path: '/404',
        //   name: 'pageNotFound',
        //   meta: { title: 'Page Not Found' },
        //   component: () => import('../views/error/NotFound.vue'),
        // },
      ],
    },
  ],
});
