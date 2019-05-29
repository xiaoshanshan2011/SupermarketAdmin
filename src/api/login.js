import request from '@/utils/request'

// 登录
export function login(requestBody) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    params: { username: requestBody.username, password: requestBody.newPassword }
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/api/admin/getUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/admin/logout',
    method: 'post'
  })
}
