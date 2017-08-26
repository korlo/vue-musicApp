<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">

      <span class="dot" v-for="(item,index) in dots"
            :class="{active:currentPageIndex===index}">
      </span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }

    },
    props: {
      //设置是否轮播
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 800
      }
    },
    mounted() {
      //可以用this.nextTick方法，setTimeout也行 ，
      // 20毫秒是浏览器刷新是17毫秒 经验来的
      setTimeout(() => {
        this._setSliderWidth()
        this._initSlider()
        this._initDots()
        if (this.autoPlay) {
          this._play()
        }
      }, 20),
        window.addEventListener('resize', () => {
          if (!this.slider) {

          } else {
            //
            this._setSliderWidth(true)
            //刷新 slider
            this.slider.refresh()
          }
        })
    },
    methods: {
      _setSliderWidth(isResize) {
        //获取这个轮播图有多少个图片
        this.children = this.$refs.sliderGroup.children
        let width = 0
        //获取这个轮播图整个容器的宽度
        let sliderWidth = this.$refs.slider.clientWidth

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          //添加样式
          // 这个添加 样式的 ？？ 为什么 可以直接把dom  class传入进去就可以修改？
          //如何保证其正确性？？
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        //如果有轮播图 dom要复制左右两个宽度用于轮播
        // isResize 只有在第一次加载的时候才吧这个宽度加起来
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        // DOS 多复制了两个 是为什么？？？  只能 -2 解决先
        this.dots = new Array(this.children.length - 2)
      },
      _initSlider() {
        //初始化滚动  注意参数，可以查看API
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentun: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.2,
          snapSpeed: 5000,
          click: true

        })
        //初始化bscroll，滚动完成的时候会派发事件
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          //如果是轮播状态为什么要-1？？
          if (this.loop) {
            pageIndex = pageIndex - 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        //为什么要+1？？？
        if (this.loop) {
          pageIndex += 1
        }
        //设置定时器  bscroll 的接口
        //但是这个定时器 只执行一次的 在滚动到下一页的时候再执行这个函数
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 5000)
        }, this.interval)
      }

    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
