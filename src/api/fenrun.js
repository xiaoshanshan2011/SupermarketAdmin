import request from '@/utils/request'

// 添加设置区域价格及分润
export function setFenrun(temp) {
  return request({
    url: '/admin/price/add/set',
    method: 'put',
    data: {
      cityId: temp.cityId,
      cost: temp.cost,
      deviceTypeId: temp.deviceTypeId,
      district: temp.district,
      franchisee: temp.franchisee,
      fund: temp.fund,
      merchant: temp.merchant,
      name: temp.name,
      placeBenefit: temp.placeBenefit,
      price: temp.price,
      profit: temp.profit,
      province: temp.province,
      discounts: temp.discounts,
      stateBenefit: temp.stateBenefit,
      town: temp.town,
      waiter: temp.waiter
    }
  })
}

// 价格及分润列表
export function getFenrunList(temp) {
  return request({
    url: '/admin/price/list',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page - 1,
      cityId: temp.cityId,
      deviceId: temp.deviceId,
      deviceTypeId: temp.deviceTypeId,
      fenrunType: temp.fenrunType, // 0查城市区域分润， 1设备分润
      deviceTypeName: temp.deviceTypeName,
      mergerName: temp.mergerName
    }
  })
}

// 修改设置区域价格及分润
export function editFenrun(temp) {
  return request({
    url: '/admin/price/edit/set',
    method: 'post',
    data: {
      id: temp.id,
      cost: temp.cost,
      district: temp.district,
      franchisee: temp.franchisee,
      fund: temp.fund,
      merchant: temp.merchant,
      name: temp.name,
      placeBenefit: temp.placeBenefit,
      price: temp.price,
      profit: temp.profit,
      discounts: temp.discounts,
      province: temp.province,
      stateBenefit: temp.stateBenefit,
      town: temp.town,
      waiter: temp.waiter
    }
  })
}

// 设备申请售价列表
export function applyList(temp) {
  return request({
    url: '/admin/price/device/price/apply/list',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page - 1
    }
  })
}

// 编辑设备申请售价
export function applyEdit(temp) {
  return request({
    url: '/admin/price/device/price/apply/edit',
    method: 'post',
    data: {
      cost: temp.cost,
      discounts: temp.discounts,
      district: temp.district,
      franchisee: temp.franchisee,
      fund: temp.fund,
      id: temp.id,
      merchant: temp.merchant,
      name: temp.name,
      placeBenefit: temp.placeBenefit,
      profit: temp.profit,
      province: temp.province,
      reason: temp.reason,
      stateBenefit: temp.stateBenefit,
      town: temp.town,
      status: temp.status,
      waiter: temp.waiter
    }
  })
}
