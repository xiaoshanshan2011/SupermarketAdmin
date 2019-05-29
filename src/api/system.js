import request from '@/utils/request'

// 更新权限表数据
export function updateAuthority(updateAuthorityReqs) {
  return request({
    url: '/admin/update/authority',
    method: 'post',
    data: {
      updateAuthorityReqs
    }
  })
}
// 创建角色
export function createRole(temp) {
  return request({
    url: '/api/admin/insertRole',
    method: 'post',
    data: {
      rolename: temp.rolename,
      roledesc: temp.roledesc
    }
  })
}
// 角色列表
export function roleList() {
  return request({
    url: '/api/admin/selectRole',
    method: 'get',
    params: {
    }
  })
}
// 角色编辑
export function editRole(temp) {
  return request({
    url: '/api/admin/updateRole',
    method: 'post',
    data: {
      roleid: temp.roleid,
      rolename: temp.rolename,
      roledesc: temp.roledesc
    }
  })
}
// 删除角色
export function deleteRole(roleid) {
  return request({
    url: '/api/admin/deleteRole',
    method: 'post',
    params: {
      roleId: roleid
    }
  })
}
// 获取角色权限配置
export function authorityList(id) {
  return request({
    url: '/admin/role/authority/list',
    method: 'get',
    params: {
      id: id
    }
  })
}
