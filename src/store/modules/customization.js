// 首页定制化、主题(缓存的目的：方便后续实现预览效果)
export default {
  state: {
    //模块所在目录
    componentsDir: 'home',

    //内部模块数据
    componentsData: '',

    //主题名称
    theme: 'light'

  },
  mutations: {
    //设置内部模块
    setComponent(state, data) {
      state.componentsData = data.componentsData;
      state.componentsDir = data.componentsDir;
    },
    //设置主题
    setTheme(state, data) {
      state.theme = data;
    },

  },

  actions: {
    // setComponent(context, data = []) {
    //   context.commit('setComponenet', data);
    // }
  }


}
