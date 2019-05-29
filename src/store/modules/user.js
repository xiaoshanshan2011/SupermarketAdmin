import { login, logout, getInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          // const data = response.data
          // setToken('Bearer ' + data.token.access_token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.userphoto)
          // if (data.roleSet) {
          //   var role = []
          //   for (let k = 0; k < data.roleSet.length; k++) {
          //     var authority = data.roleSet[k].authority
          //     if (authority) {
          //       for (var i = 0; i < authority.length; i++) {
          //         role.push(authority[i].authNo)
          //       }
          //     }
          //   }
          //   if (role.length === 0) {
          //     role.push(90000)
          //   }
          //   commit('SET_ROLES', role)
          //   response.data.role = role
          //   resolve(response)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          var role = []
          if (role.length === 0) {
            role.push(90000)
          }
          commit('SET_ROLES', role)
          response.data.role = role
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    }
  }
}

export default user
