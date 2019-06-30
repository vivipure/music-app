<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress">
            </div>
            <div class="progress-btn-wrapper"
                 ref="progressBtn" 
                 @touchstart.prevent="progressTouchStart" 
                 @touchend.prevent="progressTouchEnd" 
                 @touchmove.prevent="progressTouchMove">
                <div class="progress-btn"></div>
            </div>

        </div>
    </div>
</template>

<script>
const progressBtnWidth = 8
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    watch: {
        percent(newPercent) {
            if(newPercent > 0 && !this.touch.initialed) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this._offset(offsetWidth)
            }
        }
    },
    created() {
        this.touch = {}
    },
    methods: {
        progressTouchStart(e) {
            this.touch.initialed = true
            this.touch.startX = e.touches[0].pageX
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove(e) {
            if(!this.touch.initialed) {
                return
            }
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,(Math.max(0,this.touch.left+deltaX)))
            this._offset(offsetWidth)

        },
        progressTouchEnd() {
            this.touch.initialed = false
            this.triggerPer()
        },
        progressClick(e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            this.triggerPer()
        },
        _offset(offsetWidth) {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
        },
        triggerPer() {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('percentChange',percent)
        }
    }
}
</script>

<style lang="scss" scoped>
    .progress-bar {
        height: 30px;
        .bar-inner {
            position: relative;
            top: 13px;
            height: 4px;
            background: #000;
            .progress {
                position: absolute;
                height: 100%;
                background: #fff;
            }
            .progress-btn-wrapper {
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                .progress-btn {
                    position: relative;
                    top: 7px;
                    left: 7px;
                    box-sizing: border-box;
                    width: 16px;
                    height: 16px;
                    border: 3px solid red;
                    border-radius: 50%;
                    background: #ccc;
                }
            }
        }
    }
</style>
