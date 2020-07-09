<template>
  <div :id="getId()">
    <div :class="getClass()" :style="getStyle()"></div>
  </div>
</template>

<script>
import { init } from '../../echarts/echarts.easy.line.js'
var interval
var _interval
export default {
  props: {
    index: Number,
    option: Object,
    width: Number,
    height: Number,
    series: Array,
    legend: Array,
    item: Object,
    type: String
  },
  data () {
    return {
      line: Object,
      chartOption: null,
      w: this.width,
      h: this.height
    }
  },
  mounted () {
    this.line = this.init()
  },
  methods: {
    init: function () {
      var that = this
      const echarts = require('echarts')
      that.line = init(that, echarts)
      that.line = that.line.noConflict()
      that.line = that.line('line', '.' + that.getClass())
      // 1.查看状态下，父级为/src/views/Viewer/canvas传递chartData.Elements[i].item
      // 2.编辑状态下，父级为/src/views/Editor/canvas
      // 3.默认折线图
      if (that.item && that.item.data) {
        if (that.item.data.datacon.type === 'raw') {
          that.line.chart.setOption(that.item.data.option)
        } else if (that.item.data.datacon.type === 'connect') {
          that.$http.get('/connect/' + that.item.data.datacon.connectId)
            .then((res) => {
              const { errno, data } = res.data
              if (errno === 0) {
                that.updateSeries(data.series)
                that.updateLegend(data.Legend)
              }
            })
            .catch(() => {})
        } else if (that.item.data.datacon.type === 'get') {
          clearInterval(interval)
          const time = that.item.data.datacon.interval ? that.item.data.datacon.interval : 1
          interval = setInterval(() => {
            that.$http.get(that.item.data.datacon.getUrl)
              .then((res) => {
                that.updateSeries(res.data.series)
                that.updateLegend(res.data.Legend)
                that.line.chart.setOption(that.option)
                that.redraw()
              })
              .catch(() => {})
          }, time * 1000)
        }
      } else if (that.option) {
        that.line.chart.setOption(that.option)
      } else {
        if (that.type === 'cruve_line') {
          that.line.setTitle('折线图1')
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
        } else if (that.type === 'broken_line') {
          that.line.setTitle('折线图1')
            .setYAxisSplitLine(true)
            .setYAxisName('单位(*)')
            .setXAxisFontColor('rgb(255,255,255)')
            .setYAxisFontColor('rgb(255,255,255)')
            .setSeries([{ name: '类目一', data: [['1年内', 0], ['1-5年内', 34], ['5-10年内', 40], ['10年以上', 50]] }, { name: '类目二', data: [['1年内', 40], ['1-5年内', 30], ['5-10年内', 28], ['10年以上', 35]] }])
            .setAreaColor(['rgba(7,161,167,0.2)', 'rgba(185,141,232,0.2)'])
            .setItemColor(['#07A1A7', '#B98DE8'])
            .setLegend(['类目一', '类目二'])
            .create()
        } else if (that.type === 'ecg_line') {
          that.line.setTitle('心电图')
            .setXAxisFontColor('rgb(255,255,255)')
            .setYAxisFontColor('rgb(255,255,255)')
            .setYAxisSplitLine(true)
            .setYAxisName('单位:(*)')
            .setXAxisSplitLine(true)
            .setYAxisMinAndMax(0, 10)
            .setAxisLabelFormat('xAxis', 'HH:mm:ss')
            .setSmooth(true)
            .setSeries([{ data: [['2020-06-16 13:42:08', 2], ['2020-06-16 13:42:07', 2], ['2020-06-16 13:42:05', 2], ['2020-06-16 13:42:04', 2], ['2020-06-16 13:42:03', 2]] }])
            .setChartInterval(1100)
            .create()
          clearInterval(_interval)
          _interval = setInterval(() => {
            const date = new Date().format('yyyy-MM-dd hh:mm:ss')
            that.line.pushPoint([date, parseInt(10 * Math.random())])
          }, 1001)
        }
        that.chartOption = that.line.option
        that.updateChartOption()
      }
      return that.line
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
      this.line = init(this, echarts)
      this.line = this.line.noConflict()
      this.line = this.line('line', '.' + this.getClass())
      this.line.chart.setOption(this.option)
      // console.log(this.option)
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
      return 'chart_line_' + this.index + ''
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
