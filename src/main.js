import Vue from 'vue'
import VueRulerTool from 'vue-ruler-tool'
import VueDraggableResizable from 'vue-draggable-resizable'
import VueDragResize from 'vue-drag-resize'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import VCharts from 'v-charts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/font/iconfont.css';
import dayjs from 'dayjs'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http'
// echarts-easy
import echarts from 'echarts'
// import initMock from '../mock';

// 需要 mock 数据时请打开注释
// initMock();

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$dayjs = dayjs

Vue.prototype.$echarts = echarts
// Vue.prototype.$bar = bar
// Vue.prototype.$scatter = scatter
// Vue.prototype.$gauge = gauge

Vue.use(VCharts)
Vue.use(ElementUI)
Vue.use(dayjs)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.component('vue-drag-resize', VueDragResize)
Vue.component('vue-ruler-tool', VueRulerTool)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}
