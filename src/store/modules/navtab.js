export default {
  namespaced: true,
  state: {
    // 选中的menuId
    menuSelectId: '',
    // 菜单名称
    menuName: ''
  },
  mutations: {
    updateMenuSelectId (state, menuSelectId) {
      localStorage.setItem('menuSelectId', menuSelectId)
      state.menuSelectId = menuSelectId
    },
    updateMenuName (state, menuName) {
      localStorage.setItem('menuName', menuName)
      state.menuName = menuName
    }
  }
}
