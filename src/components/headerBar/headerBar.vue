<template>
    <div class="container">
        <i class="iconfont icon-menu"></i>
        <div class="middle">
            <i class="iconfont icon-customerservice"></i>
            <i class="iconfont icon-cloud"></i>
            <i class="iconfont icon-video"></i>
        </div>
        <i class="iconfont icon-user"></i>
    </div>
</template>
<script>
export default {
    name:'HeaderBar'
}
</script>
<style lang="scss" scoped>
    @import '../../common/style/variable';
    @import '../../common/style/icon';
    .iconfont {
        font-size: 36px;
    }
    .container {
        display: flex;
        position: relative;
        width: 100%;
        height: 44px;
        background: $color-theme;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
    }
</style>


