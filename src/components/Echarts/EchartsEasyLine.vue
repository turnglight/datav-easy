<template>
  <div :id="getId()">
    <div :class="getClass()" :style="getStyle()"></div>
  </div>
</template>

<script>
import { init } from '../../echarts/echarts.easy.line.js'
export default {
  props: {
    index: Number,
    option: Object,
    width: Number,
    height: Number
  },
  data () {
    return {
      line: Object,
      chartOption: null,
      w: this.width,
      h: this.height - 10
    }
  },
  mounted () {
    this.line = this.init()
  },
  methods: {
    init: function () {
      const echarts = require('echarts')
      this.line = init(this, echarts)
      this.line = this.line.noConflict()
      this.line = this.line('line', '.' + this.getClass())
      if (this.option) {
        this.line.chart.setOption(this.option)
      } else {
        this.line.setTitle('折线图1')
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
        this.chartOption = this.line.option
        this.updateChartOption()
      }
      return this.line
    },
    chartData () {
      return this.$parent.chartData
    },
    updateChartOption () {
      this.$parent.$parent.$parent.$parent.chartData.elements[this.index].data.option = this.chartOption
    },
    redraw: function (item) {
      const div = document.getElementById(this.index)
      div.innerHTML = '<div class="' + this.getClass() + '" style="width:' + item.w + 'px;height: ' + item.h + 'px;">'
      this.init()
    },
    getId: function () {
      return this.index
    },
    getStyle: function () {
      if (!this.width || !this.height) {
        this.w = 390
        this.h = 190
      }
      console.log(this.w)
      console.log(this.h)
      return 'width:' + this.w + 'px;height:' + this.h + 'px;'
    },
    getClass: function () {
      return 'chart_' + this.index + ''
    }
  }
}
</script>
