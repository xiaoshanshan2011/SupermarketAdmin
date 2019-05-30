import request from '@/utils/request'

// 查询库存列表
export function getInventoryList(temp) {
  return request({
    url: '/admin/inventory/list',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page,
      inventoryType: temp.inventoryType,
      keyword: temp.keyword
    }
  })
}

// 编辑库存
export function editInventory(temp) {
  return request({
    url: '/admin/inventory/edit',
    method: 'post',
    data: {
      deleted: temp.deleted,
      id: temp.id,
      number: temp.number
    }
  })
}

// 添加库存
export function addInventory(temp) {
  return request({
    url: '/admin/inventory/add',
    method: 'put',
    data: {
      goodsId: temp.goodsId,
      inventoryType: temp.inventoryType,
      number: temp.number,
      storeId: temp.storeId
    }
  })
}
