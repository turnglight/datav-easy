<template lang="pug">
  .toolbar
    .toolbox
      .tool-list
        .btn(
          v-for="item in btnList"
          :class="{active: panelKey === item.key}"
          @mouseenter="showPanel(item.key)")
          i.iconfont(:class="'icon-' + item.key")
      // 展示画布所有图层控制按钮
      .btn(:class="{active: panelKey === 'layers'}" @click="showPanel('layers')")
        i.iconfont.icon-layer
    .collapse-panel
      // 子元素容器面板
      SidePanel(:panelKey="panelKey")
</template>

<script>
import SidePanel from './SidePanel.vue'

export default {
  components: {
    SidePanel
  },
  data () {
    return {
      panelKey: '',
      btnList: [
        {
          key: 'chart',
          name: '图表'
        }, {
          key: 'text',
          name: '文字'
        }, {
          key: 'picture',
          name: '图片'
        }, {
          key: 'tools',
          name: '组件'
        }
      ],
      showCollapsePanel: false
    }
  },
  computed: {
    chartData () {
      return this.$parent.chartData
    }
  },
  methods: {
    showPanel (key) {
      console.log(key)
      if (this.panelKey === key) {
        this.panelKey = ''
      } else {
        this.panelKey = key
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  height: 100%;
}

.toolbox {
  display: inline-block;
  width: 40%;
  height: 100%;
  flex-direction: column;
  text-align:center;
  background: #ffffffe9;
  border-right: 1px solid rgba(0, 0, 0, 0.02);
  float: left;
  .tool-list {
    flex: 1;
    margin-top: 4px;
  }

  .btn {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 5px;
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s ease;
    color: #999;
    &:hover {
      cursor: pointer;
      background-color: rgba(64, 160, 255, 0.1);
      color: #666666;
    }
    &.active {
      background-color: rgba(64, 160, 255, 0.1);
      color: #409EFF;
    }
    .iconfont {
      font-size: 24px;
    }
  }
}

.collapse-panel {
  position: relative;
  left: 25px;
  width: 50%;
  float: right;
  height: 100%;
  z-index: 99999;
}
</style>
