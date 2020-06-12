<template>
  <div>
    <div  style="text-align: center">
      <img src="~@/assets/img/avatar.png"  style="height:150px;"/>
      <van-row class="span_row">
        <van-col span="10" class="span_row_attr">账号：</van-col>
        <van-col span="12" offset="2" class="span_row_value">{{userDetail.useraccount}}</van-col>
      </van-row>
      <van-row class="span_row">
        <van-col span="10" class="span_row_attr">姓名：</van-col>
        <van-col span="12" offset="2" class="span_row_value">{{userDetail.username}}</van-col>
      </van-row>
      <van-row class="span_row">
        <van-col span="10" class="span_row_attr">角色：</van-col>
        <van-col span="12" offset="2" class="span_row_value">
          <van-tag v-for="(item,index) in userDetail.roleList" :key="index" type="primary" size="medium" style="margin-right:3px;">{{item}}</van-tag>
        </van-col>
      </van-row>
      <van-row class="span_row">
        <van-col span="10" class="span_row_attr">工作组：</van-col>
        <van-col span="12" offset="2" class="span_row_value">
          <van-tag v-for="(item,index) in userDetail.groupList" :key="index" type="primary" size="medium" style="margin-right:3px;">{{item}}</van-tag>
        </van-col>
      </van-row>
    </div>
    <div class="bottom_btn">
      <van-button icon="setting-o" type="info"  @click="updatePasswordHandle">修改密码</van-button>
      <van-button icon="wap-home-o" type="danger" @click="logoutHandle">退出</van-button>
    </div>
    <!-- 弹窗, 修改密码 -->
<!--    <van-dialog v-model="updatePassowrdVisible" title="修改密码" show-cancel-button bind:close="updatePassowrdVisible=false">-->
<!--      <div>dddd</div>-->
<!--    </van-dialog>-->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </div>
</template>

<script>
  import UpdatePassword from '../main-navbar-update-password'
  import momnet from 'moment'
  import { clearLoginInfo } from '@/utils'

  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        userDetail: '',
        loadTime: momnet(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    components: {
      UpdatePassword
    },
    created () {
      this.getUserDetailFromApi()
    },
    methods: {
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl('/sys/userdetail/info'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userDetail = data.userDetailVo
          } else {

          }
        })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$dialog.confirm({
          title: '提示',
          message: '确定进行[退出]操作?'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style scoped>
  .mod_content{
    text-align: center;
    border-bottom: 2px solid #a9b7bb5f;
    padding: 5px;
  }
  .span_row{
    font-size: 12pt;
    font-weight: 500;
  }
  .span_row_attr{
    text-align: right;
    font-weight: bold;
  }
  .span_row_value{
    text-align: left;
    color: #3787ee;
  }
  .bottom_btn{
    padding: 10px;
    width: 100%;
    text-align: center;
  }
</style>

