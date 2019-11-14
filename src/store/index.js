import Vuex from 'vuex'
import Vue from 'vue'
import homeStore from './potral/home-store'
import customization from './modules/customization'

Vue.use(Vuex)

export default new Vuex.Store({
  // 状态数据按模块分类引入
  modules: {
    homeStore,
    customization
  }
})
