import request from '@/utils/request'

export function getStoreList(temp) {
  return request({
    url: '/admin/store/list',
    method: 'get',
    params: {
      storeType: temp.select,
      storeName: temp.storeName,
      contactsTel: temp.contactsTel,
      limit: temp.limit,
      page: temp.page,
      audit: temp.audit,
      appUserId: temp.appUserId
    }
  })
}

// 查看加盟店
export function getStoreList2(temp) {
  return request({
    url: '/admin/store/list',
    method: 'get',
    params: {
      cityId: temp.cityId,
      storeType: temp.storeType
    }
  })
}

export function createStore(temp) {
  return request({
    url: '/admin/store/create',
    method: 'put',
    data: {
      cityCode: temp.cityCode,
      storeImage: temp.storeImage,
      storeLink: temp.storeLink,
      storeLocation: temp.storeLocation,
      storeName: temp.storeName,
      storeType: temp.storeType,
      allianceStoreId: temp.allianceStoreId,
      storeOwnerId: temp.appUserdatas.id
    }
  })
}

export function editStore(temp) {
  return request({
    url: '/admin/store/edit',
    method: 'post',
    data: {
      storeId: temp.storeId,
      storeImage: temp.storeImage,
      storeLink: temp.storeLink,
      storeLocation: temp.storeLocation,
      storeName: temp.storeName,
      storeType: temp.storeType,
      allianceStoreId: temp.allianceStoreId,
      cityCode: temp.cityCode,
      audit: temp.audit,
      reason: temp.reason, // 审核原因(审核店铺时必传)
      potatoMachineId: temp.potatoMachineId
    }
  })
}

export function getCity(temp) {
  return request({
    url: '/adim/city/list',
    method: 'get',
    params: {
      parentId: temp.parentId,
      levelType: temp.levelType
    }
  })
}

export function getAppUser(temp) {
  return request({
    url: '/admin/agent/query/tel',
    method: 'get',
    params: {
      tel: temp.contactsTel,
      time: new Date().getTime()
    }
  })
}
// 店铺详细信息
export function getStoreDetails(id) {
  return request({
    url: '/admin/store/details',
    method: 'get',
    params: {
      id: id
    }
  })
}
// 获取店铺分润配置
export function getFenrunRule(storeId) {
  return request({
    url: '/admin/store/fenrun/rule',
    method: 'get',
    params: {
      storeId: storeId
    }
  })
}
// 编辑一个分润人分润规则
export function editFenrunPerso(temp) {
  return request({
    url: '/admin/store/edit/fenrun/perso',
    method: 'post',
    data: {
      alias: temp.alias,
      deleted: temp.deleted,
      personFenrunId: temp.personFenrunId,
      personId: temp.personId,
      ratio: temp.ratio,
      storeId: temp.storeId
    }
  })
}
// 添加一个分润人
export function addFenrunPerson(temp) {
  return request({
    url: '/admin/store/add/fenrun/person',
    method: 'put',
    data: {
      alias: temp.alias,
      personId: temp.personId,
      ratio: temp.ratio,
      storeId: temp.storeId
    }
  })
}
