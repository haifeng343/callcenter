import Vue from 'vue';
import App from './App';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
// import 'babel-polyfill';
import md5 from 'js-md5';
import filters from 'common/js/filter'
import echarts from 'echarts'
import { provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
import router from './router';
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');