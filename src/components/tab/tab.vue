<template>
    <div class="tab">
            <router-link tag="div" class="tab-item" to='/recommend'>
                <span class="tab-link">推荐</span>
            </router-link>
            <router-link tag="div" class="tab-item" to='/singer'>
                <span class="tab-link">歌手</span>
            </router-link>
            <router-link tag="div" class="tab-item" to='/rank'>
                <span class="tab-link">排行</span>
            </router-link>
            <router-link tag="div" class="tab-item" to='/search'>
                <span class="tab-link">搜索</span>
            </router-link>
    </div>
</template>
<script>
export default {
    name: 'Tab'
}
</script>
<style lang="scss" scoped>
    @import '../../common/style/variable';
    .tab {
        display: flex;
        height: 44px;
        line-height: 44px;
        font-size: $font-size-medium;
        background: #fff;
        .tab-item {
            cursor: pointer;
            flex: 1;
            text-align: center;
            &.router-link-active {
                    .tab-link {
                        font-weight: bold;
                        border-bottom: 2px solid $color-sub-theme;
                    }
                 }
            .tab-link {
                // background: red;
                // border-radius: 20px; 
                padding-bottom: 5px;
                color: #111;

            }
        }
    }
</style>

