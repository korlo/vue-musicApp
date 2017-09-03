/*
* 修改state 的唯一方法  mutation
* */


import * as types from './mutation-types'

const mutations = {

  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations

