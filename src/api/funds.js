import request from '@/utils/request'

// 添加慈善
export function addBeneficence(temp) {
  return request({
    url: '/admin/charitable/beneficence/add',
    method: 'post',
    data: {
      accountName: temp.accountName,
      bankCard: temp.bankCard,
      beneficenceType: temp.beneficenceType, // 慈善类型 1:国家慈善, 2:地方慈善
      cityId: temp.cityId,
      contactMobile: temp.contactMobile,
      contactTel: temp.contactTel,
      detailAddress: temp.detailAddress,
      name: temp.name
    }
  })
}

// 编辑慈善
export function editBeneficence(temp) {
  return request({
    url: '/admin/charitable/beneficence/edit',
    method: 'post',
    data: {
      id: temp.id,
      deleted: temp.deleted, // 1删除
      accountName: temp.accountName,
      bankCard: temp.bankCard,
      cityId: temp.cityId,
      contactMobile: temp.contactMobile,
      contactTel: temp.contactTel,
      detailAddress: temp.detailAddress,
      name: temp.name
    }
  })
}

// 慈善列表
export function getBeneficence(temp) {
  return request({
    url: '/admin/charitable/beneficence/list',
    method: 'get',
    params: {
      beneficenceType: temp.beneficenceType
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

// 基金列表
export function getFundList() {
  return request({
    url: '/admin/charitable/fund/list',
    method: 'get',
    params: {
    }
  })
}

// 省下所有慈善列表
export function getShengBeneficence(cityId) {
  return request({
    url: '/admin/charitable/sheng/beneficence/list',
    method: 'get',
    params: {
      beneficenceType: 2, // 慈善类型 1:国家慈善, 2:地方慈善
      cityId: cityId
    }
  })
}
