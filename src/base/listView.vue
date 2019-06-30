<template>
    <scroll class="listview" 
            :data='data'
            ref="listview" 
            :listenScroll='listenScroll' 
            @scroll="scroll"
            :probeType='probe'>
        <ul>
            <li v-for="i in data" :key='i.id' class="listgroup" ref="listgroup">
                <h2>{{i.title}}</h2>
                <ul>
                    <li v-for="item in i.items" :key='item.id' @click="selectItem(item)">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="shortcutList" @touchstart="onShortcutTouchStart" @touchmove='onShortcutMove'>
            <ul>
                <li v-for="(item,index) in shortcutList"
                    :key="item.id" class="item" 
                    :data-index="index" 
                    :class="{'current': currentIndex === index}"
                    >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="listfixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixedTitle">{{fixedTitle}}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
                <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from "@/base/scroll"
import {getData} from "common/js/dom"
import Loading from '@/base/loading'

const ANCHOR_HEIGHT = 20
export default {
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0,
            diff: -1
        }
    },
    created() {
        this.touch = {}
        this.listenScroll = true
        this.listHeight = []
        this.probe = 3
    },
    components: {
        Scroll,
        Loading
    },
    computed: {
        shortcutList() {
            return this.data.map((group) => {
                return group.title.substr(0,1)
            })
        },
        fixedTitle () {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    methods: {
        selectItem(item) {
            this.$emit('select',item)
        },
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        onShortcutMove(e) {
            let firshTouch = e.touches[0]
            this.touch.y2 = firshTouch.pageY
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scrollTo(anchorIndex)
        },
        _scrollTo(index) {
            if (!index && index !== 0) {
                return
            }
            if (index < 0) {
                index = 0
            } else if (index > this.listHeight.length - 2) {
                index = this.listHeight.length - 2
            }
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
        },
        scroll(pos) {
            this.scrollY = pos.y
        },
        _calculateHeight() {
            this.listHeight = []
            const list = this.$refs.listgroup
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        scrollY(newY) {
            const listHeight = this.listHeight
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                this.currentIndex = i
                this.diff = height2 + newY
                return
                }
            }
            this.currentIndex = listHeight.length - 2

        },
        diff(newV) {
            let fixedTop = (newV > 0 && newV < ANCHOR_HEIGHT) ? newV - ANCHOR_HEIGHT : 0
            if(this.fixedTop === fixedTop) {
                return
            }
            // console.log(fixedTop)
            this.fixedTop = fixedTop
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    }
}
</script>

<style lang="scss" scoped>
    .listview {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 0;
        overflow: hidden;
        ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            width: 100%;
            margin: 0;
            padding: 0;
            .listgroup {
                width: 100%;
                h2 {
                    margin: 0;
                    height: 20px;
                    line-height: 20px;
                    background: #d9dadb;
                    font-size: 14px;
                }
                ul {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    li {
                        display: flex;
                        flex-direction: row;
                        img {
                            width: 50px;
                            height: 50px;
                            border-radius: 5%; 
                        }
                        span {
                          margin: 20px;
                        }
                    }
                }
            }
        }
        .shortcutList {
            position: absolute;
            right: 3px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            padding: 200px 0;
            border-radius: 3px;
            text-align: center;
            z-index: 99;
            .item {
                padding: 5px;
                line-height: 1;
                color: #111;
                font-weight: bold;
                font-size: 11px;
                &.current {
                    color: orange;
                }
            }
        }
        .listfixed {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            .fixedTitle {
                margin: 0;
                height: 20px;
                line-height: 20px;
                background: #d9dadb;
                font-size: 14px;
            }
        }
        .loading-container {
            position: absolute;
            top: 50%;
            width: 100%;
            transform: translateY(-50%);
        }
    }
</style>

