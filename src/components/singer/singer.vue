<template>
  <div class="singer">
    <listview :data="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import singerClass from 'common/js/singer'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门数据'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.setSinger(singer)

        let singerId = singer.id || null
        this.$router.push(
          {
            path: '/singer/' + singerId
          }
        )
      },
      _getSingerList() {
        getSingerList().then((res) => {
            if (res.code === ERR_OK) {
              this.singers = this._normalizeSinger(res.data.list)
              //主意数据结构 ，得到的数据是没有顺序的结构 findindex表示的是名字 ，
              // 要把这些数据聚合起来，整合 再排序，
            }
          }
        )
      },
      // 规范化返回的数据 ，方便渲染，
      // 在自己开发的时候 可以要求后台返回这样的数据结构
      //  知道怎么序列化，77aa
      _normalizeSinger(list) {
        //定义map函数
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            // new SinggerClass({}) 这个类的方法
            map.hot.items.push(new singerClass({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            }))
          }

          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(
            new singerClass({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        })
        //此时的map 数据是一个对象，
        // 但是对象渲染列表是没有顺序的，所以要继续有序化
        console.log('无顺序列表对象' + map)

        //得到有序列表
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)

          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    },


    components: {
      Listview
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
