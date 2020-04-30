<template>
  <div class="site-main"   :style="{ 'height': documentClientHeight + 'px' }">
      <div style="height: 100px;"></div>
      <div class="site-content">
        <img width="100%" style="padding: 10px;" src="../../assets/img/logo.png"></img>
        <vantForm ref="dataForm" :rules="dataRule" inputVail="true">
          <template slot="items">
            <van-field left-icon="contact" error-message="用户名不为空"  rule="userAccount" label="用户名" placeholder="请输入用户名"  v-model="dataForm.userAccount"/>
            <van-field left-icon="closed-eye" error-message="密码不为空"  rule="password" type="password" label="密码" placeholder="请输入密码" v-model="dataForm.password" />
          </template>
        </vantForm>
        <van-button :loading="loading" loading-text="登录中..." type="info"  style="width: 100%;" @click="dataFormSubmit()">登录</van-button>
      </div>
      <div class="site-bottom">
        <div>Copyright © 2020 gdjxch.cn All rights reserved.</div>
        <div><a href="http://www.beian.miit.gov.cn">粤ICP备19096985号</a></div>
      </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'

  export default {
    data () {
      return {
        loading: false,
        isLoading: false,
        dataForm: {
          userAccount: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          'userAccount':
            { required: true, message: '帐号不能为空', trigger: 'blur' },
          'password':
            { required: true, message: '密码不能为空', trigger: 'blur' }
        },
        captchaPath: ''
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
      },
      menuName: {
        get () { return this.$store.state.navtab.menuName },
        set (val) { this.$store.commit('navtab/updateMenuName', val) }
      },
      menuSelectId: {
        get () { return localStorage.getItem('menuSelectId') },
        set (val) { this.$store.commit('navtab/updateMenuSelectId', val) }
      }
    },
    mounted () {
      this.resetDocumentClientHeight()
      this.dataForm.userAccount = this.$cookie.get('jxaccount')
      this.dataForm.password = this.$cookie.get('jxpwd')
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 提交表单
      dataFormSubmit () {
        if (this.$refs['dataForm'].allVail()) {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/sys/login'),
            method: 'post',
            data: this.$http.adornData({
              'useraccount': this.dataForm.userAccount,
              'password': this.dataForm.password,
              'uuid': this.dataForm.uuid,
              'captcha': this.dataForm.captcha
            })
          }).then(({data}) => {
            this.loading = false
            if (data && data.code === 0) {
              this.$cookie.set('token', data.token)
              this.$cookie.set('jxaccount' , this.dataForm.userAccount)
              this.$cookie.set('jxpwd' , this.dataForm.password)
              this.$cookie.set('jxrole', '') // 项目管理默认角色为空
              this.$cookie.set('jxstartDate', '') // 选择时间（起始时间）
              this.$cookie.set('jxendDate', '') // 选择时间（结束时间）
              // 登录成功首页进入个人中心
              this.$router.replace({ name: 'home' })
              this.menuName = '个人中心'
              this.menuSelectId = 0
            } else {
              this.getCaptcha()
              this.$notify({ type: 'danger', message: data.msg })
            }
          })
        }
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      }
    }
  }
</script>

<style lang="scss">
  .site-main{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width:100%;
    background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      background-color: #0BB2D4;
      background-size:100% 100%;
      -moz-background-size:100% 100%;
      background-repeat:no-repeat;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content{
      width: 90%;
      margin-left: 5%;
      z-index: 1;
      background-color: whitesmoke;
      padding: 10px;
      border-radius: 6px;
    }

    .site-bottom{
      margin-left: 50%;
      transform: translate(-50%,-50%);
      position: absolute;
      text-align: center;
      color: white;
      font-size: 10pt;
      font-weight: 500;
      width: 470px;
      bottom: 0;
      margin-bottom: 10px;
      z-index: 0;
    }
    .site-bottom a{
      color: white
    }
  }
</style>
