// 体现审核
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.status" style="width: 120px" class="filter-item" value-key="key" @change="reGetApplyList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetApplyList">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.proposer.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.proposer.icon" alt="" style="height: 45px" @click="dialogPictureVisible = true,clickPicture = scope.row.proposer.icon">
        </template>
      </el-table-column>
      <el-table-column align="center" label="取现金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户银行" width="260px">
        <template slot-scope="scope">
          <div style="display: flex;flex-direction: row;align-items: center;justify-content: center">
            <img v-if="scope.row.bankCard" :src="scope.row.bankCard.bankLog" style="height: 25px">
            <span v-if="scope.row.bankCard" style="margin-left: 10px">{{ scope.row.bankCard.accountBank }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡号">
        <template slot-scope="scope">
          <span v-if="scope.row.bankCard">{{ scope.row.bankCard.bankCardNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手续费">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceCharge }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">申请中</span>
          <span v-else-if="scope.row.status === -1">已拒绝</span>
          <span v-else-if="scope.row.status === 1">处理中</span>
          <span v-else-if="scope.row.status === 2">已完成</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="primary" size="mini" icon="el-icon-check" @click="reEditApply(scope.row.id, 1)">通过</el-button>
          <el-button v-if="scope.row.status === 0" type="danger" icon="el-icon-close" size="mini" @click="reEditApply(scope.row.id, -1)">拒绝</el-button>
          <el-button v-if="scope.row.status === 1" type="primary" icon="el-icon-check" size="mini" @click="reEditApply(scope.row.id, 2)">完成</el-button>
          <el-button v-if="scope.row.status === 2" type="text" icon="el-icon-check" size="mini" disabled>已完成</el-button>
          <el-button v-if="scope.row.status === -1" type="text" icon="el-icon-close" size="mini" disabled>已拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetApplyList" />
    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getApplyList, editApply } from '@/api/finance'
export default {
  name: 'ReflectiveVeview',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        keyword: undefined,
        page: 1,
        size: 8,
        status: undefined,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [{ label: '全部', key: undefined }, { label: '申请中', key: 0 }, { label: '处理中', key: 1 }, { label: '已拒绝', key: -1 }, { label: '已完成', key: 2 }]
    }
  },
  created() {
    this.reGetApplyList()
  },
  methods: {
    // 查询提现审核
    reGetApplyList() {
      this.listLoading = true
      getApplyList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    // 提现申请编辑
    reEditApply(id, status) {
      this.listLoading = true
      editApply(id, status).then(response => {
        this.listLoading = false
        this.reGetApplyList()
        this.$message({
          message: '请求成功',
          type: 'success'
        })
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
