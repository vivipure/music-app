<template>
    <transition name="slide">
        <music-list></music-list>
    </transition>
</template>

<script>
import MusicList from '@/base/musicList'
export default {
    components: {
        MusicList
    }
}
</script>

<style lang="scss" scoped>
    .slide-enter-active,.slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%,0,0)
    }
</style>

