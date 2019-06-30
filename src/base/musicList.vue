<template>
    <div class="musiclist">
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back1"></i>
        </div>
        <div class="title" v-html='title'>
        </div>
      </div>   
      <div class="bg-image" :style='bgStyle' ref="bgimg">
        <div class="filte"></div>
      </div>
      <div class="bglayer" ref="layer">
        
      </div>
      <div class="layerHeader" ref="layerheader" @click="random"> 
          <p>
            <i class="iconfont icon-play"></i>
          随机播放全部(共{{songs.length}}首)
          </p>
      </div>
      <div class="scroll" ref="scr">
        <scroll :data='songs'
              class="list" 
              :probe-type="probeType" 
              :listen-scroll="listenScroll"
              @scroll="scroll"
              ref="list">
          <div class="song-list-wrapper" ref="songlist">
            <song-list :songs='songs' @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>    
    </div>
</template>

<script>
import SongList from './songList'
import Scroll from './scroll'
import {mapActions} from "vuex"
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data() {
        return {
            scrollY: 0
        }
    },
  components: {
    SongList,
    Scroll,
    // Loading
  },
  created(){
    this.probeType = 3
    this.listenScroll = true
  },
  props: {
    bgImage:{
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
  mounted() {
    this.imgHeight = this.$refs.bgimg.clientHeight
    // this.$refs.songlist.style.top = `${this.imgHeight * 0.95}px`
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? '60px': ''
      this.$refs.list.$el.style.bottom = bottom
      console.log(this.$refs.list.$el.style,bottom,this.$refs.list.$el.style[0])
      this.$refs.list.refresh()
    },
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    selectItem (item, index) {
      // this.$emit('select', item, index)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    //  别名
    getDesc (song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`
      } else {
        return `${song.singer}`
      }
    },
    //  返回上级路由
    back() {
      this.$router.back()
    },
    //  获取滑动位置
    scroll(pos) {
      this.scrollY = pos.y
    },
    ...mapActions([
      "selectPlay",
      "randomPlay"
    ])
  },
  watch: {
    // 监听滑动位置的变化  对页面进行响应
    scrollY(newY) {
      let scale = 1
      let blur = 0
      let color = "transparent"
      let translate3dY = Math.max(-(0.9*this.imgHeight-22),newY)

      // 让遮罩进行移动
      this.$refs.layer.style['transform'] = `translate3d(0,${translate3dY}px,0)`
      this.$refs.layerheader.style['transform'] = `translate3d(0,${translate3dY}px,0)`


      let percent = Math.abs(newY / this.imgHeight)
      if (newY > 0) {
        scale = 1+ percent
        color = "transparent"
      }else{
        blur = Math.min(8*percent,8)
        color = '#fff'
      }
      //  上拉模糊 下拉放大 改变遮罩的颜色
      this.$refs.bgimg.style['transform'] = `scale(${scale})`
      this.$refs.bgimg.style.filter = `blur(${blur}px)`

      this.$refs.scr.style.background = color
      // 改变header 的颜色
      if (newY < translate3dY) {
        this.$refs.header.style.backgroundColor = "#d44439"
      }else {
        this.$refs.header.style.backgroundColor = "transparent"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../common/style/icon';
@import "../common/style/variable";
@import "../common/style/mixin";
.musiclist {
  position: fixed;
  top: 0px;
  bottom: 0;
  width: 100%;
  .header {
    position: fixed;
    width: 100%;
    height: 30px;
    background: transparent;
    z-index: 111;
    display: flex;
    align-items: center;
    .back {
      flex-basis: 24px;
      .icon-back1 {
        font-size: 24px;
        color: #fff;
    }
  }
    .title {
      margin-left: 10px;
      color: #fff;
      font-weight: bold;
    }
  }
  
  .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        background-position: 0 30%;
        .filter {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.2;
        }
}
  .bglayer {
    z-index:101;
    position: absolute;
    top: 30%;
    height: 90%;
    width: 100%;
    background: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    
  }
  .layerHeader {
    position: absolute;
    top: 30%;
    z-index: 102;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: #fff;
    width: 100%;
      p {
        margin: 12px 20px;
      }
    }
  .scroll {
    z-index:101;
    position: fixed;
    top: 35%;
    bottom: 0;
    width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: transparent;
    .list {
      overflow: visible;
      height: 100%;
    .song-list-wrapper {
      width: 100%;
    }
  }
  }
  .playall {
      position: absolute;
      background: rgba(238, 177, 8, 0.856);
      top: 21%;
      left: 33%;
      width: 30%;
      border-radius: 15%;
      z-index:102;
      P {
        text-align: center;
        color: #fff;
      }
  }
  
  
}

</style>
