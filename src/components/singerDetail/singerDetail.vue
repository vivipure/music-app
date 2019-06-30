<template>
    <transition name="slide">
        <div class="singer-detail">
           <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
        </div>
    </transition>

</template>

<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
import MusicList from '@/base/musicList'
import {createSong} from 'common/js/song'
export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        ...mapGetters(
            ['singer']
        ),
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.avatar
        }
    },
    created() {
        this._getDetail()
    },
    methods: {
        _getDetail() {
            //  判断是否传入id  以及刷新时进行返回
            if(!this.singer.id) {
                this.$router.push('/singer')
                return 
            }
            axios.get(`http://144.34.146.225:3000/artists?id=${this.singer.id}`).then((res) => {
                if(res.status === 200) {
                    let song = res.data.hotSongs
                    this.songs = this._normalizeSong(song)
                } 
            })
            // console.log(this.singer)
        },
        _normalizeSong(list) {
            let ret = []
            list.forEach((item) => {
                ret.push(createSong(item))
            })
            return ret   
        }
        
    },
    components: {
        MusicList
    }
}
</script>

<style lang="scss" scoped>
    .singer-detail {
        position: fixed;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #F2F3F4;
    }
    .slide-enter-active,.slide-leave-active {
        transition: all .3s;
    }
    .slide-enter,.slide-leave-to {
        transform: translate3d(100%,0,0);
        opacity: 0;
    }
</style>

