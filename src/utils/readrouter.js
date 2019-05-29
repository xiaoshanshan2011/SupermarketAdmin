import { asyncRouterMap } from '@/router'

/**
 * 递归异步路由表
 * @param routes asyncRouterMap
 * @param roles
 */
var data = []
function filterAsyncRouter(routers, pid) {
  if (pid === 0) {
    data = []
  }
  routers.forEach(route => {
    const tmp = { ...route }
    if (tmp.meta.roles) {
      var item = {
        authNo: tmp.meta.roles[0],
        name: tmp.meta.title,
        pAuthNo: pid
      }
      data.push(item)
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, tmp.meta.roles[0])
      }
    }
  })
}

export function findRouter() {
  filterAsyncRouter(asyncRouterMap, 0)
  console.log(JSON.stringify(data))
  return data
}
