<template>
    <transition name="fade">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" class="refresh-main" :style="{ 'height': documentClientHeight + 'px' }">
        <router-view></router-view>
      </van-pull-refresh>
    </transition>
</template>

<script>
  export default {
    data() {
      return {
        isLoading: false
      }
    },
    computed: {
      documentClientHeight: {
        get() {
          return this.$store.state.common.documentClientHeight
        },
        set(val) {
          this.$store.commit('common/updateDocumentClientHeight', val)
        }
      }
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      onRefresh() {
        setTimeout(() => {
          this.isLoading = false;
          this.$router.go(0)
        }, 1000);
      }
    }
  }
</script>

<style lang="scss">
  .refresh-main{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width:100%;

  }
</style>
