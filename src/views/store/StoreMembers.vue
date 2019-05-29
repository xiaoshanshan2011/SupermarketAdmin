<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>店内成员</el-tag>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="members" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.appUser.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.appUser.icon" alt="" style="height: 40px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.appUser.sex === 0" style="font-size: 13px">女</span>
          <span v-else style="font-size: 13px">男</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.appUser.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.appUser.location }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-if="scope.row.memberRole === 0" style="font-size: 13px">店主</span>
          <span v-else-if="scope.row.memberRole === 1" style="font-size: 13px">服务员</span>
          <span v-else-if="scope.row.memberRole === 2" style="font-size: 13px">配送员</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getStoreDetails } from '@/api/store'

export default {
  name: 'StoreMembers',
  data() {
    return {
      listLoading: false,
      id: undefined,
      members: []
    }
  },
  created() {
    this.getParams()
    this.findAll()
  },
  methods: {
    getParams() {
      this.id = this.$route.params.id
    },
    findAll() {
      getStoreDetails(this.id).then(response => {
        this.members = response.data.members
      })
    }
  }
}
</script>
