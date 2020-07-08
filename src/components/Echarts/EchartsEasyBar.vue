<template>
  <div :id="getId()">
    <div :class="getClass()" :style="getStyle()"></div>
  </div>
</template>

<script>
import { initBar } from '../../echarts/echarts.easy.bar.js'
var interval
export default {
  props: {
    index: Number,
    option: Object,
    width: Number,
    height: Number,
    series: Array,
    legend: Array,
    item: Object
  },
  data () {
    return {
      bar: Object,
      chartOption: null,
      w: this.width,
      h: this.height
    }
  },
  mounted () {
    this.bar = this.init()
  },
  methods: {
    init: function () {
      const echarts = require('echarts')
      this.bar = initBar(this, echarts)
      this.bar = this.bar.noConflict()
      this.bar = this.bar('bar', '.' + this.getClass())
      // 1.查看状态下，父级为/src/views/Viewer/canvas传递chartData.Elements[i].item
      // 2.编辑状态下，父级为/src/views/Editor/canvas
      // 3.默认折线图
      if (this.item && this.item.data) {
        if (this.item.data.datacon.type === 'raw') {
          this.bar.chart.setOption(this.item.data.option)
        } else if (this.item.data.datacon.type === 'connect') {
          this.$http.get('/connect/' + this.item.data.datacon.connectId)
            .then((res) => {
              const { errno, data } = res.data
              if (errno === 0) {
                this.updateSeries(data.series)
                this.updateLegend(data.Legend)
              }
            })
            .catch(() => {})
        } else if (this.item.data.datacon.type === 'get') {
          clearInterval(interval)
          const time = this.item.data.datacon.interval ? this.item.data.datacon.interval : 1
          interval = setInterval(() => {
            this.$http.get(this.item.data.datacon.getUrl)
              .then((res) => {
                this.updateSeries(res.data.series)
                this.updateLegend(res.data.Legend)
                this.bar.chart.setOption(this.option)
                this.redraw()
              })
              .catch(() => {})
          }, time * 1000)
        }
      } else if (this.option) {
        this.bar.chart.setOption(this.option)
      } else {
        this.bar.setTitle('柱状图')
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
        this.chartOption = this.bar.option
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
    redraw: function (changed) {
      const div = document.getElementById(this.index)
      this.w = this.width
      this.h = this.height
      div.innerHTML = '<div class="' + this.getClass() + '" style="width:' + this.w + 'px;height: ' + this.h + 'px;">'
      const echarts = require('echarts')
      this.bar = initBar(this, echarts)
      this.bar = this.bar.noConflict()
      this.bar = this.bar('bar', '.' + this.getClass())
      this.bar.chart.setOption(this.option)
      console.log(this.option)
    },
    getId: function () {
      return this.index
    },
    getStyle: function () {
      if (!this.width || !this.height) {
        this.w = 390
        this.h = 190
      } else {
        this.w = this.width
        this.h = this.height
      }
      return 'width:' + this.w + 'px;height:' + this.h + 'px;'
    },
    getClass: function () {
      return 'chart_bar_' + this.index + ''
    },
    updateSeries: function (series) {
      for (let i = 0; i < series.length; i++) {
        this.option.series[i].data = series[i].data
        this.option.series[i].name = series[i].name
      }
    },
    updateLegend: function (legend) {
      for (let i = 0; i < legend.length; i++) {
        this.option.legend.data[i] = legend[i]
      }
    }
  },
  watch: {
    'option.title': {
      handler (newVal, oldVal) {
        this.redraw()
      }
    },
    series: {
      handler (newVal, oldVal) {
        this.updateSeries(newVal)
        this.redraw()
      }
    },
    legend: {
      handler (newVal, oldVal) {
        this.updateLegend(newVal)
        this.redraw()
      }
    },
    deep: true
  }
}
</script>
