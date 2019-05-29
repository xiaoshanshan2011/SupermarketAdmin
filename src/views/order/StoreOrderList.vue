// 商城订单
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.orderType" style="width: 180px" class="filter-item" value-key="key" @change="reGetPurchaseOrderList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索采购订单" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPurchaseOrderList">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="80px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="普通商品">
        <template slot-scope="scope">
          <!--<img :src="scope.row.orderGoodsList[0].goods.picture" alt="" style="height: 45px">-->
          <el-button style="font-size: 12px" type="text" @click="lookGoods(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单积分/金额">
        <template slot-scope="scope">
          <span v-if="scope.row.orderType === 1">¥{{ scope.row.totalMoney }}</span>
          <span v-else-if="scope.row.orderType === 2">{{ scope.row.totalIntegral }}积分</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 0">微信小程序</span>
          <span v-else-if="scope.row.payType === 1">支付宝</span>
          <span v-else-if="scope.row.payType === 2">微信App支付</span>
          <span v-else-if="scope.row.payType === 3">微信H5支付</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货人">
        <template slot-scope="scope">
          <span>{{ scope.row.userLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.userLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收货地址">
        <template slot-scope="scope">
          <span>{{ scope.row.userLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单类型">
        <template slot-scope="scope">
          <span v-if="scope.row.orderType === 1">普通商城</span>
          <span v-else-if="scope.row.orderType === 2">积分商城</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="90px">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === -1">已取消</span>
          <span v-else-if="scope.row.orderStatus === 0">待付款 </span>
          <span v-else-if="scope.row.orderStatus === 1">待发货</span>
          <span v-else-if="scope.row.orderStatus === 2">待收货 </span>
          <span v-else-if="scope.row.orderStatus === 3">已完成</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.orderStatus === 1" type="primary" size="mini" @click="storeOrderEdit(scope.row)">发货</el-button>
          <el-button v-else-if="scope.row.orderStatus === -1" type="info" size="mini" disabled>已取消</el-button>
          <el-button v-else-if="scope.row.orderStatus === 0" type="info" size="mini" disabled>待付款</el-button>
          <el-button v-else-if="scope.row.orderStatus === 2" type="info" size="mini" disabled>待收货</el-button>
          <el-button v-else-if="scope.row.orderStatus === 3" type="info" size="mini" disabled>已完成</el-button>
          <!--<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPurchaseOrderList" />

    <el-dialog :visible.sync="dialogFormVisible" title="订单商品" width="900px">
      <el-table :data="clickItem.orderGoodsList" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="商品图片" width="120px">
          <template slot-scope="scope">
            <img :src="scope.row.goods.picture" alt="" style="height: 55px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品编号">
          <template slot-scope="scope">
            <span>{{ scope.row.goods.goodsSn }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.goods.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="金额/积分" width="120px">
          <template slot-scope="scope">
            <span v-if="clickItem.orderType === 1">¥{{ scope.row.goodsPrice }}</span>
            <span v-else-if="clickItem.orderType === 2">{{ scope.row.integral }}积分</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品数量" width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.number }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { storeOrderList, storeOrderEdit } from '@/api/order'
export default {
  name: 'StoreOrderList',
  components: { Pagination },
  data() {
    return {
      dialogFormVisible: false,
      sortOptions: [{ label: '全部 ', key: undefined }, { label: '普通商城', key: 1 }, { label: '积分商城', key: 2 }],
      list: [],
      listLoading: false,
      tableKey: 0,
      total: undefined,
      temp: {
        id: undefined,
        handlerStatus: undefined,
        orderStatus: undefined
      },
      listQuery: {
        keyword: undefined,
        orderType: undefined,
        orderStatus: undefined,
        page: 1,
        limit: 8,
        pageSizes: [8, 16, 24, 32]
      },
      clickItem: []
    }
  },
  created() {
    this.reFindUser()
    this.reGetPurchaseOrderList()
  },
  methods: {
    lookGoods(item) {
      this.clickItem = item
      this.dialogFormVisible = true
    },
    ifShow: function(row) {
      if (row.handlerStatus > -2 && row.handlerStatus < 2) {
        return true
      } else {
        return false
      }
    },
    // 查询所有用户
    reFindUser() {
      this.listLoading = false
      // SUPERADMINISTRATOR(1,"超级管理员"),
      // AGENT(3,"代理商"),
      // findAppUser(this.listQuery).then(response => {
      //   this.listLoading = false
      //   this.list = response.data.rows
      //   this.total = response.data.total
      // }).catch(error => {
      //   console.log(error)
      //   this.listLoading = false
      // })
    },
    reGetPurchaseOrderList() {
      this.listLoading = true
      storeOrderList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    storeOrderEdit(row) {
      this.temp.id = row.id
      this.temp.orderStatus = 2
      storeOrderEdit(this.temp).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.reGetPurchaseOrderList()
      })
    }
  }
}
</script>

<style scoped>

</style>
