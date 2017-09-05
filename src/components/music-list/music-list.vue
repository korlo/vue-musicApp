<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgstyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>

    <!--
      添加一个背景层 ,在滚动的时候 显示遮住 头像背景
    -->
    <div class="bg-layer" ref="layer"></div>

    <!--
    添加scroll 滚动组件
    @scroll="scroll" 监听滚动, 在sroll组件里面没有这个?
    :listen-scroll   监听滚动,可以拿到坐标
    :probe-type=     1表示不实时监听, 3实时监听
    -->
    <scroll class="list"
            :data="songs"
            @scrolllisten='scroll'
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songsDetail="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'

  const TITLE_HEIGHT = 40

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        listenScroll: true,
        probeType: 3,

        //srollY表示的是当前的Y坐标, 各种dom操作的基础, scroll组件传过来
        scrollY: 0
      }
    },

    computed: {
      bgstyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted() {
      // transformY 是歌单向上滚动的最大高度
      this.imageHeight = this.$refs.bgImage.clientHeight

      // 歌单向下滚动的最大高度?? 为什么设置向下滚动最小?
      this.miniTranslateY = -this.imageHeight + TITLE_HEIGHT

      //根据屏幕的不同适应不同的 歌手背景图高度  给歌单设置高度
      //this.$refs.list.$el  $el 什么时候后使用$el??
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      scroll(pos) {
        //scroll拿到从scroll 组件里面传输过来的Y坐标
        console.log('pos', pos)

        // 注意往上推 Y 是负值, 往下拉是正值  可以看打印出的Y坐标
        this.scrollY = pos.y
      }
    },
    watch: {
      scrollY(newY) {
        //背景层不可以超过整个屏幕的高度 ,不能无限滚动,只能滚动到某一位置 ,最大滚动距离
        // 最大滚动距离 就是头像图片的高度
        //Math.max()的 返回参数中最大的值  为什么要这样子用??? 直接设置死高度行不行?
        // 直接设置死高度,就不是动态变化了
        let transformY = Math.max(this.miniTranslateY, newY)

        //当上下滚动的时候 ,设置用来遮盖背景层的宽高, 用transfrom 动画实现
        this.$refs.layer.style['transform'] = `translate3d(0,${transformY}px,0)`
        this.$refs.layer.style['-webkit-transform'] = `translate3d(0,${transformY}px,0)`


        let zIndex = 0
        // 如果滚动条网上滚 超过了 头像背景图片
        if (newY < this.miniTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
        } else {
          // 往下滑的时候 回到原来的状态
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex

        //下拉的时候 头像背景变大
        let scale = 1
        //高斯模糊的效果
        let blur = 0

        // 这个公式 为什么要这样子??? 这么计算得到?
        const percent = Math.abs(newY / this.imageHeight)
        //往下拉
        if (newY > 0) {
          scale = 1 + percent
          //往下拉的时候 背景zindex不是最高级
          this.$refs.bgImage.style.zIndex = 100
        } else {
          blur = Math.min(20 * percent, 20)
        }
        // scale属性是translate3d 的 记住以后怎么用
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['-webkit-transform'] = `scale(${scale})`

        //只有手机 ios 有这个模糊效果
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`

      }


    },
    components: {
      Scroll,
      SongList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
