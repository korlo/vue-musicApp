<template>
  <transition name="slide">
    <music-list
      :songs="song"
      :title="title"
      :bgImage="bgImage">

    </music-list>
  </transition>

</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {createdSong} from 'common/js/song'
  import {ERR_OK} from 'api/config'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        song: []
      }
    },
    computed: {
      title(){
       return  this.singer.name

      },
      bgImage(){
        return  this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      console.log(this.singer)
      this._getDetail(this.singer.id)

    },
    methods: {
      _getDetail() {

        //刷新当前页面的时候 没有这个ID
        //所以要回退到歌手列表页面 ,边界处理的例子
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }

        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.song = this._npmallizeSongs(res.data.list)
            console.log(this.song)
          }
        })
      },

      //格式化返回的数据 ,拿到想要的数据格式
      //其实直接拿到这个数据 直接渲染不可以吗?  为什么要封装一个这样的函数
      // 代码精简  拿到的数据更准确
      _npmallizeSongs(list) {
        let ret = []
        list.forEach((item) => {
            //对象结构赋值 ????
            //forEach 这个方法怎么使用？？还有这种操作
            let {musicData} = item
            if (musicData.songid && musicData.albummid) {
              ret.push(createdSong(musicData))
            }
          }
        )
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.5s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
