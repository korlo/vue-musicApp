<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="getdisclist">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for='item in recommends'>
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in getdisclist" class="item">
              <div class="icon">
                <img :src="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Scroll from 'base/Scroll/Scroll'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    data() {
      return {
        recommends: [],
        getdisclist: []
      }
    },
    created() {
      //这里还有个坑 ，当 _getRecommend 轮播图后渲染出来的时候，下面的歌单列表会滚动不倒底部
      //原因是因为 歌单列表是根据dom 来计算高度，轮播图没渲染出来就计算不了
      // 把这个设置成延迟之后，就滚动不倒底部了，所以要做一个判断，
      //当这个轮播图接口被延迟加载的时候， 记录当图片被加载完成时候添加一个事件，
      // 这个事件更新bscroll的refresh（）
//      setTimeout(()=>{
//        this._getRecommend()
//      },2000)

      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
            if (res.code === ERR_OK) {
              this.recommends = res.data.slider
            } else {
              console.log('getRecommend')
            }
          }
        )
      },
      _getDiscList() {
        getDiscList().then((res) => {
            if (res.code === ERR_OK) {
              this.getdisclist = res.data.list
            } else {
              console.log('getDiscList')
            }
          }
        )
      },
      loadImage(){
        if(!this.checkLoaded){
          //这个refresh（） 是scroll组件里面的？？ 还有这种操作
          //记录一下？？？
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }

    },
    components: {
      Slider,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
