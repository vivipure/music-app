<template>
   <ul>
     <li v-for="(song, index) in songs" :key="song.id" class="item" @click="selectItem(song, index)">
       <p class="count">{{index + 1}}</p>
       <div class="content">
         <h2 class="name">{{song.name}}</h2>
         <p class="desc">{{getDesc(song)}}</p>
       </div>
     </li>
   </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array
    }
  },
  computed: {
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getDesc (song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`
      } else {
        return `${song.singer}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../common/style/variable";
@import "../common/style/mixin";
@import "../common/style/reset";
  .item {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    border-bottom: 1px solid rgb(228, 228, 228);
    .count {
      flex: 0 0 50px;
      width: 50px;
      text-align: center;
      color: $color-text-g;
    }
    .content {
      flex: 1;
      display: flex;
      line-height: 20px;
      flex-direction: column;
      overflow: hidden;
      .name {
        width: 80%;
        @include no-wrap();
        color: #111;
        font-size: 14px;
      }
      .desc {
        @include no-wrap();
        width: 80%;
        font-size: 12px;
        color: #ccc;
      }
    }
  }
</style>
