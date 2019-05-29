<!--实名审核-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tel" placeholder="电话" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;" class="filter-item"/>
      <el-select v-model="listQuery.select" style="width: 100px" class="filter-item" value-key="key" @change="handleFilter()">
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

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证正面">
        <template slot-scope="scope">
          <img :src="scope.row.identityImage1" alt="" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.identityImage1">
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证反面">
        <template slot-scope="scope">
          <img :src="scope.row.identityImage2" alt="" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.identityImage2">
        </template>
      </el-table-column>
      <el-table-column :formatter="formatAuditType" align="center" label="审核状态" prop="audit"/>
      <el-table-column v-if = "oprationShow" align="center" label="审核" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePass(scope.row)">通过</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="handleFilter"/>
    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="拒绝原因" prop="description">
          <el-input v-model="temp.description"/>
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
import { getauditList, auditAppUser } from '@/api/appuser'

export default {
  name: 'RealNameAudit',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      list: [],
      oprationShow: undefined,
      listLoading: false,
      sortOptions: [{ label: '待审核', key: 0 }, { label: '已通过', key: 1 }, { label: '已拒绝', key: 2 }],
      total: 0,
      listQuery: {
        page: 1,
        limit: 8,
        importance: undefined,
        title: undefined,
        type: undefined,
        name: undefined,
        tel: undefined,
        sort: 1,
        select: 0,
        pageSizes: [8, 16, 24, 32]
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        title: '实名审核',
        description: undefined,
        audit: undefined
      },
      rules: {
        description: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    /* edit(row) {
      console.log(row.name)
    },*/
    formatAuditType: function(row, column) {
      switch (row.audit) {
        case 0:return '待审核'
        case 1: return '已通过'
        case 2: return '已拒绝'
        default: return ''
      }
    },
    handlePass(row) {
      row.audit = 1
      auditAppUser(row).then(response => {
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
          auditAppUser(this.temp).then(response => {
            this.handleFilter()
            this.dialogFormVisible = false
            this.$message({
              message: '已拒绝',
              type: 'success'
            })
          })
        }
      })
    },
    handleFilter() {
      if (this.listQuery.select === 0) {
        this.oprationShow = true
      } else {
        this.oprationShow = false
      }
      this.list = []
      getauditList(this.listQuery).then(response => {
        this.list = response.data.list
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].serialNumber = i + 1 + ((this.listQuery.page - 1) * this.listQuery.limit)
          if (response.data.list[i].identityImage != null) {
            var identytyImages = response.data.list[i].identityImage.split(',')
            this.list[i].identityImage1 = identytyImages[0]
            this.list[i].identityImage2 = identytyImages[1]
          }
        }
        this.total = response.data.total
      })
    },
    handleEdit(item) {
      this.temp.id = item.id
      this.temp.audit = 2
      this.temp.description = undefined
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
