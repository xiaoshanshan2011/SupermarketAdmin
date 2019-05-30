import request from '@/utils/request'

// 商品列表
export function frUserList(temp) {
  return request({
    url: '/admin/vip/app/user/list',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page,
      keyword: temp.keyword
    }
  })
}

// 分润端会员编辑
export function editFrUser(temp) {
  return request({
    url: '/admin/vip/app/user/edit',
    method: 'post',
    data: {
      id: temp.id,
      enable: temp.enable // 启用/禁用 0:启用, 1:禁用
    }
  })
}

// 小程序会员列表
export function wxUserList(temp) {
  return request({
    url: '/admin/vip/applet/user/list',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page,
      keyword: temp.keyword
    }
  })
}

// 小程序会员编辑
export function editWxUser(temp) {
  return request({
    url: '/admin/vip/applet/user/edit',
    method: 'post',
    data: {
      id: temp.id,
      enable: temp.enable // 启用/禁用 0:启用, 1:禁用
    }
  })
}
