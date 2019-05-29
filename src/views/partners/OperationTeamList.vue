// 运营团队
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索商品" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reFindUser">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <img :src="scope.row.userphoto" style="height: 50px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.wxopenid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.userphone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件地址">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">详情</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reFindUser" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { findAppUser } from '@/api/app_user'
export default {
  name: 'OperationTeamList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: undefined,
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 10,
        pageSizes: [8, 16, 24, 32]
      }
    }
  },
  created() {
    this.reFindUser()
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>

</style>
