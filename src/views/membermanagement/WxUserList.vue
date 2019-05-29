// 小程序用户列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索小程序会员" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" style="height: 45px" @click="dialogPictureVisible = true,clickPicture = scope.row.avatarUrl">
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span v-if="scope.row.mobile">{{ scope.row.mobile }}</span>
          <span v-else>未绑定</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.regTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button v-if="false" type="primary" size="mini">详情</el-button>
          <el-button v-if="scope.row.enable === 0" type="warning" size="mini" @click="reEditFrUser(scope.row)">禁用</el-button>
          <el-button v-else type="info" size="mini" @click="reEditFrUser(scope.row)">启用</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes.sync="listQuery.pageSizes"
      @pagination="reFrUserList"/>
    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { wxUserList, editWxUser } from '@/api/user'

export default {
  name: 'WxUserList',
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
        limit: 8,
        pageSizes: [8, 16, 24, 32]
      },
      temp: {
        id: undefined,
        enable: undefined
      },
      clickItem: {}
    }
  },
  created() {
    this.reFrUserList()
  },
  methods: {
    search() {
      this.listQuery.page = 1
      this.reFrUserList()
    },
    // 分润端会员列表
    reFrUserList() {
      wxUserList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    // 分润端会员编辑
    reEditFrUser(item) {
      this.temp.id = item.id
      if (item.enable === 0) {
        this.temp.enable = 1
      } else {
        this.temp.enable = 0
      }
      this.listLoading = true
      editWxUser(this.temp).then(response => {
        this.reFrUserList()
        this.listLoading = false
        if (item.enable === 0) {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
