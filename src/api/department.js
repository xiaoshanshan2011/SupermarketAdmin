import request from '@/utils/request'

export function getDepartmentList() {
  return request({
    url: '/api/admin/selectDepartment',
    method: 'get',
    params: {
    }
  })
}

export function createDepartment(temp) {
  return request({
    url: '/api/admin/insertDepartment',
    method: 'post',
    data: {
      departmentname: temp.departmentname,
      departmentdesc: temp.departmentdesc
    }
  })
}

export function editDepartment(textMap) {
  return request({
    url: '/api/admin/updateDepartment',
    method: 'post',
    data: {
      departmentid: textMap.departmentid,
      departmentname: textMap.departmentname,
      departmentdesc: textMap.departmentdesc
    }
  })
}
export function deleteDepartment(departmentid) {
  return request({
    url: '/api/admin/deleteDepartment',
    method: 'post',
    params: {
      departmentid: departmentid
    }
  })
}

// 创建管理员
export function administratorCreate(textMap) {
  return request({
    url: '/api/admin/insertUser',
    method: 'post',
    data: {
      roleid: textMap.roleid,
      departmentid: textMap.departmentid,
      email: textMap.email,
      username: textMap.username,
      password: textMap.password2,
      userphoto: textMap.userphoto,
      mobile: textMap.mobile,
      nickname: textMap.nickname
    }
  })
}
// 管理员列表
export function administratorList() {
  return request({
    url: '/api/admin/selectUser',
    method: 'get',
    params: {
    }
  })
}
// 编辑管理员
export function administratorEdit(textMap) {
  return request({
    url: '/api/admin/updateUser',
    method: 'post',
    data: {
      userid: textMap.userid,
      roleid: textMap.roleid,
      departmentid: textMap.departmentid,
      email: textMap.email,
      username: textMap.username,
      password: textMap.password2,
      userphoto: textMap.userphoto,
      mobile: textMap.mobile,
      nickname: textMap.nickname,
      deleted: textMap.deleted
    }
  })
}
// 删除管理员
export function deleteUser(userId) {
  return request({
    url: '/api/admin/deleteUser',
    method: 'post',
    params: {
      userId: userId
    }
  })
}
