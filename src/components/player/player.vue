<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal" 
                    @enter="enter" 
                    @after-enter="afterEnter"
                    @leave="leave" 
                    @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="iconfont icon-down"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @click.stop="changeCurrentShow">
                    <div class="middle-l" v-show="currentShow === 'cd'">
                        <div class="cd-wrapper">
                            <div class="cd" :class="cdClass">
                                <img alt="" class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">
                                {{playingLyric}}
                            </div>
                        </div>
                    </div>
                    <scroll class="middle-r"
                            ref="lyricList" 
                            v-show="currentShow === 'lyric'" 
                            :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                   class="text" 
                                   v-for="(item,index) in currentLyric.lines" 
                                   :key="index"
                                   :class="{'current': currentNumList === index}">{{item.txt}}</p>
                            </div>
                            <!-- <p class="no-lyric" v-else>{{upDatecurrentLyric}}</p> -->
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="time-r time">{{format(duration)}}</span>
                    </div>
                    <div class="operator">
                        <div class="sequence icon">
                            <i class="iconfont" :class="iconMode" @click="changeMode"></i>    
                        </div>
                        <div class="prev icon" :class="disableClass">
                            <i class="iconfont icon-left_b" @click="prev"></i> 
                        </div>
                        <div class="play-pause icon" :class="disableClass">
                            <i class="iconfont" @click="togglePlay" :class="playIcon"></i>         
                        </div>
                        <div class="next icon" :class="disableClass">
                            <i class="iconfont icon-Next" @click="next"></i> 
                        </div>
                        <div class="menu icon">
                            <i class="iconfont icon-Music-Playlist"></i> 
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="miniplayer" v-show="!fullScreen"  @click="gofull">
                <div class="icon">
                    <img :src="currentSong.image" alt="" width="40" height="40" :class="cdClass">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control" @click.stop="togglePlay">
                    <progress-circle :percent="percent">
                        <i class="iconfont icon-mini" :class="playIcon"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="iconfont icon-Music-Playlist"></i> 
                </div>
            </div>
        </transition>
        <audio id="music-audio"
                ref="audio" 
                autoplay 
                @canplay="ready" 
                @error="err" 
                @timeupdate="updateTime" 
                @ended="end"></audio>   
    </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {getSong,getLyric} from '@/api/songs'
import ProgressBar from "@/base/progressBar"
import ProgressCircle from "@/base/progressCircle"
import {playMode} from "common/js/config"
import {shuffle} from "common/js/util"
import Lyric from "lyric-parser"
import Scroll from "@/base/scroll"


export default {
    data() {
        return {
            url: '',
            songReady: false,
            currentTime: 0,
            duration: 0,
            currentLyric: null,
            currentNumList: 0,
            currentShow: 'cd',
            playingLyric: ""
        }
    },
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? "icon-24gl-repeat2" : this.mode === playMode.loop ?"icon-loop-single" : "icon-music_shuffle_button"
        },
        playIcon(){
            return this.playing ? 'icon-pause' : "icon-play"
        },
        cdClass() {
            return this.playing ? 'play' : 'play pause '
        },
        disableClass() {
            return this.songReady ? '' : 'disable'
        },
        percent() {
            return this.currentTime / this.duration
        },
        // 从getter 中获取值
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    created() {
        // setInterval(() => {
        //     console.log(this.currentTime)
        // },20)
        // setTimeout(() => {
        //     this.currentLyric.stop()
        // },4000)
    },
    methods: {
        //  改变播放模式
        changeMode() {
            let mode = (this.mode+1) % 3
            this.setMode(mode)
            let list = null
            if(mode === playMode.random) {
                list = shuffle(this.sequenceList)
            }else {
                list = this.sequenceList
            }
            this._resetCurrentList(list)
            this.setPlayList(list)
        },
        //  重新获取当前播放歌曲的位置
        _resetCurrentList(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        //  当进度条变化   父组件的currenTime 进行变化
        onProgressBarChange(per) {
            const currentTime = this.duration * per
            this.$refs.audio.currentTime = currentTime
            if(!this.playing) {
                this.togglePlay()
            }
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
            }
        },
        //  控制开关
        togglePlay() {
            this.setPlayingState(!this.playing)
            //   歌曲未准备   无法toggle
            if(!this.songReady) {
                return 
            }
            if(this.currentLyric) {
                this.currentLyric.togglePlay()
            }
        },
        //   取消全屏
        back() {
            this.setFullScreen(false)
        },
        //  全屏
        gofull() {
            this.setFullScreen(true)
        },
        enter(el,done) {

        },
        afterEnter(el,done) {

        },
        leave(el,done) {

        },
        afterLeave(el,done) {

        },
        //  前一首歌
        prev() {
            if(!this.songReady) {
                return
            }
            if(this.playList.length === 1) {
                this.loop()
            }else {
                let index = this.currentIndex - 1
                if(index === -1) {
                    index = this.playList.length-1
                }
                this.setCurrentIndex(index)
                if(!this.playing) {
                    this.togglePlay()
                }
                this.songReady = false
            }
            
        },
        //  后一首歌
        next() {
            if(!this.songReady) {
                return
            }
            if(this.playList.length === 1) {
                this.loop()
            }else {
                let index = this.currentIndex + 1
                if(index === this.playList.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if(!this.playing) {
                    this.togglePlay()
                }
                this.songReady = false
            }
            
        },
        //  audio准备好
        ready() {
            this.songReady = true
        },
        //  audio发生错误
        err() {
            this.songReady = true
        },
        //   播放结束后的操作
        end() {
            // 判断播放模式
            if(this.mode === playMode.loop) {
                this.loop()
            }else {
                this.next()
            }
        },
        //  循环播放当前这首歌
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric) {
                this.currentLyric.seek(0)
            }
        },
        //   当前进度
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        //  格式化时间
        format(interval) {
            interval = interval || 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60 | 0) 
            return `${minute}:${second}`
        },
        //  补位函数 
        _pad(num, n=2) {
            let len = num.toString().length
            while(len<n) {
                num='0'+num
                len++
            }
            return num
        },
        //   从后端获取歌曲地址
        _getSong (id) {
            getSong(id).then((res) => {
                this.url = res.data.data[0].url
            })
        },
        _getLyric(id) {
            getLyric(id).then((res) => {
                let orginLrc = res.data.lrc.lyric
                this.currentLyric = new Lyric(orginLrc,this.handle)
                if(this.playing) {
                    this.currentLyric.play()
                }
                }).catch(()=>{
                    this.currentLyric = null
                    this.playingLyric = ''
                    this.currentNumList = 0
                })
        },
        //  歌词传出的值  
        handle({txt,lineNum}) {
            this.currentNumList = lineNum
            //  前五个 不进行滚动
            if(lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum-5]
                this.$refs.lyricList.scrollToElement(lineEl,1000)
            }else {
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric = txt
        },
        // 改变middle 的显示
        changeCurrentShow() {
            this.currentShow = this.currentShow == "cd" ? "lyric" : "cd"
        },
        // vuex  获取改变状态的方法
        ...mapMutations({
            setFullScreen: "SET_FULLSCREEN",
            setPlayingState: "SET_PLAYING_STATE",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAYLIST"
        })
    },
    watch: {
        // 监听  当前歌的变化
        currentSong(newVal, oldVal) {
            if (!newVal.id) {
                return
            }
            //  歌曲不变的情况 
            if (newVal.id === oldVal.id) {
                return
            }
            // this 指向有问题    TODO :  // 研究重点
            //  研究好了  MD data中初始值时  对象应为null   而不是{}
            if(this.currentLyric) {
               this.currentLyric.stop()
            }
            this.$refs.audio.pause()
            this.$refs.audio.currentTime = 0
            // 更改url
            this._getSong(newVal.id)
            this._getLyric(newVal.id)
        },
        url (newUrl) {
             //  更改 url
            this.$refs.audio.src = newUrl
            // 获取歌曲时间
            let stop = setInterval(() => {
                this.duration = this.$refs.audio.duration
                if (this.duration) {
                clearInterval(stop)
                }
            }, 150)
            this.setPlayingState(true)
        },
        //   歌曲播放状态的变化
        playing(newVal) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newVal ? audio.play() : audio.pause()
            })
        }
    },
    components: {
        ProgressBar,
        ProgressCircle,
        Scroll
    }
}
</script>

<style lang="scss" scoped>
@import '../../common/style/icon';
    .player {
        .normal-player {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 150;
            background: #2a5061;
            .background {
                position: absolute;
                left: -50%;
                top: -50%;
                width: 300%;
                height: 300%;
                z-index: -1;
                opacity: 0.6;
                filter: blur(30px);
            }
            .top {
                position: relative;
                margin-bottom: 25px;
                background: transparent;
                top: 0;
                z-index: 100;
                width: 100%;
                .back {
                    position: absolute;
                    top: 0;
                    left: 6px;
                    z-index: 50;
                    .icon-down {
                        display: block;
                        padding: 5px 9px;
                        font-size: 35px;
                        color: #fff;
                    }
                }
                .title {
                    width: 70%;
                    margin: 0 auto;
                    padding-top: 10px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    color: #fff;
                }
                .subtitle {
                    width: 70%;
                    margin: 0 auto;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #fff;
                }
            }
            .middle {
                display: flex;
                align-items: center;
                position: fixed;
                width: 100%;
                top: 80px;
                bottom: 170px;
                white-space: nowrap;
                font-size: 0;
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                    .cd-wrapper {
                        position: absolute;
                        left: 10%;
                        top: 0;
                        width: 80%;
                        height: 100%;
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 15px solid rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            .image {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                            &.play {
                                animation: rotate 20s linear infinite;
                            }
                            &.pause {
                                animation-play-state: paused;
                            }
                        }
                    }
                    .playing-lyric-wrapper {
                        position: absolute;
                        bottom: -50px;
                        width: 80%;
                        height: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        .playing-lyric {
                            line-height: 16px;
                            font-size: 16px;
                            color: #fff;
                            text-align: center;
                        }
                    }
                }
                .middle-r {
                display: inline-block;
                position: absolute;
                top: 0;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                 .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        line-height: 40px;
                        color: #111;
                        font-size: 12px;
                        &.current {
                        color: #FFF;
                        }
                    }
                    .no-lyric {
                        line-height: 40px;
                        margin-top: 60%;
                        color: #ccc;
                        font-size: 12px;
                    }
                    }
                }
            }
            .bottom {
                position: absolute;
                bottom: 50px;
                width: 100%;
                .progress-wrapper {
                    display: flex;
                    align-items: center;
                    width: 80%;
                    margin: 0 auto;
                    padding: 10px 0;
                    .time {
                        color: #fff;
                        font-size: 12px;
                        flex: 0 0 30px;
                        line-height: 30px;
                        width: 30px;
                        &.time-l {
                            text-align: left
                        }
                        &.time-r {
                            text-align: right
                        }
                    }
                    .progress-bar-wrapper {
                        flex: 1;
                    }
                }
                .operator {
                    display: flex;
                    align-items: center;
                    .icon {
                        flex: 1;
                        color: #fff;
                        text-align: center;
                        &.disable {
                            color: #111
                        }
                        i {
                            font-size: 30px;
                        }
                        .mode {
                            font-size: 25px;
                        }
                        &.i-center {
                            padding: 0 20px;
                            text-align: center;
                            i {
                            font-size: 40px;
                            }
                        }
                        &.i-right {
                            text-align: left;
                        }
                        .icon-like {
                            color: red;
                        }
                        .icon-left_b {
                            font-weight: bold;
                        }
                    }
                }
            }
            &.normal-enter-active, &.normal-leave-active {
                transition: all .4s;
                .top,.bottom {
                    transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
                }
            }
            &.normal-enter,&.normal-leave-to {
                opacity: 0;
                visibility: hidden;
                .top {
                    transform: translate3d(0,-100px,0)
                }
                .bottom {
                    transform: translate3d(0,100px,0)
                }
            }
        }
        .miniplayer {
            display: flex;
            align-items: center;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 180;
            width: 100%;
            height: 60px;
            background: rgba(255, 255, 255, 1);
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            .icon {
                flex: 0 0 40px;
                width: 40px;
                padding: 0 10px 0 20px;
                img {
                    border-radius: 50%;
                    &.play {
                         animation: rotate 20s linear infinite;
                        }
                    &.pause {
                         animation-play-state: paused;
                        }
                }
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                overflow: hidden;
                .name {
                    margin-bottom: 2px;
                    line-height: 14px;
                    font-weight: normal;
                    font-size: 14px;
                    color: #111;
                }
                .desc {
                    font-size: 8px;
                    color: #111;
                }
            }
            .control {
                flex: 0 0 30px;
                display: flex;
                flex-direction: row;
                width: 30px;
                justify-content: flex-end;
                padding: 0 10px;
                .iconfont {
                    font-size: 28px;
                }
                .icon-mini {

                    position: absolute;
                    top: 0;
                    left: 0;
                    transform: translate(2px,2px);
                }
            }
            &.mini-enter-active, &.mini-leave-active {
                transition: all o.3s;
            }
            &.mini-enter, &.mini-leave-to {
                opacity: 0;
            }

        }
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

