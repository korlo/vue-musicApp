<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      //为什么要用z这个probeType
      probeType: {
        type: Number,
        default: 1
      },
      //派发点击事件
      click: {
        tyle: Boolean,
        default: true
      },

      //初始化数据， 会有刷新数据的操作
      //初始化 scroll 的时候 是在 mounted 时候
      // 但是数据是直接拿到 ，然后渲染了页面 ，要refresh 刷新才能拿到dom
      // 两个vue组件同时工作，recommend组件的dom 没有渲染，但是这边的mounted 已经执行了，所以要从新刷新一次啊
      data: {
        type: Array,
        default: null
      },

      //监听列表的滚动情况
      listenScroll: {
        type: Boolean,
        default: false
      }
    },

    mounted () {
      //dom 渲染转备好了
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.probeType
        })

        //监听列表滚动
        if (this.listenScroll) {
          let self = this
          //监听列表  pos是什么数据?
          this.scroll.on('scroll', (pos) => {
            // pos 数据是 当前滚动的 x y坐标
            self.$emit('scrolllisten', pos)
          })
        }
      },

      //代理Bscrolll里面的方法
      enable () {
        this.scroll && this.scroll.enable()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      //从新计算高度 刷新
      refresh () {
        this.scroll && this.scroll.refresh()
      }
      ,
      //better-Scroll API 里面的方法??? 为什么可以这样用
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElemetn () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }

    },
    watch: {
      //这个必要的 ，每次data改变都可以
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
