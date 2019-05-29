import request from '@/utils/request'

// 公告添加
export function addNotice(temp) {
  return request({
    url: '/admin/notice/notice/add',
    method: 'put',
    data: {
      level: temp.level, // 通告优先级（1:红色，2:黄色，3:蓝色）
      noticeContent: temp.noticeContent, // 通告内容
      noticeLable: temp.noticeLable, // 通告标题
      noticeTile: temp.noticeTile, // 通告标题
      noticeType: temp.noticeType // 通告端 0:所有， 1:app分润端， 2:红薯机， 3:小程序
    }
  })
}

// 编辑公告
export function editNotice(temp) {
  return request({
    url: '/admin/notice/notice/edit',
    method: 'post',
    data: {
      deleted: temp.deleted,
      level: temp.level,
      noticeContent: temp.noticeContent,
      noticeId: temp.id,
      noticeLable: temp.noticeLable,
      noticeTile: temp.noticeTile
    }
  })
}

// 公告列表
export function getNoticeList(temp) {
  return request({
    url: 'admin/notice/notice/list',
    method: 'get',
    params: {
      noticeTile: temp.noticeTile,
      noticeType: temp.noticeType,
      limit: temp.limit,
      offset: temp.offset - 1
    }
  })
}
