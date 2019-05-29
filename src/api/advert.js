import request from '@/utils/request'

// 广告申请列表
export function advertList(temp) {
  return request({
    url: '/admin/advertisement/apply/list',
    method: 'get',
    params: {
      keyword: temp.keyword,
      size: temp.limit,
      state: temp.state,
      page: temp.page - 1
    }
  })
}

// 编辑广告
export function advertEdit(temp) {
  return request({
    url: '/admin/advertisement/eduit',
    method: 'post',
    data: {
      deleted: temp.deleted,
      id: temp.id,
      state: temp.state // 状态(0未审阅,1已审阅)
    }
  })
}

// 首页轮播图添加
export function addBanner(temp) {
  return request({
    url: '/admin/advertisement/slide/add',
    method: 'put',
    data: {
      cityCode: temp.cityCode,
      imageName: temp.imageName,
      imageUrl: temp.imageUrl,
      imgageDesc: temp.imgageDesc,
      startTime: temp.startTime,
      stopTime: temp.stopTime,
      type: temp.type,
      imve: temp.imve
    }
  })
}

// 编辑app首页轮播图
export function editSlide(temp) {
  return request({
    url: '/admin/advertisement/slide/edit',
    method: 'post',
    data: {
      deleted: temp.deleted,
      cityCode: temp.cityCode,
      imageName: temp.imageName,
      imageUrl: temp.imageUrl,
      imgageDesc: temp.imgageDesc,
      startTime: temp.startTime,
      stopTime: temp.stopTime,
      type: temp.type,
      slideId: temp.slideId,
      imve: temp.imve
    }
  })
}

// 首页轮播图列表
export function slideList(temp) {
  return request({
    url: '/admin/advertisement/slide/list',
    method: 'get',
    params: {
      limit: temp.limit,
      offset: temp.page - 1,
      keyword: temp.keyword,
      type: temp.type
    }
  })
}
