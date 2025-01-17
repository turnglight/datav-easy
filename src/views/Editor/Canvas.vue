<template lang="pug">
  div
    el-dialog(title="发布" :visible.sync="$parent.publishPopVisible" width="50%")
      div(style="margin-bottom: 16px;") 发布成功！当前图表的公开链接为：
      el-input(v-model="publicUrl" readonly)
      span(slot="footer")
        el-button(type="primary" @click="$parent.publishPopVisible = false") 确 定
    .edit-view(
      tabindex="0"
      @keydown.space.prevent="handleSpaceDown"
      @keyup.space.prevent="handleSpaceUp"
      @click.self="handleActivated(-1)")
      vue-draggable-resizable(
          :style="wrapStyle"
          :x="100"
          :y="50"
          :w="chartData.w"
          :h="chartData.h"
          class-name="screen-box"
          class-name-draggable="screen-box-draggable"
          :draggable="screenDraggable"
          :resizable="false")
        .screen(:style="screenStyle" @click.self="handleActivated(-1)" ref="screen")
          vue-drag-resize(
            v-for="(item, index) in chartData.elements"
            :key="index"
            :isActive="item.active && !$parent.preview"
            :parentScaleX="scale"
            :parentScaleY="scale"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :parentLimitation="true"
            :parentW="chartData.w"
            :parentH="chartData.h"
            :aspectRatio="false"
            :minw="20"
            :minh="20"
            :z="index"
            :isDraggable="!$parent.preview"
            :isResizable="!$parent.preview"
            @activated="handleActivated(index)"
            @resizing="handleResize(item, index, arguments[0])"
            @dragging="handleDrag(item, arguments[0])")
            div.filler(
              v-if="item.data.type == 'chart'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.filler(
                v-if="item.data.settings.type=='line'")
                EchartsEasyLine(:index="index" :type="item.data.settings.subtype" :option="item.data.option" :series="item.data.series" :legend="item.data.legend" :width="item.w" :height="item.h" :ref="'index_' + index")
              div.filler(
                v-if="item.data.settings.type=='bar'")
                EchartsEasyBar(:index="index" :option="item.data.option" :series="item.data.series" :legend="item.data.legend" :width="item.w" :height="item.h" :ref="'index_' + index")
            div.filler(
              v-if="item.data.type == 'text'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.textcontainer(
                :style="{fontFamily: item.data.datacon.fontFamily, fontWeight: item.data.datacon.bold ? 'bold' : 'normal', fontStyle: item.data.datacon.italic ? 'italic' : 'normal', color: item.data.datacon.color, fontSize: item.data.datacon.fontSize + 'px', textStroke: item.data.datacon.stroke ? item.data.datacon.strokeSize+'px '+item.data.datacon.strokeColor : '0', textShadow: item.data.datacon.shadow ? '5px 5px '+item.data.datacon.shadowBlur+'px '+item.data.datacon.shadowColor : 'none'}"
                v-text="item.data.datacon.text")
            div.filler(
              v-if="item.data.type == 'image'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.imagecontainer(
                :style="{backgroundImage: `url(${item.data.datacon.img})`, backgroundSize: item.data.datacon.imgSize, opacity: item.data.datacon.opacity}")
                .placeholder(v-show="!item.data.datacon.img")
            div.filler(
              v-if="item.data.type == 'border'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.bordercontainer(
                :class="'border' + item.data.datacon.borderId"
                :style="{opacity: item.data.datacon.opacity}")
          .mock(:class="{front: screenDraggable}")
</template>

<script>
import EchartsEasyLine from '../../components/Echarts/EchartsEasyLine.vue'
import EchartsEasyBar from '../../components/Echarts/EchartsEasyBar.vue'

export default {
  props: {
    scale: Number,
    chartData: Object,
    currentElementIndex: Number
  },
  components: {
    EchartsEasyLine,
    EchartsEasyBar
  },
  data () {
    return {
      screenDraggable: false,
      presetLine: [{ type: 'l', site: 100 }, { type: 'v', site: 200 }]
    }
  },
  computed: {
    publicUrl () {
      return `http://${window.location.host}${window.location.pathname}#/view/${this.$route.params.id}`
    },
    wrapStyle () {
      return {
        transform: `scale(${this.scale})`
      }
    },
    screenStyle () {
      return {
        backgroundColor: this.chartData.bgcolor,
        backgroundImage: `url(${this.chartData.bgimage})`,
        backgroundSize: this.chartData.bgimagesize
      }
    }
  },
  methods: {
    handleSpaceDown () {
      this.screenDraggable = true
    },
    handleSpaceUp () {
      this.screenDraggable = false
    },
    handleActivated (index) {
      this.$parent.setActiveComponentByIndex(index)
    },
    handleResize (widget, index, arg) {
      const item = widget
      this.$parent.chartData.elements[index].x = arg.left
      this.$parent.chartData.elements[index].y = arg.top
      this.$parent.chartData.elements[index].w = arg.width
      this.$parent.chartData.elements[index].h = arg.height
      if (item.data.type === 'chart') {
      // eslint-disable-next-line no-template-curly-in-string
        this.$refs['index_' + index][0].redraw()
      }
    },
    handleDrag (widget, arg) {
      const item = widget
      item.x = arg.left
      item.y = arg.top
    },
    generateData (item) {
      this.$parent.generateData(item)
    }
  },
  watch: {
    chartData: {
      handler (newVal, oldVal) {
        if (this.currentElementIndex > 0) {
          this.$refs['index_' + this.currentElementIndex][0].redraw()
        }
      }
    },
    deep: true
  }
}
</script>

<style lang="scss" scoped>
.vue-ruler-wrapper{
  overflow: hidden;
  user-select: none;
  background: url("../../assets/images/panel_background.png")  repeat;
  transform: scale(1,1);
}

.edit-view {

position: relative;
width: 100%;
height: 100%;
box-sizing: border-box;
overflow: visible;
outline: 0;
}

.screen-box {
/*width: 100%;*/
  /*height: 100%;*/
  /*position: relative;*/

  background: #ffffff;
  transform-origin: 0 0;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;

  &.screen-box-draggable {
    cursor: grab;
  }
}

.screen {
  position: relative;
  width: 100%;
  height: 100%;
  .vdr {
    border: 0;
  }
  .filler {
    .textcontainer {
      word-wrap: break-word;
    }
    .imagecontainer {
      width: 100%;
      height: 100%;
      .placeholder {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .bordercontainer {
      width: 100%;
      height: 100%;
      background: rgba(10,31,92,0.5);
      opacity: 0.85;
      /*box-sizing: border-box;*/
      border: 2px solid #2773e5;
      /*&.border1 {*/
      /*  border: 50px solid transparent;*/
      /*  border-image: url('./../../assets/images/borders/border-box.png') 50;*/
      /*}*/
      /*&.border2 {*/
      /*  border: 50px solid transparent;*/
      /*  border-image: url('./../../assets/img/borders/2.png') 50;*/
      /*}*/
      /*&.border3 {*/
      /*  border: 50px solid transparent;*/
      /*  border-image: url('./../../assets/img/borders/3.png') 50;*/
      /*}*/
    }
  }
}

.mock {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;

  &.front {
    z-index: 999;
  }
}

.vue-ruler-wrapper {
  width: 100% !important;
}

</style>
