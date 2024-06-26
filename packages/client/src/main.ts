import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css';
import './iconfont.js';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
