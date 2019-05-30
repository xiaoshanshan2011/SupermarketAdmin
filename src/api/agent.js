import request from '@/utils/request'

export function getAgentList(temp) {
  return request({
    url: '/admin/agent/list',
    method: 'get',
    params: {
      agentType: temp.select,
      agentName: temp.companyName,
      agentTel: temp.companyTel,
      limit: temp.limit,
      page: temp.page
    }
  })
}

export function getAgentList2(agentTel) {
  return request({
    url: '/admin/agent/list',
    method: 'get',
    params: {
      agentTel: agentTel
    }
  })
}

export function createAgent(temp) {
  return request({
    url: '/admin/agent/create',
    method: 'put',
    data: {
      appuserId: temp.appUserdatas.id,
      cityCode: temp.cityCode,
      companyName: temp.appUserdatas.name,
      companyTel: temp.appUserdatas.tel,
      location: temp.location
    }
  })
}

export function editAgent(temp) {
  return request({
    url: '/admin/agent/edit',
    method: 'post',
    data: {
      agentId: temp.agentId,
      appuserId: temp.appUserdatas.id,
      cityCode: temp.parentId,
      companyName: temp.companyName,
      companyTel: temp.companyTel,
      deleted: temp.deleted,
      location: temp.location
    }
  })
}
export function deleteAgent(id) {
  return request({
    url: '/admin/agent/edit',
    method: 'post',
    data: {
      agentId: id,
      deleted: 1
    }
  })
}

// 获取全国城市
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
      tel: temp.contactsTel
    }
  })
}
