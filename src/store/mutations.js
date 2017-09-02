/*
* 修改state 的唯一方法  mutation
* */


import * as types from './mutation-types'



const mutations = {
    // 方便关联 eslint会报错
    [types.SET_SINGER](state,singer){
      state.singer = singer
    }
}

export default  mutations
