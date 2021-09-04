import { createStore } from 'vuex'

export default createStore({
  state: {
    hasLogin:false,
    userInfo:{},//用户信息
  },
  mutations: {
    login(state,palyload){
      state.hasLogin = true
      state.userInfo = palyload
    },
    logout(state,palyload){
      state.hasLogin = false
      state.userInfo = {}
    },
    SetUserInfo(state,palyload){
      state.userInfo = palyload
    }
  },
  actions: {
  },
  modules: {},
})
