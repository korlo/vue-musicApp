<template>
  <div class="singer">
      <list-view :data='singers' ></list-view>
  </div>
</template>

<script>
  import singerClass from 'common/js/singer'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import  ListView from 'base/listview/listview'

  const HOT_NAME = "热门数据"
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
      _getSingerList() {
        getSingerList().then((res) => {
            if (res.code === ERR_OK) {
              this.singers = this._normalizeSinger(res.data.list)
              console.log(this.singers)
              //主意数据结构 ，得到的数据是没有顺序的结构 findindex表示的是名字 ，
              // 要把这些数据聚合起来，整合 再排序，
            }
          }
        )
      },
      // 规范化返回的数据 ，方便渲染，
      // 在自己开发的时候 可以要求后台返回这样的数据结构
      //  知道怎么序列化， 学会处理数据
      _normalizeSinger(list) {
        //定义map函数
        let map = {
          hot: {
            title: HOT_NAME,
            item: []
          }
        }

        list.forEach((index, item) => {
          if (index < HOT_SINGER_LEN) {
            // new SinggerClass({}) 这个类的方法
            map.hot.item.push(new singerClass({
              id: item.Fsinger_min,
              name: item.Fsinger_name,
              avatar: item.Fsinger_min
            }))
          }

          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              item: []
            }
          }
          map[key].items.push(
            new singerClass({
              id: item.Fsinger_min,
              name: item.Fsinger_name
            })
          )
        })
        //此时的map 数据是一个对象，
        // 但是对象渲染列表是没有顺序的，所以要继续有序化
        console.log('无顺序列表对象' + map)

        //得到有序列表
        let hot = []
        let res = []
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
        console.log('列表数据结构' + hot.concat(ret))
        return hot.concat(ret)
      }
    },
    componts:{
      ListView
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
