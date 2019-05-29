// 分润端用户列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索分润端会员" style="width: 200px;" class="filter-item"/>
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
          <img v-if="scope.row.icon" :src="scope.row.icon" style="height: 45px" @click="dialogPictureVisible = true,clickPicture = scope.row.icon">
          <span v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名">
        <template slot-scope="scope">
          <span v-if="scope.row.name">{{ scope.row.name }}</span>
          <span v-else>未认证</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名验证">
        <template slot-scope="scope">
          <span v-if="scope.row.audit === -1">未验证</span>
          <span v-else-if="scope.row.audit === 0">申请中</span>
          <span v-else-if="scope.row.audit === 1">已通过</span>
          <span v-else-if="scope.row.audit === 2">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否为店主">
        <template slot-scope="scope">
          <span v-if="scope.row.isShopkeeper === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="余额">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.regTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row)">详情</el-button>
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

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="temp">
        <el-form-item label="用户头像：" label-width="100px" prop="contactsTel">
          <img v-if="clickItem.icon" :src="clickItem.icon" style="height: 60px">
          <div v-else class="input-style">未设置</div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名：" label-width="100px" prop="contactsTel">
              <div class="input-style">{{ clickItem.name }}</div>
            </el-form-item>
            <el-form-item label="手机号码：" label-width="100px" prop="contactsTel">
              <div class="input-style">{{ clickItem.tel }}</div>
            </el-form-item>
            <el-form-item label="实名验证：" label-width="100px" prop="contactsTel">
              <div v-if="clickItem.audit === -1" class="input-style">未验证</div>
              <div v-if="clickItem.audit === 0" class="input-style">申请中</div>
              <div v-if="clickItem.audit === 1" class="input-style">已通过</div>
              <div v-if="clickItem.audit === 2" class="input-style">已拒绝</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为店主：" label-width="100px" prop="contactsTel">
              <div v-if="clickItem.isShopkeeper === 1" class="input-style">{{ temp.yes }}</div>
              <div v-else class="input-style">{{ temp.no }}</div>
            </el-form-item>
            <el-form-item label="注册时间：" label-width="100px" prop="contactsTel">
              <div class="input-style">{{ clickItem.regTime }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="display: flex;flex-direction: row;justify-content: space-around;margin-top: 50px;margin-bottom: 30px">
        <el-button v-if="clickItem.isShopkeeper === 1" type="primary" @click="toMxdp">名下店铺</el-button>
        <!--<el-button v-if="clickItem.isShopkeeper === 1" type="primary">流水明细</el-button>-->
        <!--<el-button v-if="clickItem.isShopkeeper === 1" type="primary">采购订单</el-button>-->
        <el-button v-if="clickItem.isShopkeeper === 1" type="primary" @click="toSmdd">售卖订单</el-button>
        <el-button v-if="clickItem.isShopkeeper === 1" type="primary" @click="toZldd">租赁订单</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { frUserList, editFrUser } from '@/api/user'

export default {
  name: 'FrUserList',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      list: [],
      listLoading: false,
      tableKey: 0,
      total: undefined,
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 8,
        pageSizes: [8, 16, 24, 32]
      },
      temp: {
        id: undefined,
        enable: undefined,
        title: '会员详情',
        yes: '是',
        no: '否'
      },
      clickItem: {},
      dialogFormVisible: false
    }
  },
  created() {
    this.reFrUserList()
  },
  methods: {
    toDetails(item) {
      this.$router.push({
        path: 'fruserdetails',
        name: 'FrUserDetails',
        params: {
          icon: item.icon,
          name: item.name,
          tel: item.tel,
          audit: item.audit,
          isShopkeeper: item.isShopkeeper,
          regTime: item.regTime
        }
      })
    },
    // 跳转到名下店铺
    toMxdp() {
      this.$router.push({
        path: 'storemenagement',
        name: 'StoreMenagement',
        params: {
          appUserId: this.clickItem.id
        }
      })
    },
    // 跳转到售卖订单
    toSmdd() {
      this.$router.push({
        path: 'sellorderlist',
        name: 'SellOrderList',
        params: {
          appUserId: this.clickItem.id
        }
      })
    },
    // 跳转到租赁订单
    toZldd() {
      this.$router.push({
        path: 'rentorderlist',
        name: 'RentOrderList',
        params: {
          appUserId: this.clickItem.id
        }
      })
    },
    search() {
      this.listQuery.page = 1
      this.reFrUserList()
    },
    // 分润端会员列表
    reFrUserList() {
      frUserList(this.listQuery).then(response => {
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
      editFrUser(this.temp).then(response => {
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
    },
    handleCreate(item) {
      this.clickItem = item
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
