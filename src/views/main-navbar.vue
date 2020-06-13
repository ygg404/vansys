<template>
  <div class="main-navbar">
    <van-icon name="wap-nav" size="40" color="white" style="padding: 3px;" @click="openMenuHandle"/>
    <span class="nav_span">{{menuName}}</span>
    <van-icon name="wap-home-o" size="40" color="white" style="padding: 3px;" @click="logoutHandle"/>
    <!--菜单列表-->
    <van-popup v-model="menushow" position="left" style="width: 50%;height: 100%;background-color: #19678e">
      <main-sider @refreshRoute="closeMenuHandle" />
    </van-popup>
  </div>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import MainSider from './main-sidebar'
  import MainIframe from './main-iframe'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        menushow: false,
        updatePassowrdVisible: false
      }
    },
    components: {
      UpdatePassword,
      MainSider,
      MainIframe
    },
    computed: {
      simpleName: {
        get () { return this.$store.state.common.simpleName },
        set (val) { this.$store.commit('common/updateSimpleName', val) }
      },
      sysName: {
        get () { return this.$store.state.common.sysName },
        set (val) { this.$store.commit('common/updateSysName', val) }
      },
      sysFlag: {
        get () { return this.$store.state.common.sysFlag },
        set (val) { this.$store.commit('common/updateSysFlag', val) }
      },
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      userDetail: {
        get () { return this.$store.state.user.userDetail },
        set (val) { this.$store.commit('user/updateUserDetail', val) }
      },
      menuName: {
        get () { return this.$store.state.navtab.menuName === '' ? localStorage.getItem('menuName') : this.$store.state.navtab.menuName },
        set (val) { this.$store.commit('navtab/updateMenuName', val) }
      }
    },
    created () {
      this.getSysconfigFromApi().then(success => {
        if (this.sysFlag === 'ren') this.getUserDetailFromApi()
      })
    },
    methods: {
      // 获取参数列表
      getSysconfigFromApi () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl('/sys/config/list'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (let dat of data.list) {
                switch (dat.paramKey) {
                  case 'sysName':
                    this.sysName = dat.paramValue
                    break
                  case 'sysFlag':
                    this.sysFlag = dat.paramValue
                    break
                  case 'simpleName':
                    this.simpleName = dat.paramValue
                    break
                  default:
                    break
                }
              }
            }
            resolve(data)
          })
        })
      },
      // 打开菜单
      openMenuHandle () {
        this.menushow = true
      },
      closeMenuHandle () {
        this.menushow = false
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      getUserDetailFromApi () {
        this.$http({
          url: this.$http.adornUrl(`/ren/recordtemp/info/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.userDetail = data.renRecordVo
          } else {
            this.$message.error(data.msg)
          }
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

<style>
  .main-navbar{
    width: 100%;
    background-color: #1989fa;
    min-height: 47px;
    display: flex;
    justify-content: space-between;
  }
  .nav_span{
    vertical-align: middle;
    padding:13px;
    color: white;
    font-weight: 700;
    font-size: 13pt;
  }
</style>
