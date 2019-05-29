import request from '@/utils/request'

// 编辑租凭红薯机的订单
export function editMachine(temp) {
  return request({
    url: '/admin/order/machine/edit',
    method: 'post',
    data: {
      deviceOrderId: temp.deviceOrderId,
      handStatus: temp.handStatus
    }
  })
}

// 租凭红薯机订单列表
export function getMachineList(temp) {
  return request({
    url: '/admin/order/machine/list',
    method: 'get',
    params: {
      limit: temp.limit,
      offset: temp.offset - 1,
      orderNumber: temp.orderNumber,
      storeName: temp.storeName,
      deviceTypeName: temp.deviceTypeName,
      appUserId: temp.appUserId,
      handStatus: temp.handStatus
    }
  })
}

// 订单评价列表
export function getAppraisesList(temp) {
  return request({
    url: '/admin/order/appraises/list',
    method: 'get',
    params: {
      size: temp.limit,
      page: temp.page - 1,
      tasteScore: temp.tasteScore,
      keyword: temp.keyword
    }
  })
}

// 红薯机售卖订单列表
export function getPotatoList(temp) {
  return request({
    url: '/admin/order/potato/list',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page - 1,
      status: temp.status,
      appUserId: temp.appUserId,
      keyword: temp.keyword
    }
  })
}

// 采购订单列表
export function getPurchaseOrderList(temp) {
  return request({
    url: '/admin/order/procurement/lsit',
    method: 'get',
    params: {
      size: temp.limit,
      page: temp.page - 1,
      orderType: temp.orderType,
      keyword: temp.keyword
    }
  })
}

// 编辑采购订单
export function editPurchaseOrder(temp) {
  return request({
    url: '/admin/order/procurement/edit',
    method: 'post',
    data: {
      id: temp.id,
      handlerStatus: temp.handlerStatus,
      orderStatus: temp.orderStatus
    }
  })
}
// 编辑商城订单
export function storeOrderEdit(temp) {
  return request({
    url: '/admin/order/shop/order/edit',
    method: 'post',
    data: {
      id: temp.id,
      orderStatus: temp.orderStatus
    }
  })
}
// 商城订单列表
export function storeOrderList(temp) {
  return request({
    url: '/admin/order/shop/order/list',
    method: 'get',
    params: {
      page: temp.page - 1,
      size: temp.limit,
      keyword: temp.keyword,
      orderType: temp.orderType,
      orderStatus: temp.orderStatus
    }
  })
}
