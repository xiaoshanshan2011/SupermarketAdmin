// 基金
<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.contactMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contactTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系地址">
        <template slot-scope="scope">
          <span>{{ scope.row.city.mergerName + scope.row.detailAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行名称">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡号">
        <template slot-scope="scope">
          <span>{{ scope.row.bankCard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户可用资金">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getFundList } from '@/api/funds'
export default {
  name: 'FundList',
  data() {
    return {
      list: [],
      listLoading: false
    }
  },
  created() {
    this.reFind()
  },
  methods: {
    // 查询分类
    reFind() {
      getFundList(this.temp).then(response => {
        this.list = response.data.list
      })
    }
  }
}
</script>

<style scoped>

</style>

