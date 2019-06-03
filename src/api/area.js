import request from '@/utils/request'

// 获取省市区
export function findArea(parentId) {
  return request({
    url: '/api/admin/findArea',
    method: 'get',
    params: {
      parentId: parentId
    }
  })
}
