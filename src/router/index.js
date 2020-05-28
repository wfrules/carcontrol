import Vue from 'vue'
import Router from 'vue-router'
import control from '@/page/control/control.vue'

Vue.use(Router)

const Login = r => require.ensure([], () => r(require('@/page/control/control.vue')), 'login')//登入
const Setting = r => require.ensure([], () => r(require('@/page/setting.vue')), 'setting')//设置
const Stat = r => require.ensure([], () => r(require('@/page/stat/stat.vue')), 'stat')//统计
const Chart = r => require.ensure([], () => r(require('@/page/chart/chart.vue')), 'chart')//图表

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: control,
      meta: {title: '控制中心', guest: true},
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {title: '系统设置'},
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: '系统登入', guest: true},
    }
  ]
})
