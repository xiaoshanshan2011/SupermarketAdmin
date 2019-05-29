import request from '@/utils/request'

// 文章列表
export function getArticleList(listQuery) {
  return request({
    url: '/academy/article/list',
    method: 'get',
    params: {
      articleType: listQuery.articleType, // 文章类型（1：活动 2：公益 3：其他)
      keyword: listQuery.keyword,
      size: listQuery.limit,
      page: listQuery.page - 1
    }
  })
}

// 发布新的文章
export function publishArticle(temp) {
  return request({
    url: '/academy/article/publish',
    method: 'put',
    data: {
      articleContent: temp.articleContent,
      articleImage: temp.articleImage,
      articleTitle: temp.articleTitle,
      articleVideoImage: temp.articleVideoImage,
      articleType: temp.articleType, // 文章类型（1：活动 2：公益 3：其他)
      articleVideo: temp.articleVideo
    }
  })
}

// 编辑文章
export function editArticle(temp) {
  return request({
    url: '/academy/article/edit',
    method: 'put',
    data: {
      id: temp.id,
      deleted: temp.deleted,
      articleContent: temp.articleContent,
      articleImage: temp.articleImage,
      articleTitle: temp.articleTitle,
      articleVideoImage: temp.articleVideoImage,
      articleType: temp.articleType, // 文章类型（1：活动 2：公益 3：其他)
      articleVideo: temp.articleVideo
    }
  })
}

