<template>
    <div class="singer">
        <list-view :data='singers' @select='selectSinger'></list-view>
        <router-view></router-view>
    </div>
</template>
<script>
import axios from 'axios'
import pinyin from 'pinyin'
import Singer from 'common/js/singer'
import ListView from '@/base/listView'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGERS = 10
export default {
    data() {
        return {
            singers: [],
        }
    },
    created() {
        this._getSingers()
    },
    components: {
        ListView
    },
    methods: {
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingers() {
            axios({
                url: 'http://144.34.146.225:3000/top/artists?limit=50',
                type: 'get'
            }).then((res) => {
                if (res.status === 200) {
                    let s = res.data.artists
                    s.map((item) => {
                        let py = pinyin(item.name[0],{
                            style: pinyin.STYLE_FIRST_LETTER
                        })
                        item.initial = py[0][0].toUpperCase()
                    })
                    this.singers = this._normalizeSinger(s)
                }
            })
        },
        // 将得到的Singer处理成 想要的格式
         _normalizeSinger (list) {
            let map = {
                hot: {
                title: HOT_NAME,
                items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGERS) {
                //  10 位数 热门歌手
                map.hot.items.push(new Singer({
                    id: item.id,
                    name: item.name,
                    avatar: item.img1v1Url,
                    aliaName: item.alias.join(' / ')
                }))
                }

                const key = item.initial
                if (!map[key]) {
                map[key] = {
                    title: key,
                    items: []
                }
                }
                // 字母 排列
                map[key].items.push(new Singer({
                id: item.id,
                name: item.name,
                avatar: item.img1v1Url,
                aliaName: item.alias[0]
                }))
            })
            // 存入 字母 和 热门 数组  
            let hot = []
            let ret = []
            for (const key in map) {
                let val = map[key]
                if (val.title.match(/[A-Z]/)) {
                ret.push(val)
                } else if (val.title === HOT_NAME) {
                hot.push(val)
                }
            }
            //   对字母进行排序
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
  }
}

</script>
<style lang="scss" scoped>
    .singer {
        position: fixed;
        top: 88px;
        bottom: 0;
        width: 100%;
    }
</style>

