<template lang="pug">
  .div
    .layer-panel(v-if="panelKey === 'layers'")
      .title
        span 图层
      // 图层列表
      .layer-list
        draggable(
          v-model="chartData.elements"
          @start="handleLayerListDragStart"
          @end="handleLayerListDragEnd"
          ghost-class="ghost")
          transition-group(type="transition" :name="!drag ? 'flip-list' : null")
            .list-item(
              v-for="(item, index) in chartData.elements"
              :key="item.name"
              @click="$parent.$parent.setActiveComponentByIndex(index)"
              :class="{active: index === $parent.$parent.currentElementIndex}")
              .name {{item.name}}
              i.el-icon-delete.icon(@click="handleDeleteComponent(index)")
    .panel(v-else-if="panelKey === 'chart'")
      .component-list
        .list-item(v-for="(item,index) in componentList[panelKey].children" @click="setActivePanel(index)")
          .img-wrapper
            img(:src="item.img" :title="item.name")
      .child-component-list(v-if="this.show===true" :class="")
        .list-item(v-for="item in componentList[panelKey].children[currentChildIndex].children" @click="handleAddComponent(item)")
          .img-wrapper
            img(:src="item.img" :title="item.name")
    .panel(v-else-if="panelKey !== ''")
      .component-list
        .list-item(v-for="item in componentList[panelKey].children" @click="handleAddComponent(item)")
          .img-wrapper
            img(:src="item.img" :title="item.name")
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: ['panelKey'],
  components: {
    draggable
  },
  data () {
    return {
      drag: false,
      show: false,
      currentChildIndex: 0,
      componentList: {
        chart: {
          name: '图表',
          children: [
            {
              id: 'line',
              name: '线图',
              img: require('../../assets/images/charts/line.svg'),
              children: [
                {
                  id: 'cruve_line',
                  type: 'line',
                  name: '曲线图',
                  img: require('../../assets/images/charts/cruve_line.svg')
                },
                {
                  id: 'broken_line',
                  type: 'line',
                  name: '折线图',
                  img: require('../../assets/images/charts/broken_line.svg')
                },
                {
                  id: 'ecg_line',
                  type: 'line',
                  name: '心电图',
                  img: require('../../assets/images/charts/ecg_line.svg')
                }
              ]
            },
            {
              id: 'bar',
              name: '柱状图',
              img: require('../../assets/images/charts/bar.svg')
            },
            {
              id: 'pie',
              name: '饼状图',
              img: require('../../assets/img/charts/pie.png')
            },
            {
              id: 'ring',
              name: '环状图',
              img: require('../../assets/img/charts/ring.png')
            },
            {
              id: 'funnel',
              name: '漏斗图',
              img: require('../../assets/img/charts/funnel.png')
            },
            {
              id: 'radar',
              name: '雷达图',
              img: require('../../assets/img/charts/radar.png')
            },
            // {
            //   id: "map-world",
            //   name: "世界地图",
            //   img: require("../../assets/img/charts/map-world.png")
            // },
            {
              id: 'map',
              name: '中国地图',
              img: require('../../assets/img/charts/map-china.png')
            },
            // {
            //   id: "sankey",
            //   name: "桑基图",
            //   img: require("../../assets/img/charts/sankey.png")
            // },
            // {
            //   id: "scatter",
            //   name: "散点图",
            //   img: require("../../assets/img/charts/scatter.png")
            // },
            // {
            //   id: "candle",
            //   name: "K线图",
            //   img: require("../../assets/img/charts/candle.png")
            // },
            // {
            //   id: "gauge",
            //   name: "仪表盘",
            //   img: require("../../assets/img/charts/gauge.png")
            // },
            {
              id: 'liquidfill',
              name: '水球图',
              img: require('../../assets/img/charts/liquidfill.png')
            }
            // {
            //   id: "wordcloud",
            //   name: "词云图",
            //   img: require("../../assets/img/charts/wordcloud.png")
            // }
          ]
        },
        text: {
          name: '文本',
          children: [
            {
              id: 'text',
              name: '文本',
              img: require('../../assets/img/charts/text.png')
            }
          ]
        },
        picture: {
          name: '图片',
          children: [
            {
              id: 'image',
              name: '图片',
              img: require('../../assets/img/charts/image.png')
            }
          ]
        },
        tools: {
          name: '组件',
          children: [
            {
              id: 'border',
              name: '边框',
              img: require('../../assets/img/charts/border.png')
            }
          ]
        }
      },
      layerList: []
    }
  },
  computed: {
    chartData () {
      return this.$parent.chartData
    }
  },
  methods: {
    setActivePanel (index) {
      if (this.show) {
        this.show = false
      } else {
        this.show = true
        this.currentChildIndex = index
      }
    },
    handleLayerListDragStart (e) {
      this.drag = true
      this.$parent.$parent.setActiveComponentByIndex(e.oldIndex)
    },
    handleLayerListDragEnd (e) {
      this.drag = false
      this.$parent.$parent.setActiveComponentByIndex(e.newIndex)
    },
    handleAddComponent (item) {
      let initData = {}
      let component = {}
      if (item.id === 'text') {
        initData = {
          type: 'text',
          datacon: {
            text: '请输入文字',
            color: '#ffffff',
            fontSize: 24,
            bold: false,
            italic: false,
            stroke: false,
            strokeColor: '#ffffff',
            strokeSize: 2,
            shadow: false,
            shadowColor: '#ff0000',
            shadowBlur: 10
          }
        }
        component = {
          name: '新建图层' + (this.chartData.elements.length + 1),
          x: 10,
          y: 10,
          w: 200,
          h: 50,
          bgcolor: 'rgba(0,0,0,0)',
          active: false,
          data: initData
        }
      } else if (item.id === 'image') {
        initData = {
          type: 'image',
          datacon: {
            img: '',
            imgSize: 'cover',
            opacity: 1
          }
        }
        component = {
          name: '新建图层' + (this.chartData.elements.length + 1),
          x: 10,
          y: 10,
          w: 200,
          h: 50,
          bgcolor: 'rgba(0,0,0,0)',
          active: false,
          data: initData
        }
      } else if (item.id === 'border') {
        initData = {
          type: 'border',
          datacon: {
            borderId: 1,
            opacity: 1
          }
        }
        component = {
          name: '新建图层' + (this.chartData.elements.length + 1),
          x: 10,
          y: 10,
          w: 400,
          h: 200,
          bgcolor: 'rgba(0,0,0,0)',
          active: false,
          data: initData
        }
      } else {
        initData = {
          type: 'chart',
          settings: {
            type: item.type,
            subtype: item.id
          },
          option: null,
          series: null,
          legend: null,
          datacon: {
            type: 'raw',
            connectId: '',
            data: null,
            getUrl: '',
            interval: 2
          },
          generated: {}
        }
        component = {
          name: '新建图层' + (this.chartData.elements.length + 1),
          title: '新建图层' + (this.chartData.elements.length + 1),
          x: 10,
          y: 10,
          w: 400,
          h: 200,
          bgcolor: 'rgba(0,0,0,0)',
          active: false,
          data: initData
        }
      }
      this.$parent.$parent.addComponent(component)
    },
    handleDeleteComponent (index) {
      this.$parent.$parent.deleteComponent(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.layer-panel {
  height: 100%;
  width: 200px;
  display: block;
  background: #dddddd;
  flex-direction: column;
  box-shadow: 4px 0 4px #00000005;
}
.panel {
  height: 100%;
  width: 50px;
  display: block;
  flex-direction: column;
  box-shadow: 4px 0 4px #00000005;
}
.title {
  color: #858e8d;
  text-align: center;
  height: 30px;
}
.component-list {
  position: absolute;
  flex: 1;
  background: #dddddd;
  .list-item {
    transition: opacity, background 0.3s ease;
    text-align: center;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
      background: rgba(64, 160, 255, 0.1);
      border: 1px solid #409eff;
      .name {
        color: #666666;
      }
    }

    .img-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      img {
        height: 40px;
      }
    }

    .name {
      height: 20px;
      line-height: 20px;
      font-size: 13px;
      color: #777777;
    }
  }
}

.child-component-list {
  position: absolute;
  background: #cddddd;
  left: 43px;
  .list-item {
    transition: opacity, background 0.3s ease;
    text-align: center;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
      background: rgba(64, 160, 255, 0.1);
      border: 1px solid #409eff;
      .name {
        color: #666666;
      }
    }

    .img-wrapper {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      img {
        height: 30px;
      }
    }

    .name {
      height: 20px;
      line-height: 20px;
      font-size: 13px;
      color: #777777;
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.3;
  background: #c8ebfb;
}

.layer-list {
  flex: 1;
  padding: 0;
  /*overflow: scroll;*/

  .list-item {
    display: flex;
    align-items: center;
    height: 48px;
    width: 100%;
    background: #eeeeee;
    transition: background 0.3s ease;
    border-top: 1px solid rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    border-right: 6px solid transparent;
    margin-bottom: -1px;
    padding: 0 16px;
    box-sizing: border-box;

    &.active {
      background: rgba(64, 160, 255, 0.06);
      border-right: 6px solid #409eff7d;
    }

    &:hover {
      opacity: 1;
      background: rgba(64, 160, 255, 0.06);

      .icon {
        opacity: 1;
      }
    }

    .name {
      flex: 1;
      color: #777777;
    }

    .icon {
      float: right;
      color: #999999;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>
