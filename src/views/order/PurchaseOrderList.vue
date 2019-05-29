// 采购订单
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
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图片" width="80px">
        <template slot-scope="scope">
          <img v-if="scope.row.goodsImage" :src="scope.row.goodsImage" style="height: 45px" @click="dialogPictureVisible = true,clickPicture = scope.row.goodsImage">
          <span v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总额" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配送地址">
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="配送员电话">
        <template slot-scope="scope">
          <span>{{ scope.row.deliverymanTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单店铺">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.storeTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.orderType === 1">创业者门店->实体店采购</span>
          <span v-else-if="scope.row.orderType === 2">餐饮店->实体店采购</span>
          <span v-else-if="scope.row.orderType === 3">实体店->平台采购</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="90px">
        <template slot-scope="scope">
          <span v-if="scope.row.handlerStatus === -1">未受理</span>
          <span v-else-if="scope.row.handlerStatus === 0">已受理 </span>
          <span v-else-if="scope.row.handlerStatus === 1">待发货</span>
          <span v-else-if="scope.row.handlerStatus === 2">已发货 </span>
          <span v-else-if="scope.row.handlerStatus === 3">已签收</span>
          <span v-else-if="scope.row.handlerStatus === 4">已送达 </span>
          <span v-else-if="scope.row.handlerStatus === 5">已取消 </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预计送达时间">
        <template slot-scope="scope">
          <span>{{ scope.row.esTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="ifShow(scope.row)" type="primary" size="mini" @click="editPurchaseOrder(scope.row)">
            <span v-if="scope.row.handlerStatus === -1">确认受理</span>
            <span v-else-if="scope.row.handlerStatus === 0">确认打包</span>
            <span v-else-if="scope.row.handlerStatus === 1">确认发货</span>
          </el-button>
          <el-button v-else type="info" size="mini" disabled @click="editPurchaseOrder(scope.row)">
            <span>已发货</span>
          </el-button>
          <!--<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPurchaseOrderList" />

    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getPurchaseOrderList, editPurchaseOrder } from '@/api/order'
export default {
  name: 'PurchaseOrderList',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      sortOptions: [{ label: '全部 ', key: undefined }, { label: '餐饮店->实体店采购', key: 2 }, { label: '实体店->平台采购', key: 3 }],
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
        page: 1,
        limit: 8,
        pageSizes: [8, 16, 24, 32]
      }
    }
  },
  created() {
    this.reFindUser()
    this.reGetPurchaseOrderList()
  },
  methods: {
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
      getPurchaseOrderList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    editPurchaseOrder(row) {
      this.temp.id = row.id
      this.temp.handlerStatus = row.handlerStatus + 1
      editPurchaseOrder(this.temp).then(response => {
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
