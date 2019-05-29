// 售卖订单
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.status" style="width: 120px" class="filter-item" value-key="key" @change="reGetPotatoList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索售卖订单" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPotatoList">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付人">
        <template slot-scope="scope">
          <span>{{ scope.row.payName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品数量">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsNum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payMethod === 0">支付宝</span>
          <span v-else-if="scope.row.payMethod === 1">微信扫码支付</span>
          <span v-else-if="scope.row.payMethod === 2">微信小程序支付</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待支付</span>
          <span v-else-if="scope.row.status === 1">已支付</span>
          <span v-else-if="scope.row.status === 2">已取消</span>
          <span v-else-if="scope.row.status === 3">已完成</span>
          <span v-else-if="scope.row.status === 4">已退款</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺名">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModified }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPotatoList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getPotatoList } from '@/api/order'
export default {
  name: 'SellOrderList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 12,
        status: undefined,
        appUserId: undefined,
        pageSizes: [12, 24, 36, 48]
      },
      sortOptions: [{ label: '全部订单', key: undefined }, { label: '待支付', key: 0 }, { label: '已支付', key: 1 }, { label: '已取消', key: 2 }, { label: '已完成', key: 3 }, { label: '已退款', key: 4 }]
    }
  },
  created() {
    this.reGetPotatoList()
  },
  methods: {
    reGetPotatoList() {
      this.listLoading = true
      getPotatoList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
