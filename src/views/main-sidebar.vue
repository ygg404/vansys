<template>
  <div>
    <div style="margin-bottom: 10px;">
      <span class="el-dropdown-link">
        <img :src="userDetail.headImg" class="head_image"  v-if="userDetail.headImg != null" />
        <img src="~@/assets/img/avatar.png" :alt="userName" class="head_image"  v-if="userDetail.headImg == null">
        <span class="head_span">{{ userName }} </span>
      </span>
    </div>
    <!--菜单内容列表内容-->
    <div class="cell_border">
      <van-cell key="home" @click="homeHandle"
                :class="menuSelectId == 0? 'cell_item_select' : 'cell_item'">
        <template slot="title">
          <icon-svg name="shouye" class="site-sidebar__menu-icon" ></icon-svg>
          <span class="custom-title">个人中心</span>
        </template>
      </van-cell>
      <sub-menu @refreshRoute="routeHandle"
        v-for="menu in menuList"
        :key="menu.menuId"
        :menu="menu"
        :dynamicMenuRoutes="dynamicMenuRoutes">
      </sub-menu>
    </div>
  </div>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'

  export default {
    data () {
      return {
        menuList: [],
        dynamicMenuRoutes: []
      }
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      let that = this
      window.addEventListener('popstate', function (e) {
        // 监听到了浏览器的返回前进按钮事件
        that.routeClickHandle(location.hash.slice(1))
      }, false)
    },
    components: {
      SubMenu
    },
    computed: {
      sysFlag: {
        get () { return this.$store.state.common.sysFlag },
        set (val) { this.$store.commit('common/updateSysFlag', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuName: {
        get () { return this.$store.state.navtab.menuName === '' ? localStorage.getItem('menuName') : this.$store.state.navtab.menuName },
        set (val) { this.$store.commit('navtab/updateMenuName', val) }
      },
      menuSelectId: {
        get () { return this.$store.state.navtab.menuSelectId === '' ? localStorage.getItem('menuSelectId') : this.$store.state.navtab.menuSelectId },
        set (val) { this.$store.commit('navtab/updateMenuSelectId', val) }
      },
      userDetail: {
        get () { return this.$store.state.user.userDetail },
        set (val) { this.$store.commit('user/updateUserDetail', val) }
      }
    },
    methods: {
      homeHandle () {
        if (this.sysFlag === 'ren') {
          this.$router.push({ name: 'home2' })
        } else {
          this.$router.push({ name: 'home' })
        }
        this.menuSelectId = 0
        this.menuName = '个人中心'
        this.$emit('refreshRoute')
      },
      // 路由跳转
      routeHandle (routerArg) {
        this.menuSelectId = routerArg.routerId
        this.menuName = routerArg.routerTitle
        this.$router.push({ name: routerArg.routerName })
        this.$emit('refreshRoute')
      },
      // 回退 前进按钮触发的路由改变
      routeClickHandle (path) {
        if (path === '/home') {
          this.menuName = '个人中心'
          this.menuSelectId = 0
          return
        } else if (path === '/home2') {
          this.menuName = '个人中心'
          this.menuSelectId = 0
          return
        }
        for (let route of this.dynamicMenuRoutes) {
          if (route.path === path.replace('/', '')) {
            this.menuName = route.meta.title
            this.menuSelectId = route.meta.menuId
            break
          }
        }
      }
    }
  }
</script>

<style lang="less">
  .cell_item {
    color: white;
    /*width: 100%;*/
    /*子项部分*/
    background: @sidebarcolor;
    z-index: 2;
  }

  .head_image {
    width: 35%;
    padding: 10px;
    border-radius: 45%;
  }
  .head_span {
    color: whitesmoke;
  }
  .cell_border{
    border-bottom: white solid 1px;
    border-top: white solid 1px;
  }
</style>
