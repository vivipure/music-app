<template>
    <div class="recommend">
        <Scroll class="recommend-content" ref="scroll" :data='musicList'>
            <div>
                 <div class="slider-wrapper" v-if='banner.length'>
                    <slider class="slider_img">
                        <div v-for="(item,k) in banner" :key="k">
                            <a :href="item.url">
                            <img :src="item.imageUrl" class="needsclick" alt="aaa" srcset="" @load="onImage">                            
                            </a>
                        </div>
                    </slider> 
                </div>
                <div class="recommend-list">
                    <h1 class="list-title" @click="changStatus">热门歌单推荐</h1>
                    <ul v-show='list_1'>
                        <li v-for="(item,index) in musicList" :key='index' @click="selectItem(item)">
                            <div class="icon">
                                <img v-lazy="item.picUrl" alt="" class="list_pic" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2>{{item.name}}</h2>
                                <!-- <p>{{item.copywriter}}</p> -->
                            </div>

                        </li>
                    </ul>
                    <h1 class="list-title" @click="changStatus1">最新音乐</h1>
                    <ul v-show='list_2'>
                        <li v-for="(item,index) in newMusic" :key='index'>
                            <div class="icon">
                                <img v-lazy="item.picUrl" alt="" class="list_pic" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2>{{item.name}}</h2>
                                <!-- <p>{{item.copywriter}}</p> -->
                            </div>

                        </li>
                    </ul>
                    <h1 class="list-title" @click="changStatus2">MV推荐</h1>
                    <ul v-show='list_3' class="mv_list">
                        <li v-for="(item,index) in mvList" :key='index'>
                            <div class="icon">
                                <img v-lazy="item.picUrl" alt="" class="list_pic" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2>{{item.name}}</h2>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!musicList.length">
                <loading></loading>
            </div>

        </Scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import axios from 'axios'
import Slider from '@/base/slider'
import Scroll from '@/base/scroll'
import Loading from '@/base/loading'
import {mapMutations} from 'vuex'

export default {
    name:'Recommend',
    components: {
        Slider,
        Scroll,
        Loading
    },
    data() {
        return {
            banner: [],
            musicList: [],
            newMusic: [],
            mvList: [],
            list_1: true,
            list_2: true,
            list_3: true
        }
    },
    created(){
        this._getRecommend_banner()
        this._getRecommendNew()
        this._getRecommendMv()
        this._getRecommendList()
    },
    methods: {
        selectItem(item) {
            this.$router.push({
                path: `/recommend/${item.id}`
            })
        },
        changStatus() {
            this.list_1 = !this.list_1
        },
        changStatus1() {
            this.list_2 = !this.list_2
        },
        changStatus2() {
            this.list_3 = !this.list_3
        },
        _getRecommend_banner() {
            axios({
                url: 'http://144.34.146.225:3000/banner',
                method: 'get'
            }).then((res) => {
                if(res.status === 200) {
                    this.banner = res.data.banners
                }
            })
        },
        _getRecommendList() {
            axios({
                url: 'http://144.34.146.225:3000/personalized',
                method: 'get'
            }).then((res) => {
                if(res.status === 200){
                    this.musicList = res.data.result.slice(0,6)
                }
                console.log(this.musicList)
            })
        },
        _getRecommendNew() {
            axios({
                url: 'http://144.34.146.225:3000/album/newest',
                method: 'get'
            }).then((res) => {
                if(res.status === 200){
                    this.newMusic = res.data.albums.slice(0,6)
                }
            })
        },
        onImage() {
            if(!this.checkedLoad) {
                this.$refs.scroll.refresh()
                this.checkedLoad = true
            }
        },
        _getRecommendMv() {
            axios({
                url: 'http://144.34.146.225:3000/personalized/mv',
                method: 'get'
            }).then((res) => {
                if(res.status === 200){
                    this.mvList = res.data.result
                }
            })
        },
        // ...mapMutations({
        //     setDisc = 'SET_DISC'
        // })
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/reset.scss';
    .recommend {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 0;
        .recommend-content {
            height: 100%;
            overflow: hidden;
            .slider-wrapper {
                position: relative;
                background: #fff;
                .slider_img {
                    div a img {
                        margin: 0 auto;
                        border-radius: 5%;
                        width: 90%;
                    } 
                }
            }
            .recommend-list {
                background: #fff;
                position: relative;
                box-sizing: border-box;
                width: 90%;
                margin: 0 auto;
                text-align: center;
                .list-title {
                    color: rgb(48, 46, 43);
                    font-size: 18px;
                    font-weight: bold;
                    height: 65px;
                    line-height: 65px;
                    padding-left: 1.5%;
                    text-align: left;
                }
                ul {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    list-style: none;
                    li {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        .icon img {
                            width: 100px;
                            height: 100px;
                            border-radius: 5%; 
                        }
                        .text {
                            h2 {
                                color: rgb(10, 9, 9);
                                text-align: left;
                                font-size: 8px;
                                margin: 0 10px;

                            }
                        }
                    }
                }
                .mv_list {
                    li {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        .icon img {
                            width: 160px;
                            height: 100px;
                            border-radius: 5%; 
                        }
                        .text {
                            h2 {
                                color: rgb(10, 9, 9);
                                text-align: left;
                                margin: 0 10px;
                                font-size: 8px;
                            }
                        }
                    }
                }
            }
            .loading-container {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }

        }
    }
</style>

