<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <re-commend></re-commend>
  </div>
</template>

<script>
  import MHeader from './components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import reCommend from 'components/recommend/recommend'

  export default {
    components: {
      MHeader,
      Tab,
      reCommend
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl";
  @import "~common/stylus/mixin";
#app
  height:100%
  background-color: #7e8c8d

</style>
