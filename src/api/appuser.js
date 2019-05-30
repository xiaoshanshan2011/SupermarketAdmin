import request from '@/utils/request'

export function getauditList(temp) {
  return request({
    url: '/admin/vip/wait/audit',
    method: 'get',
    params: {
      name: temp.name,
      tel: temp.tel,
      audit: temp.select,
      limit: temp.limit,
      page: temp.page,
      time: new Date().getTime()
    }
  })
}

export function auditAppUser(temp) {
  return request({
    url: '/admin/vip/audit',
    method: 'post',
    data: {
      appUserId: temp.id,
      audit: temp.audit,
      description: temp.description
    }
  })
}
