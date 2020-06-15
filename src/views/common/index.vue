<template>
  <div :style="{ 'min-height': documentClientHeight + 'px' }" class="all">
    <div class="header_span">广东杰信测绘科技有限公司</div>
    <van-swipe :autoplay="5000" class="swipe_img">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image"/>
      </van-swipe-item>
    </van-swipe>
    <div  class="about">
      <div class="header">功能</div>
      <van-grid :column-num="2" :gutter="15" style="padding: 12px;">
        <van-grid-item @click="gotoUrl('https://m.gdjxch.cn/#/login')" class="item_url">
          <img src="~@/assets/img/project.png" :style="'height: ' + (documentClientHeight / 14).toString() + 'px'"/>
          <div>项目管理</div>
        </van-grid-item>
        <van-grid-item @click="gotoUrl('https://mren.gdjxch.cn/#/login')" class="item_url">
          <img src="~@/assets/img/ren.png" :style="'height: ' + (documentClientHeight / 12).toString() + 'px'"/>
          <div>人事管理</div>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="about">
      <div class="header">关于杰信</div>
      <div>
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
        indexUrl: window.SITE_CONFIG['indexUrl'],
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
  .item_url .van-grid-item__content {
    background-color: #6f7180;
  }
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
    height: 200px;
    width: 100%;
  }
  .swipe_img img{
    width: 100%;
    height: 100%;
    object-fit:cover;
  }
  .item_url {
    width: 30%;
    max-width: 220px;
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
    position: fixed;
    width:100%;
    bottom: 0px;
    z-index: 0;
    background-color: #a9b7bb;
    color: whitesmoke;
    padding: 1px;
  }
  .site-bottom a{
    color: whitesmoke;
  }
  .about {
    font-family: initial;
    width:95%;
    margin-top: 10px;
    margin-left: 2.5%;
  }
  .about p{
    color: #6f7180;
  }
  .about .header{
    font-size: 14pt;
    font-weight: 700;
    border-bottom: 1px solid #6f7180;
  }
</style>
