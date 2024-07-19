import '@ant-design-vue/pro-layout/dist/style.css';

import { createApp } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
import router from './router';
import App from './App.vue';

const app = createApp(App);

// https://www.jb51.net/article/251168.htm
// 防抖 debounce，相当于自定义了内容替换了标准@click
app.directive("debounce", {
    mounted(el, binding) {
        // 至少需要回调函数以及监听事件类型，即 v-debounce = { fn:()=>{} , event:"click" } ，这么定义的数据
        if (typeof binding.value.fn !== 'function' || !binding.value.event) return;

        let delay = 200; // 默认延迟时间
        el.timer = null;
        el.handler = function () {
            if (el.timer) {
                clearTimeout(el.timer);
                el.timer = null;
            };
            el.timer = setTimeout(() => {
                binding.value.fn.apply(this, arguments)
                el.timer = null;
            }, binding.value.delay || delay);
        }
        el.addEventListener(binding.value.event, el.handler)
    },
    beforeMount(el, binding) {
        if (el.timer) {
            clearTimeout(el.timer);
            el.timer = null;
        }
        el.removeEventListener(binding.value.event, el.handler)
    }
});

// 设置路由监听
router.beforeEach((to, from, next) => {
    // to 新的页面参数，from 旧的页面参数
    // 测试代码，如果是views，则直接跳转
    if (to.path.startsWith("/views")) {
        console.log("------ router beforeEach");
        console.log(to, from);
        next(true);
    }
    next(true);
})

app.use(router).use(ConfigProvider).use(ProLayout).use(PageContainer).mount('#app');

// app.config.globalProperties.$mesage = $message; 
// 