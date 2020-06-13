<template>
  <div :style="'height: ' + (documentClientHeight).toString() + 'px'" class="all">
    <div class="header_span">广东杰信测绘科技有限公司</div>
    <van-swipe :autoplay="5000" class="swipe_img">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image"/>
      </van-swipe-item>
    </van-swipe>
    <div style="padding: 2px;">
      <van-grid :column-num="2" :gutter="2">
        <van-grid-item @click="gotoUrl('https://m.gdjxch.cn')" class="item_url">
          <img src="~@/assets/img/project.png" :style="'height: ' + (documentClientHeight / 12).toString() + 'px'"/>
          <div>项目管理</div>
        </van-grid-item>
        <van-grid-item @click="gotoUrl('https://mren.gdjxch.cn')" class="item_url">
          <img src="~@/assets/img/ren.png" :style="'height: ' + (documentClientHeight / 12).toString() + 'px'"/>
          <div>人事管理</div>
        </van-grid-item>
      </van-grid>
    </div>
    <div   style="font-family: initial;line-height:20px;width:95%;margin:0 auto;">
      <div style="margin-top:10%;border-top:1px dotted black;">
        <p>公司于2012年06月21日在汕头市工商行政管理局注册成立 现办公地点位于杰思信息大厦902</p>
        <p>主要经营测绘技术、计算机系统的研究、开发;仪器仪表、测绘产品及软件、计算机软硬件、电子产品、数码产品的研发、销售、维修及维护；货物进出口、技术进出口。
          我们有好的产品和专业的销售和技术团队 始终为客户提供好的产品和技术支持、健全的售后服务</p>
      </div>
    </div>
    <div class="site-bottom">
      <div style="text-align: center;">Copyright © 2020 gdjxch.cn All rights reserved.</div>
      <div style="text-align: center;"><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        images: [
          'https://www.gdjxch.cn/uploadFile/ren/img/compic1.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic2.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic3.jpg',
          'https://www.gdjxch.cn/uploadFile/ren/img/compic4.jpg'
        ]
      }
  },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      }
    },
    methods: {
      gotoUrl (url) {
        window.location.href = url
      }
    }
  }
</script>

<style scoped>
  .all{
    height:100%;
    width:100%;
  }
  .header_span{
    color: white;
    text-align: center;
    line-height: 250%;
    font-size: 14pt;
    font-weight: 700;
    background: #3b97d7;
  }
  .swipe_img{
    border: 1px solid #e6e9eb;
    height: 28%;
    width: 100%;
  }
  .swipe_img img{
    width: 100%;
    height: 100%;
    object-fit:cover;
  }
  .item_url {
    text-align: center;
    color: #3b97d7;
  }
  .item_url :active{
    color: white;
    background-color: #3b97d7;
  }
  p{
    font-size:15px;
    text-indent:2em;
    letter-spacing:1px;
  }
  p:first-child{
    padding-top:20px;
    padding-bottom:3px;
  }
  .all{
    position: relative;
  }
  .site-bottom{
    width:100%;
    transform: translate(0%,-50%);
    position: absolute;
    bottom: 30px;
    z-index: 0;
  }
</style>
