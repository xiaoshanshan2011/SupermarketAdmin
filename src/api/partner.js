import request from '@/utils/request'

// 合作伙伴列表
export function getPartnerList(temp) {
  return request({
    url: '/admin/partner/list',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page - 1,
      tel: temp.tel,
      name: temp.name,
      idNumber: temp.idNumber,
      userType: temp.userType
    }
  })
}

// 合作伙伴类型列表
export function getPartnerTypeList() {
  return request({
    url: '/admin/partner/type/list',
    method: 'get'
  })
}

// 创建合作伙伴
export function createPartner(temp) {
  return request({
    url: '/admin/partner/add',
    method: 'put',
    data: {
      agentId: temp.agentId,
      appUserId: temp.appUserId,
      description: temp.description,
      roleCode: temp.roleCode
    }
  })
}

// 编辑合作伙伴
export function editPartner(temp) {
  return request({
    url: '/admin/partner/dit',
    method: 'post',
    data: {
      deleted: temp.deleted,
      description: temp.description,
      id: temp.id,
      roleCode: temp.roleCode
    }
  })
}
