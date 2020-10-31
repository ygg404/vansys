<template>
  <div>
    <div></div>
    <van-cell  :key="menu.menuId"  border @click="gotoRouteHandle(menu)"  :class="menuSelectId == menu.menuId? 'cell_item_select ' : 'cell_item '"
               :is-link="menu.list && menu.list.length >= 1" :arrow-direction="listShow?'down':''">
      <template slot="title">
        <icon-svg :name="menu.icon" class="site-sidebar__menu-icon" ></icon-svg>
        <span class="custom-title">{{menu.name}}</span>
      </template>
    </van-cell>
    <div>
      <div v-for="subitem in menu.list" :class="listShow?'slidown ':'slidup ' ">
        <van-cell  :key="subitem.menuId"  border @click="gotoRouteHandle(subitem)"
            :class="menuSelectId == subitem.menuId? 'cell_item_select' : 'cell_item_sub'">
          <template slot="title">
            <icon-svg :name="subitem.icon" class="site-sidebar__menu-icon" ></icon-svg>
            <span class="custom-title">{{subitem.name}}</span>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  export default {
    name: 'sub-menu',
    data () {
      return {
        listShow: false
      }
    },
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      menuSelectId: {
        get () { return this.$store.state.navtab.menuSelectId === '' ? localStorage.getItem('menuSelectId') : this.$store.state.navtab.menuSelectId},
        set (val) { this.$store.commit('navtab/updateMenuSelectId', val) }
      }
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.menuSelectId = route[0].meta.menuId
          this.$router.push({ name: route[0].name })
          this.$emit('refreshRoute', {routerName: route[0].name, routerId: route[0].meta.menuId, routerTitle: route[0].meta.title})
        } else {
          this.listShow = !(this.listShow)
        }
      }
    }
  }
</script>

<style lang="less">
  .cell_item {
    /*color: white;*/
    width: 100%;
    /*子项部分*/
    background: @sidebarcolor;
    z-index: 2;
  }

  .cell_item_select{
    /*color: white;*/
    width: 100%;
    /*被选中部分*/
    background: @cell_item_select_color;
    z-index: 1;
  }

  .cell_item_sub{
    color: white;
    width: 100%;
    /*选项部分*/
    background: @cell_item_sub_color;
    z-index: 1;
  }

  /* 下拉动画 */
  /* @keyframes Css3 新标签，循环动画 */
  @keyframes slidown{
    from{
      transform:  translateY(-100%);
    }
    to{
      transform:  translateY(0%);
    }
  }
  .slidown{
    display: block;
    animation: slidown .2s ease-in both;
  }

  /* 上拉动画 */
  @keyframes slidup{
    from{
      transform:  translateY(0%);
    }
    to{
      transform:  translateY(-100%);
    }
  }
  .slidup{
    display: none;
    animation: slidup .2s ease-in both;
    height: 0px;
  }
</style>
