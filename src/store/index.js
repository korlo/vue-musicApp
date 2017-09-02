import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import * as state from './state'
import createLogger from 'vuex/dist/logger'


Vue.use(Vuex)

//调试工具 检测vuex状态修改
const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
  getters,
  actions,
  mutations,
  state,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
