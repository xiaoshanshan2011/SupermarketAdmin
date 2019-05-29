import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'homeindex',
    children: [{
      path: 'homeindex',
      name: 'Homeindex',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 系统管理
  {
    path: '/organization',
    component: Layout,
    redirect: '/organization/administratorlist',
    name: 'Organization',
    meta: { title: '系统管理', icon: 'tree' },
    children: [
      {
        path: 'administratorlist',
        name: 'Administratorlist',
        component: () => import('@/views/organization/administratorlist'),
        meta: { title: '用户管理', icon: 'manager' }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('@/views/organization/department'),
        meta: { title: '部门管理', icon: 'department' }
      },
      {
        path: 'roll',
        name: 'Roll',
        component: () => import('@/views/organization/Roll'),
        meta: { title: '角色管理', icon: 'department' }
      }
      // {
      //   path: 'statistical',
      //   name: 'Statistical',
      //   component: () => import('@/views/organization/Statistical'),
      //   meta: { title: '统计报表', icon: 'department', roles: [1004] }
      // }
    ]
  },
  // 会员管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/realnameaudit',
    name: 'AppUser',
    meta: { title: '会员管理', icon: 'user', roles: [11] },
    children: [
      {
        path: 'realnameaudit',
        name: 'RealNameAudit',
        component: () => import('@/views/membermanagement/RealNameAudit'),
        meta: { title: '实名审核', icon: 'autonym', roles: [1101] }
      },
      {
        path: 'wxuserlist',
        name: 'WxUserList',
        component: () => import('@/views/membermanagement/WxUserList'),
        meta: { title: '小程序会员', icon: 'wechat', roles: [1102] }
      },
      {
        path: 'fruserlist',
        name: 'FrUserList',
        component: () => import('@/views/membermanagement/FrUserList'),
        meta: { title: '分润端会员', icon: 'users', roles: [1103] }
      },
      {
        hidden: true,
        path: 'fruserdetails',
        name: 'FrUserDetails',
        component: () => import('@/views/membermanagement/FrUserDetails'),
        meta: { title: '分润端会员详情', icon: 'users' }
      },
      {
        hidden: true,
        path: 'userstoremenagement',
        name: 'UserStoreMenagement',
        component: () => import('@/views/membermanagement/StoreMenagement'),
        meta: { title: '店主名下店铺', icon: 'users' }
      },
      {
        hidden: true,
        path: 'usersellorderlist',
        name: 'UserSellOrderList',
        component: () => import('@/views/membermanagement/SellOrderList'),
        meta: { title: '分润用户售卖订单', icon: 'users' }
      },
      {
        hidden: true,
        path: 'userrentorderlist',
        name: 'UserRentOrderList',
        component: () => import('@/views/membermanagement/RentOrderList'),
        meta: { title: '分润用户租赁订单', icon: 'users' }
      }
    ]
  },
  // 财务管理
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/ReflectiveVeview',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'partners', roles: [21] },
    children: [
      {
        path: 'setpoundage',
        name: 'SetPoundage',
        component: () => import('@/views/finance/SetPoundage'),
        meta: { title: '设置手续费', icon: 'partner', roles: [2101] }
      },
      {
        path: 'reflectiveveview',
        name: 'ReflectiveVeview',
        component: () => import('@/views/finance/ReflectiveVeview'),
        meta: { title: '提现审核', icon: 'partner', roles: [2102] }
      },
      {
        path: 'moneydetailslist',
        name: 'MoneyDetailsList',
        component: () => import('@/views/finance/MoneyDetailsList'),
        meta: { title: '资金明细', icon: 'partner', roles: [2103] }
      },
      {
        path: 'moneyuserlist',
        name: 'MoneyUserList',
        component: () => import('@/views/finance/MoneyUserList'),
        meta: { title: '资金账户', icon: 'partner', roles: [2104] }
      }
    ]
  },
  // 代理管理
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/agentList',
    name: 'Agent',
    meta: { title: '代理管理', icon: 'agent', roles: [12] },
    children: [
      {
        path: 'agentList',
        name: 'AgentList',
        component: () => import('@/views/agent/AgentList'),
        meta: { title: '代理管理', icon: 'agent', roles: [1201] }
      }
    ]
  },
  // 合伙人
  // {
  //   path: '/partners',
  //   component: Layout,
  //   redirect: '/partners/PartnersList',
  //   name: 'Partners',
  //   meta: { title: '合作伙伴', icon: 'partners', roles: [18] },
  //   children: [
  //     {
  //       path: 'partnerslist',
  //       name: 'PartnersList',
  //       component: () => import('@/views/partners/PartnersList'),
  //       meta: { title: '合作伙伴', icon: 'partner', roles: [1801] }
  //     }
  //   ]
  // },
  // 设备管理
  {
    path: '/device',
    component: Layout,
    redirect: '/device/devicemanagement',
    name: 'Device',
    meta: { title: '设备管理', icon: 'equipment', roles: [13] },
    children: [
      {
        path: 'devicemanagement',
        name: 'Devicemanagement',
        component: () => import('@/views/device/devicelist'),
        meta: { title: '设备列表', icon: 'equipment', roles: [1301] }
      },
      {
        path: 'devicetype',
        name: 'DeviceType',
        component: () => import('@/views/device/devicetype'),
        meta: { title: '设备类型', icon: 'type', roles: [1302] }
      },
      {
        hidden: true,
        path: 'devicestore',
        name: 'DeviceStore',
        component: () => import('@/views/device/DeviceStore'),
        meta: { title: '绑定设备店铺', icon: 'type' }
      }
    ]
  },

  // 门店管理
  {
    path: '/store',
    component: Layout,
    redirect: '/store/StoreMenagement',
    name: 'Store',
    meta: { title: '店铺管理', icon: 'store', roles: [14] },
    children: [
      {
        path: 'storemenagement',
        name: 'StoreMenagement',
        component: () => import('@/views/store/StoreMenagement'),
        meta: { title: '店铺列表', icon: 'store', roles: [1401] }
      },
      {
        path: 'storeaudit',
        name: 'StoreAudit',
        component: () => import('@/views/store/StoreAudit'),
        meta: { title: '店铺审核', icon: 'check', roles: [1402] }
      },
      {
        hidden: true,
        path: 'storemembers/:id',
        name: 'StoreMembers',
        component: () => import('@/views/store/StoreMembers'),
        meta: { title: '店内成员', icon: 'check' }
      },
      {
        hidden: true,
        path: 'storedevices/:id',
        name: 'StoreDevices',
        component: () => import('@/views/store/StoreDevices'),
        meta: { title: '店内设备', icon: 'check' }
      },
      {
        hidden: true,
        path: 'storedelivery',
        name: 'StoreDelivery',
        component: () => import('@/views/store/StoreDelivery'),
        meta: { title: '配送店铺', icon: 'check' }
      },
      // {
      //   path: 'priceaudit',
      //   name: 'PriceAudit',
      //   component: () => import('@/views/store/PriceAudit'),
      //   meta: { title: '售价审核', icon: 'store', roles: [1403] }
      // },
      {
        hidden: true,
        path: 'storefenrun/:data',
        name: 'StoreFenrun',
        component: () => import('@/views/store/StoreFenrun'),
        meta: { title: '店铺分润', icon: 'store' }
      }
    ]
  },
  // 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/GoodsList',
    name: 'Product',
    meta: { title: '商品管理', icon: 'product' },
    children: [
      {
        path: 'goodslist',
        name: 'GoodsList',
        component: () => import('@/views/goods/GoodsList'),
        meta: { title: '商品列表', icon: 'product' }
      },
      {
        path: 'goodstype',
        name: 'GoodsType',
        component: () => import('@/views/goods/GoodsType'),
        meta: { title: '商品分类', icon: 'types' }
      }
      // {
      //   path: 'inventorylist',
      //   name: 'InventoryList',
      //   component: () => import('@/views/goods/InventoryList'),
      //   meta: { title: '库存管理', icon: 'types' }
      // }
    ]
  },
  // 仓库管理
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/WarehouseList',
    name: 'WarehouseList',
    meta: { title: '仓库管理', icon: 'order' },
    children: [
      {
        path: 'warehouselist',
        name: 'WarehouseList',
        component: () => import('@/views/warehouse/WarehouseList'),
        meta: { title: '仓库列表', icon: 'order' }
      },
      {
        path: 'warehouseuser',
        name: 'WarehouseUser',
        component: () => import('@/views/warehouse/WarehouseUser'),
        meta: { title: '仓库用户', icon: 'types' }
      }
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/order/PurchaseOrderList',
    name: 'Order',
    meta: { title: '订单管理', icon: 'order', roles: [16] },
    children: [
      {
        path: 'purchaseorderlist',
        name: 'PurchaseOrderList',
        component: () => import('@/views/order/PurchaseOrderList'),
        meta: { title: '采购订单', icon: 'purchase', roles: [1601] }
      },
      {
        path: 'sellorderlist',
        name: 'SellOrderList',
        component: () => import('@/views/order/SellOrderList'),
        meta: { title: '售卖订单', icon: 'sell', roles: [1602] }
      },
      {
        path: 'rentorderlist',
        name: 'RentOrderList',
        component: () => import('@/views/order/RentOrderList'),
        meta: { title: '租赁订单', icon: 'rent', roles: [1603] }
      },
      {
        path: 'evaluatelist',
        name: 'EvaluateList',
        component: () => import('@/views/order/EvaluateList'),
        meta: { title: '售卖反馈', icon: 'rent', roles: [1604] }
      },
      {
        path: 'storeorderlist',
        name: 'StoreOrderList',
        component: () => import('@/views/order/StoreOrderList'),
        meta: { title: '商城订单', icon: 'rent', roles: [1605] }
      }
    ]
  },
  // 慈善基金
  // {
  //   path: '/charitablefunds',
  //   component: Layout,
  //   redirect: '/charitablefunds/StateCharityList',
  //   name: 'Charitablefunds',
  //   meta: { title: '慈善基金', icon: 'love', roles: [17] },
  //   children: [
  //     {
  //       path: 'statecharitylist',
  //       name: 'StateCharityList',
  //       component: () => import('@/views/charitablefunds/StateCharityList'),
  //       meta: { title: '国家慈善', icon: 'country', roles: [1701] }
  //     },
  //     {
  //       path: 'placecharitylist',
  //       name: 'PlaceCharityList',
  //       component: () => import('@/views/charitablefunds/PlaceCharityList'),
  //       meta: { title: '地方慈善', icon: 'place', roles: [1702] }
  //     },
  //     {
  //       path: 'fundlist',
  //       name: 'FundList',
  //       component: () => import('@/views/charitablefunds/FundList'),
  //       meta: { title: '基金', icon: 'jijin', roles: [1703] }
  //     }
  //   ]
  // },
  // 地瓜分润
  // {
  //   path: '/fenrun',
  //   component: Layout,
  //   redirect: '/fenrun/FenRunSet',
  //   name: 'Fenrun',
  //   meta: { title: '地瓜分润', icon: 'partners', roles: [19] },
  //   children: [
  //     {
  //       path: 'fenrunset',
  //       name: 'FenRunSet',
  //       component: () => import('@/views/fenrun/FenRunSet'),
  //       meta: { title: '地区分润', icon: 'partner', roles: [1901] }
  //     },
  //     {
  //       path: 'divicefenrunset',
  //       name: 'DiviceFenRunSet',
  //       component: () => import('@/views/fenrun/DiviceFenRunSet'),
  //       meta: { title: '设备分润', icon: 'partner', roles: [1902] }
  //     }
  //   ]
  // },
  // 公告
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/NoticeList',
    name: 'Notice',
    meta: { title: '公告管理', icon: 'partners', roles: [20] },
    children: [
      {
        path: 'noticelist',
        name: 'NoticeList',
        component: () => import('@/views/notice/NoticeList'),
        meta: { title: '公告列表', icon: 'partner', roles: [2001] }
      },
      {
        path: 'addnotice',
        name: 'AddNotice',
        component: () => import('@/views/notice/AddNotice'),
        meta: { title: '添加公告', icon: 'partner', roles: [2002] }
      },
      {
        hidden: true,
        path: 'editnotice',
        name: 'EditNotice',
        component: () => import('@/views/notice/EditNotice'),
        meta: { title: '编辑公告', icon: 'partner' }
      }
    ]
  },
  // 学院
  // {
  //   path: '/xueyuan',
  //   component: Layout,
  //   redirect: '/xueyuan/XueyuanList',
  //   name: 'Xueyuan',
  //   meta: { title: '商学院', icon: 'partners', roles: [22] },
  //   children: [
  //     {
  //       path: 'xueyuanlist',
  //       name: 'XueyuanList',
  //       component: () => import('@/views/xueyuan/XueyuanList'),
  //       meta: { title: '商学院', icon: 'partner', roles: [2201] }
  //     }
  //   ]
  // },
  // 广告管理
  {
    path: '/advert',
    component: Layout,
    redirect: '/advert/AdvertList',
    name: 'Advert',
    meta: { title: '广告管理', icon: 'partners', roles: [23] },
    children: [
      {
        path: 'advertlist',
        name: 'AdvertList',
        component: () => import('@/views/advert/AdvertList'),
        meta: { title: '广告申请列表', icon: 'partner', roles: [2301] }
      },
      {
        path: 'bannerlist',
        name: 'BannerList',
        component: () => import('@/views/advert/BannerList'),
        meta: { title: 'Banner广告', icon: 'partner', roles: [2302] }
      }
    ]
  }
]
