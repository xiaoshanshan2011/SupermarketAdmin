// 资金明细
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findAll">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="转出账户">
        <template slot-scope="scope">
          <span>{{ scope.row.traderName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转出账户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.traderId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转入账户">
        <template slot-scope="scope">
          <span>{{ scope.row.toUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转入账户ID">
        <template slot-scope="scope">
          <span>{{ scope.row.toUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账单类型">
        <template slot-scope="scope">
          <span>{{ scope.row.billTypeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账单日期">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPurchaseOrderList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getFinancialList } from '@/api/finance'
export default {
  name: 'MoneyDetailsList',
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
        size: 10,
        appUserId: undefined,
        pageSizes: [10, 20, 30, 40]
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    findAll() {
      this.listLoading = true
      getFinancialList(this.listQuery).then(response => {
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
