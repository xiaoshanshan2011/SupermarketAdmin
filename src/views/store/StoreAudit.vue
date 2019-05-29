<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tel" placeholder="联系人电话" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.storeName" placeholder="店铺名字" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.audit" style="width: 100px" class="filter-item" value-key="key" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStoreType" align="center" label="店铺类型" prop="storeType">
        <!--<template slot-scope="scope" >
          <span>{{ scope.row.storeType }}</span>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="店铺图片">
        <template slot-scope="scope">
          <img :src="scope.row.storeImage" alt="" style="height: 40px" @click="dialogPictureVisible = true,clickPicture = scope.row.storeImage">
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺区域">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.storeArea }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺地址">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.storeLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人名">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsTel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatAuditType" align="center" label="审核状态" prop="audit">
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.audit }}</span>
        </template>-->
      </el-table-column>
      <el-table-column v-if = "oprationShow" align="center" label="审核" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePass(scope.row)">通过</el-button>
          <el-button type="danger" size="mini" @click="handleEdit(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="handleFilter"/>
    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input v-model="temp.reason"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRepulse()">确定</el-button>
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
import { getStoreList, editStore } from '@/api/store'
// editStore
export default {
  name: 'StoreAudit',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      total: 0,
      listQuery: {
        limit: 8,
        page: 1,
        tel: undefined,
        storeName: undefined,
        audit: 1,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [{ label: '草稿', key: 0 }, { label: '待审核', key: 1 }, { label: '已通过', key: 2 }, { label: '已拒绝', key: 3 }],
      listLoading: false,
      list: [],
      oprationShow: false,
      dialogFormVisible: false,
      temp: {
        storeId: undefined,
        title: '店铺审核',
        reason: undefined,
        audit: undefined
      },
      rules: {
        reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    findAll() {
      this.list = []
      getStoreList(this.listQuery).then(response => {
        var dataList = response.data.list
        this.total = response.data.total
        for (var i = 0; i < dataList.length; i++) {
          var temp = {}
          var members = dataList[i].members
          temp.id = dataList[i].id
          temp.storeName = dataList[i].storeName
          temp.storeType = dataList[i].storeType
          temp.storeImage = dataList[i].storeImage
          temp.audit = dataList[i].audit
          if (dataList[i].city !== null) {
            temp.cityCode = dataList[i].city.id
            temp.storeArea = dataList[i].city.mergerName
          }
          temp.gmtCreate = dataList[i].gmtCreate
          temp.appUserdatas = []
          temp.storeLocation = dataList[i].storeLocation
          for (var j = 0; j < members.length; j++) {
            if (members[j].memberRole === 0) {
              // 店主
              temp.contactsName = members[j].appUser.name
              temp.contactsTel = members[j].appUser.tel
              temp.appUserdatas.push(members[j].appUser)
            }
          }

          this.list.push(temp)
        }
      })
    },
    handleFilter() {
      if (this.listQuery.audit === 1) {
        this.oprationShow = true
      } else {
        this.oprationShow = false
      }
      this.findAll()
    },
    formatStoreType: function(row, column) {
      switch (row.storeType) {
        case 0:return '创业店铺'
        case 1: return '实体店'
        case 2: return '餐饮店'
        default: return ''
      }
    },
    formatAuditType: function(row, column) {
      switch (row.audit) {
        case 0:return '草稿'
        case 1: return '待审核'
        case 2: return '已通过'
        case 3: return '已拒绝'
        default: return ''
      }
    },
    handlePass(row) {
      row.audit = 2
      row.storeId = row.id
      editStore(row).then(response => {
        this.handleFilter()
        this.$message({
          message: '审核通过',
          type: 'success'
        })
      })
    },
    handleRepulse() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editStore(this.temp).then(response => {
            this.handleFilter()
            this.$message({
              message: '已拒绝',
              type: 'success'
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEdit(item) {
      this.temp.storeId = item.id
      this.temp.audit = 3
      this.temp.reason = undefined
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
