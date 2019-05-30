import request from '@/utils/request'

// 提现申请编辑
export function editApply(id, status) {
  return request({
    url: '/admin/finance/enchashment/apply/edit',
    method: 'post',
    data: {
      id: id,
      status: status
    }
  })
}

// 提现审核列表
export function getApplyList(temp) {
  return request({
    url: '/admin/finance/enchashment/apply/list',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page,
      status: temp.status,
      keyword: temp.keyword
    }
  })
}

// 手续费设置
export function setCharge(temp) {
  return request({
    url: '/admin/finance/service/charge/set',
    method: 'post',
    data: {
      minEcmMoney: temp.minEcmMoney,
      rate: temp.rate
    }
  })
}

// 手续费列表
export function getChargeList() {
  return request({
    url: '/admin/finance/service/charge/list',
    method: 'get'
  })
}

// 资金明细
export function getFinancialList(temp) {
  return request({
    url: '/admin/finance/financial/details',
    method: 'get',
    params: {
      size: temp.size,
      page: temp.page,
      keyword: temp.keyword
    }
  })
}

// 获取可用转账系统用户列表
export function getUserList() {
  return request({
    url: '/admin/finance/user/list',
    method: 'get'
  })
}

// 分润端会员转账
export function balanceTransfer(temp) {
  return request({
    url: '/admin/finance/balance/transfer',
    method: 'post',
    data: {
      money: temp.money,
      sourceUserId: temp.sourceUserId,
      toUserId: temp.toUserId
    }
  })
}
