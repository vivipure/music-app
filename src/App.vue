<template>
  <div id="app">
    <header-bar></header-bar>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import HeaderBar from '@/components/headerBar/headerBar'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'

export default {
  name: 'App',
  components: {
    HeaderBar,
    Tab,
    Player
  }
}
</script>
<style lang="scss" scoped>
 @import 'common/style/index.scss';
 #app {
   position: fixed;
   top: 0;
   height: 100%;
   width: 100%;
   overflow: hidden;
   left: 0;
   background: #fff;
 }
</style>

