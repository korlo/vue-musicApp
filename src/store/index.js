import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'

//这里有一个坑
// 如果把 mutations 改成 * as mutations 会一直报错 unknow mutations type
// 这个巨坑啊 为什么上面的 action 和getter 就可以用 * 表示?
//  可能是因为export dafult 是只能输入一个 所以只能是 mutations 不能是 *
import mutations from './mutations'
import state from './state'

//引入调试打印的工具
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
