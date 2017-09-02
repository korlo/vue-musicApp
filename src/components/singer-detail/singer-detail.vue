<template>
  <transition name="slide">
    <div class="singer-detail">
      <h1>详情列表</h1>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      console.log(this.singer)
    }


  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    background: $color-background
    top: 0
    right: 0
    bottom: 0
    left: 0

  .slide-enter-active, .slide-leave-active
    transition: all 0.5s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
