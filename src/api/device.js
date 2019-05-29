import request from '@/utils/request'

export function getDeviceList(params) {
  return request({
    url: '/admin/device/list',
    method: 'get',
    params: {
      limit: params.limit,
      offset: params.page - 1,
      deviceId: params.deviceId
    }
  })
}

// 红薯机查看被绑定的店铺
export function getBindStore(id) {
  return request({
    url: '/admin/device/bind/store',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function getDeviceTypeList(params) {
  return request({
    url: '/admin/device/type/list',
    method: 'get',
    params: {
      typeName: params.typeName
    }
  })
}

export function getDeviceTypeList2() {
  return request({
    url: '/admin/device/type/list',
    method: 'get'
  })
}

export function createDeviceType(params) {
  return request({
    url: '/admin/device/add/device/type',
    method: 'put',
    data: {
      typeDescription: params.typeDescription,
      typeImageLocation: params.typeImageLocation,
      typeName: params.typeName,
      typeVideLocation: params.typeVideLocation,
      yearPrice: params.yearPrice
    }
  })
}
export function editDeviceType(params) {
  return request({
    url: '/admin/device/edit/device/type',
    method: 'post',
    data: {
      deleted: params.deleted,
      deviceTypeId: params.id,
      typeDescription: params.typeDescription,
      typeName: params.typeName,
      typeVideLocation: params.typeVideLocation,
      typeImageLocation: params.typeImageLocation,
      yearPrice: params.yearPrice
    }
  })
}

export function createDevice(params) {
  return request({
    url: '/admin/device/create',
    method: 'put',
    data: {
      deviceId: params.deviceId,
      releaseDate: params.releaseDate,
      cityCode: params.cityCode,
      deviceTypeId: params.deviceTypeId
    }
  })
}

export function editDevice(params) {
  return request({
    url: '/admin/device/edit',
    method: 'post',
    data: {
      deviceId: params.deviceId,
      releaseDate: params.releaseDate,
      cityCode: params.cityCode,
      deviceTypeId: params.deviceTypeId,
      id: params.id
    }
  })
}
