<template>
  <div class="chart"></div>
</template>

<script>
import { init } from '../../echarts/echarts.easy.line.js'
export default {
  mounted () {
    let line = this.init()
    line = line.noConflict()
    line = line('line', '.chart')
    line.setTitle('折线图1')
      .setYAxisSplitLine(true)
      .setYAxisName('单位(*)')
      .setXAxisFontColor('rgb(255,255,255)')
      .setYAxisFontColor('rgb(255,255,255)')
      .setSeries([{ name: '类目一', data: [['1年内', 0], ['1-5年内', 34], ['5-10年内', 40], ['10年以上', 50]] }, { name: '类目二', data: [['1年内', 40], ['1-5年内', 30], ['5-10年内', 28], ['10年以上', 35]] }])
      .setAreaColor(['rgba(7,161,167,0.2)', 'rgba(185,141,232,0.2)'])
      .setItemColor(['#07A1A7', '#B98DE8'])
      .setLegend(['类目一', '类目二'])
      .setSmooth(true)
      .create()
  },
  methods: {
    init: function () {
      const echarts = require('echarts')
      return init(window, echarts)
    }
  }
}
</script>
<style lang="scss" scoped>
.chart{
  width: 400px;
  height: 200px;
}
</style>
