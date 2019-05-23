import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/myorder'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件'},
            children:[
                {
                    path: '/myorder',
                    component: resolve => require(['../components/page/OrderList.vue'], resolve),
                    meta: {title: '订单'}
                },
                {
                    path: '/customerlist/:id',
                    component: resolve => require(['../components/page/CustomerList.vue'], resolve),
                    meta: {title: '拨打名单'}
                },
                {
                    path: '/calldetails',
                    component: resolve => require(['../components/page/CallDetails.vue'], resolve),
                    meta: {title: '拨打详情'}
                },
                {
                    path: '/statistics',
                    component: resolve => require(['../components/page/Statistics.vue'], resolve),
                    meta: {title: '电商统计'}
                },
                {
                    path: '/callrecord/:id',
                    component: resolve => require(['../components/page/CallRecord.vue'], resolve),
                    meta: {title: '拨打记录'}
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve)
        },
    ]
})

