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
import echarts from './echarts/echarts.min.js'
import line from './echarts/echarts.easy.line.js'
// import bar from './echarts/echarts.easy.bar.js'
// import scatter from './echarts/echarts.easy.scatter.js'
// import gauge from './echarts/echarts.easy.gauge.js'
// import initMock from '../mock';

// 需要 mock 数据时请打开注释
// initMock();

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$dayjs = dayjs

Vue.prototype.$echarts = echarts
Vue.prototype.$line = line
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
