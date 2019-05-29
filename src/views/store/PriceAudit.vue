<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请人">
        <template slot-scope="scope">
          <span>{{ scope.row.applyUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="处理人">
        <template slot-scope="scope">
          <span>{{ scope.row.adminUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请设备id">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请的售价">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核" width="180px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="handlePass(scope.row)">通过</el-button>
          <el-button v-if="scope.row.status === 0" type="danger" size="mini" @click="handleEdit(scope.row)">拒绝</el-button>
          <el-button v-if="scope.row.status === -1" type="text" size="mini" style="color: red">审核拒绝</el-button>
          <el-button v-if="scope.row.status === 1" type="text" size="mini">审核通过</el-button>
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
    <el-dialog :title="temp.title" :visible.sync="isShowAuth" width="900px">
      <DeviceFenRun :id="selectId" :city-id="cityId" @closeDilog="closeDilog"/>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { applyList, applyEdit } from '@/api/fenrun'
import DeviceFenRun from '../../components/DeviceFenRun'
// editStore
export default {
  name: 'StoreAudit',
  components: { Pagination, DeviceFenRun },
  data() {
    return {
      total: 0,
      listQuery: {
        size: 8,
        page: 1,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [{ label: '草稿', key: 0 }, { label: '待审核', key: 1 }, { label: '已通过', key: 2 }, { label: '已拒绝', key: 3 }],
      listLoading: false,
      list: [],
      oprationShow: false,
      dialogFormVisible: false,
      temp: {
        id: undefined,
        title: '售价审核',
        reason: undefined,
        status: undefined,
        audit: undefined
      },
      rules: {
        reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
      },
      isShowAuth: false,
      selectId: '',
      cityId: ''
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    closeDilog() {
      this.isShowAuth = false
      this.findAll()
    },
    findAll() {
      applyList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
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
      this.selectId = row.id
      this.cityId = row.cityId
      this.temp.title = '售价审核通过'
      row.audit = 2
      row.storeId = row.id
      this.isShowAuth = true
    },
    // 拒绝
    handleRepulse() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          applyEdit(this.temp).then(response => {
            this.handleFilter()
            this.$message({
              message: '已拒绝',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },
    handleEdit(item) {
      this.temp.id = item.id
      this.temp.status = -1
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
