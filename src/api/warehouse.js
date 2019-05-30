import request from '@/utils/request'

export function findType(temp) {
  return request({
    url: '/api/admin/selectGoodsClassify',
    method: 'get',
    params: {
      parentid: temp.parentid
    }
  })
}

// 添加商品类型
export function addType(temp) {
  return request({
    url: '/api/admin/insertGoodsClassify',
    method: 'post',
    data: {
      name: temp.name,
      parentid: temp.parentid
    }
  })
}

// 编辑商品类型
export function editType(temp) {
  return request({
    url: '/api/admin/updateGoodsClassify',
    method: 'post',
    data: {
      classifyid: temp.classifyid,
      name: temp.name
    }
  })
}
// 删除商品类型
export function deleteGoodsClassify(classifyid) {
  return request({
    url: '/api/admin/deleteGoodsClassify',
    method: 'post',
    params: {
      classifyid: classifyid
    }
  })
}

// 添加商品
export function addGoods(temp) {
  return request({
    url: '/api/admin/insertGoods',
    method: 'post',
    data: {
      goodstype: temp.goodstype,
      barcode: temp.barcode,
      classifyid: temp.classifyid,
      pclassifyid: temp.pclassifyid,
      goodsname: temp.goodsname,
      goodsimg: temp.goodsimg,
      goodsunit: temp.goodsunit,
      ishot: temp.ishot,
      vipprice: temp.vipprice,
      discountsprice: temp.discountsprice,
      specialsaleprice: temp.specialsaleprice,
      wholesaleprice: temp.wholesaleprice,
      price: temp.price,
      goodsdesc: temp.goodsdesc,
      goodsspec: temp.goodsspec
    }
  })
}

// 获取多个商品类型的子商品类型
export function getProductType(parentid) {
  return request({
    url: '/api/admin/selectGoodsClassify',
    method: 'get',
    params: {
      parentid: parentid
    }
  })
}

// 仓库列表
export function getProduct(temp) {
  return request({
    url: '/api/admin/selectWarehouse',
    method: 'get',
    params: {
      limit: temp.limit,
      page: temp.page,
      keyword: temp.keyword
    }
  })
}

// 编辑商品
export function editGoods(temp) {
  return request({
    url: '/api/admin/updateGoods',
    method: 'post',
    data: {
      goodstype: temp.goodstype,
      goodscode: temp.goodscode,
      barcode: temp.barcode,
      classifyid: temp.classifyid,
      pclassifyid: temp.pclassifyid,
      goodsname: temp.goodsname,
      goodsimg: temp.goodsimg,
      goodsunit: temp.goodsunit,
      ishot: temp.ishot,
      vipprice: temp.vipprice,
      discountsprice: temp.discountsprice,
      specialsaleprice: temp.specialsaleprice,
      wholesaleprice: temp.wholesaleprice,
      price: temp.price,
      goodsdesc: temp.goodsdesc,
      goodsspec: temp.goodsspec
    }
  })
}
