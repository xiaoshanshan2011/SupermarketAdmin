import request from '@/utils/request'

// 区域统计
export function areaStatistics(cityId) {
  return request({
    url: '/admin/home/area/statistics',
    method: 'get',
    params: {
      cityId: cityId
    }
  })
}

// 新增会员统计
export function newUser(startTime, stopTime) {
  return request({
    url: '/admin/home/count/new/user',
    method: 'get',
    params: {
      startTime: startTime,
      stopTime: stopTime
    }
  })
}

// 资产统计
export function moneyStatistics(startTime, stopTime) {
  return request({
    url: '/admin/home/statistics/asset',
    method: 'get',
    params: {
      startTime: startTime,
      stopTime: stopTime
    }
  })
}

// 统计用户数量
export function userCount() {
  return request({
    url: '/admin/home/user/count',
    method: 'get',
    params: {
    }
  })
}
