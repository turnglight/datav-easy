<template lang="pug">
  .editor-view(:scale="1")
    .topbar-view
      Topbar
    .center
      // 左侧工具栏
      .toolbar-view(v-show="!preview")
        Toolbar
          // 画布screenContainer，利用router-view的容器特性嵌入子路由组件/src/views/Editor/Canvas.vue
      .main-view
        router-view(:scale="scale" ref="screenContainer")
      // 右侧配置栏
      .config-view(v-show="!preview")
        Config(:currentElement="this.currentElement")
      // 画布缩放百分比控制按钮
      .scale-view(:class="{preview: preview}")
        ScaleBar(@update:scale="changeScale")

</template>

<script>
import Topbar from './Topbar.vue'
import Toolbar from './Toolbar.vue'
import Config from './Config.vue'
import ScaleBar from './ScaleBar.vue'
import html2canvas from 'html2canvas'
import Uuid from 'node-uuid'

var interval

export default {
  components: {
    Topbar,
    Toolbar,
    Config,
    ScaleBar
  },
  data () {
    return {
      currentElement: {},
      title: '',
      scale: 0.8,
      preview: false,
      chartData: {
        elements: []
      },
      publishPopVisible: false,
      currentElementIndex: -1
    }
  },
  mounted () {
    // 调用接口加载当前画布数据
    this.$http.get('/chart/' + this.$route.params.id)
      .then((res) => {
        const { errno, data } = res.data
        if (errno === 0) {
          this.title = data.title
          this.chartData = data.chartData
        }
      })
      .catch(() => {})
  },
  beforeDestroy () {
    clearInterval(interval)
  },
  methods: {
    changeScale (scale) {
      this.scale = scale
    },
    // 子组件/src/views/Editor点击画布中的元素，调用该函数，修改当前元素索引值，联动config
    setActiveComponentByIndex (index) {
      this.currentElementIndex = index
      if (this.currentElementIndex >= 0) {
        this.currentElement = this.chartData.elements[this.currentElementIndex]
      }
      for (let i = 0; i < this.chartData.elements.length; i += 1) {
        const element = this.chartData.elements[i]
        if (index === i) {
          element.active = true
        } else {
          element.active = false
        }
      }
    },
    addComponent (data) {
      this.chartData.elements.push(data)
    },
    deleteComponent (index) {
      this.chartData.elements.splice(index, 1)
    },
    saveChartData () {
      // 调用generateScreenShot对当前画布进行截图，并保存返回图片url，再保存当前画布
      this.generateScreenShot().then(url => {
        this.$http.put('/chart/' + this.$route.params.id, {
          img: url,
          chartData: this.chartData
        }).then(
          (res) => {
            const { errno } = res.data
            if (errno === 0) {
              this.publishPopVisible = true
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            }
          })
          .catch(() => {})
      })
    },
    generateData (item) {
      if (item.data.datacon.type === 'raw') {
        item.data.generated = item.data.datacon.data
      } else if (item.data.datacon.type === 'connect') {
        this.$http.get('/connect/' + item.data.datacon.connectId)
          .then((res) => {
            const { errno, data } = res.data
            if (errno === 0) {
              // console.log(data.data);
              item.data.generated = data.data
            }
          })
          .catch(() => {})
      } else if (item.data.datacon.type === 'get') {
        clearInterval(interval)
        const time = item.data.datacon.interval ? item.data.datacon.interval : 1
        interval = setInterval(() => {
          this.$http.get(item.data.datacon.getUrl)
            .then((res) => {
              item.data.series = res.data.series
              item.data.legend = res.data.Legend
            })
            .catch(() => {})
        }, time * 1000)
      }
    },
    // 将大屏生成简略小图
    generateScreenShot () {
      const that = this
      return new Promise(function (resolve, reject) {
        const screenRef = that.$refs.screenContainer.$refs.screen
        html2canvas(screenRef, {
          backgroundColor: '#142E48'
        }).then((canvas) => {
          const dataURL = canvas.toDataURL('image/png')
          const blob = that.dataURLtoBlob(dataURL)
          const file = new File([blob], Uuid.v1() + '.png', { type: 'png', lastModified: Date.now() })
          const param = new FormData() // 创建form对象
          param.append('file', file)// 通过append向form对象添加数据
          const url = that.$http.post('/api/uploadfile', param).then(res => {
            console.log(res.data.url)
            return res.data.url
          })
            .catch(() => {})
          resolve(url)
        })
      })
    },
    // 将base64转换为blob
    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.topbar-view {
  height: 5%;
  width: 100vw;
  z-index: 1000;
}

.center {
  width: 100%;
  height: 95%;
}

.toolbar-view {
  position: relative;
  display: inline-block;
  float: left;
  width: 2.5%;
  height: 100%;
  z-index: 1000;
}

.config-view {
  position: relative;
  display: inline-block;
  float: right;
  width: 15%;
  height: 100%;
  z-index: 1000;
}

.scale-view {
  position: absolute;
  right: 316px;
  bottom: 16px;
  z-index: 1000;
  &.preview {
    right: 40px;
  }
}

.main-view {
  position: relative;
  padding-top: 10px;
  padding-left: 20px;
  display: inline-block;
  background: #eeeeee;
  overflow: hidden;
  width: 80%;
  height: 100%;
}
</style>
