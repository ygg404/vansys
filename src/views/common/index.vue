<template>
  <div>
    <div class="header_span">广东杰信测绘科技有限公司</div>
    <van-swipe :autoplay="3000" class="swipe_img">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image"/>
      </van-swipe-item>
    </van-swipe>

      <van-grid :column-num="2" :gutter="10">
        <van-grid-item @click="gotoUrl('https://m.gdjxch.cn')" class="item_url">
          <img src="~@/assets/img/project.png" style="width: 30%"/>
          <div>项目管理</div>
        </van-grid-item>
        <van-grid-item @click="gotoUrl('https://mren.gdjxch.cn')" class="item_url">
          <img src="~@/assets/img/ren.png" style="width: 30%"/>
          <div>人事管理</div>
        </van-grid-item>
      </van-grid>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        images: [
          'https://img.yzcdn.cn/vant/apple-1.jpg',
          'https://img.yzcdn.cn/vant/apple-2.jpg',
        ],
      };
    },
    methods: {
      gotoUrl (url) {
        window.location.href = url
      }
    }
  };
</script>

<style scoped>
  .header_span{
    color: white;
    text-align: center;
    line-height: 250%;
    font-size: 14pt;
    font-weight: 700;
    background: #3b97d7;
  }
  .swipe_img{
    border: 1px solid #3b97d7;
    height: 260px;
    width: 100%;
    padding: 3px;
  }
  .swipe_img img{
    width: 100%;
    height: 100%;
    object-fit:cover;
  }
  .item_url {
    border: 1px solid #6f7180af;
    text-align: center;
  }
  .item_url :active{
    color: white;
    background-color: #3b97d7;
  }
</style>
