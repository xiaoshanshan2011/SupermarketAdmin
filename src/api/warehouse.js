import request from '@/utils/request'

// 添加仓库
export function insertWarehouse(temp) {
  return request({
    url: '/api/admin/insertWarehouse',
    method: 'post',
    data: {
      warehousename: temp.warehousename,
      warehouseimg: temp.warehouseimg,
      warehousesn: temp.warehousesn,
      provinceid: temp.provinceid,
      cityid: temp.cityid,
      districtid: temp.districtid,
      address: temp.address,
      warehousedesc: temp.warehousedesc
    }
  })
}

// 仓库列表
export function selectWarehouse(temp) {
  return request({
    url: '/api/admin/selectWarehouse',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page,
      keyword: temp.keyword,
      provinceid: temp.provinceid,
      cityid: temp.cityid,
      districtid: temp.districtid
    }
  })
}

// 编辑仓库
export function updateWarehouse(temp) {
  return request({
    url: '/api/admin/updateWarehouse',
    method: 'post',
    data: {
      warehouseid: temp.warehouseid,
      warehousename: temp.warehousename,
      warehouseimg: temp.warehouseimg,
      warehousesn: temp.warehousesn,
      provinceid: temp.provinceid,
      cityid: temp.cityid,
      districtid: temp.districtid,
      address: temp.address,
      warehousedesc: temp.warehousedesc
    }
  })
}
// 删除仓库
export function deleteWarehouse(warehouseid) {
  return request({
    url: '/api/admin/deleteWarehouse',
    method: 'post',
    params: {
      warehouseid: warehouseid
    }
  })
}

// 查询仓库用户
export function selectWarehouseUser(temp) {
  return request({
    url: '/api/admin/selectWarehouseUser',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page,
      keyword: temp.keyword
    }
  })
}

// 添加仓库用户
export function insertWarehouseUser(temp) {
  return request({
    url: '/api/admin/insertWarehouseUser',
    method: 'post',
    params: {
      username: temp.username,
      password: temp.password,
      nickname: temp.nickname,
      mobile: temp.mobile,
      provinceid: temp.provinceid,
      cityid: temp.cityid,
      districtid: temp.districtid,
      address: temp.address,
      userphoto: temp.userphoto
    }
  })
}

// 编辑仓库用户
export function updateWarehouseUser(temp) {
  return request({
    url: '/api/admin/updateWarehouseUser',
    method: 'post',
    params: {
      userid: temp.userid,
      username: temp.username,
      password: temp.password,
      nickname: temp.nickname,
      mobile: temp.mobile,
      provinceid: temp.provinceid,
      cityid: temp.cityid,
      districtid: temp.districtid,
      address: temp.address,
      userphoto: temp.userphoto
    }
  })
}

// 删除仓库用户
export function deleteWarehouseUser(userid) {
  return request({
    url: '/api/admin/deleteWarehouseUser',
    method: 'post',
    params: {
      userid: userid
    }
  })
}

// 查询指定仓库用户
export function selectWarehouseUserRelevance(warehouseid) {
  return request({
    url: '/api/admin/selectWarehouseUserRelevance',
    method: 'get',
    params: {
      warehouseid: warehouseid
    }
  })
}

// 删除指定仓库用户
export function deleteWarehouseUserRelevance(id) {
  return request({
    url: '/api/admin/deleteWarehouseUserRelevance',
    method: 'post',
    params: {
      id: id
    }
  })
}
