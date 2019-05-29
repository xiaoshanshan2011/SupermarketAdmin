// 评价
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.tasteScore" style="width: 120px" class="filter-item" value-key="key" @change="reGetPotatoList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPotatoList">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatarUrl" alt="" style="height: 45px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="评价口味">
        <template slot-scope="scope">
          <span v-if="scope.row.tasteScore === 1">有些生</span>
          <span v-else-if="scope.row.tasteScore === 2">有些熟</span>
          <span v-else-if="scope.row.tasteScore === 3">刚刚好</span>
          <span v-else-if="scope.row.tasteScore === 4">无可挑剔</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPotatoList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getAppraisesList } from '@/api/order'
export default {
  name: 'EvaluateList',
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
        limit: 8,
        tasteScore: undefined,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [{ label: '全部反馈', key: undefined }, { label: '无可挑剔', key: 4 }, { label: '刚刚好', key: 3 }, { label: '有些熟', key: 2 }, { label: '有些生', key: 1 }]
    }
  },
  created() {
    this.reGetPurchaseOrderList()
  },
  methods: {
    reGetPurchaseOrderList() {
      this.listLoading = true
      getAppraisesList(this.listQuery).then(response => {
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
