<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listen-scroll="listenScroll"
          @scrolllisten="scrolllisten"
          :probe-type="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img :src="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchmove.stop.prevent="onShortcutTouchMove"
         @touchstart.stop.prevent="onShortcutTouchStart"
         @touchend.stop>
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :class="{'current':currentIndex === index }"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed">
      <div class="fixed-title"></div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const LIST_HEIGHT = 0
  export default {
    props: {
      data: {
        type: Array,
        default: []
      },

    },
    data() {
      return {
        //实时滚动的位置
        scrollY: -1,
        //检测当前listgroup的index
        currentIndex: 0

      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      // 这个 3 表示什么????改为3 之后的数据刷新变快很多
      this.probeType = 3
      this.lightHeight = []
    },
    computed: {
      shortcutList() {
        // map的方法记录一下,怎么获取首字符
        return this.data.map((data) => {
          return data.title.substr(0, 1)
        })
      }
    },
    methods: {
      onShortcutTouchStart(event) {

        // getData 封装的这个方法 是怎么获取目标的index 的
        // 为什么要这样获取
        let anchorIndex = getData(event.target, 'index')

        // event.touches 这个方法的用法??
        //获取 点击该 div 在屏幕的 具体位置参数
        let firsttouch = event.touches[0]
        //记录当前的Y坐标 和 当前的index
        this.touch.y1 = firsttouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },

      //滚动的时候获取下标并滑到该index
      onShortcutTouchMove(event) {
        //的到滑动到结束时候的 位置坐标
        let firsttouch = event.touches[0]
        this.touch.y2 = firsttouch.pageY

        //计算偏移的位置, 然后除以每一个 div 的高度 , 就得到偏移了 多少个div
        // 这个div 的高度这么计算得到?? 可以在google浏览器直接查看元素
        // | 0 表示的是向下取整数
        let delat = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + parseInt(delat)

        this._scrollTo(anchorIndex)
      },

      //接收从scroll 组件传来的参数
      scrolllisten(pos) {
        //获取当前的Y 坐标
        this.scrollY = pos.y
      },

      _scrollTo(anchorIndex) {
        //注意这个 listview 是最外层的容器, listGroup是列表的容器,
        // scrollToElemetn 这个方法表示的是滚动到哪一个元素
        //后面的 0 参数 表示的是 多少秒滑动到该元素
        this.$refs.listview.scrollToElemetn(this.$refs.listGroup[anchorIndex], 800)
      },

      //需要计算没个listGroup的高度 和位置
      // 这一段非常不会  算了 不看了跳过
      _calculateHeight() {
        this.lightHeight = []
        const list = this.$refs.listGroup
        let height = 0;
        this.lightHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          //lightHeight 跟 scrollY对比
          this.lightHeight.push(height)
        }
      }

    },
    components: {
      Scroll
    },

    watch: {
      //当dom 滚动变化的时候要执行这个
      //为什么要watch data？
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)

      },
      scrollY(newY) {
        const listHeight = this.lightHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY > height1 && -newY < height2)) {
            this.currentIndex = i
            console.log(this.currentIndex)
            return
          }
        }
        this.currentIndex = 0
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
