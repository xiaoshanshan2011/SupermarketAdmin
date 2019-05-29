// 合伙人列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.userType" style="width: 140px" class="filter-item" @change="findAll">
        <el-option v-for="item in sortOptions" :key="item.roleCode" :label="item.chineseName" :value="item.roleCode"/>
      </el-select>
      <el-input v-model="listQuery.tel" placeholder="手机号码" style="width: 130px;" class="filter-item"/>
      <el-input v-model="listQuery.name" placeholder="用户名" style="width: 130px;" class="filter-item"/>
      <el-input v-model="listQuery.idNumber" placeholder="身份账号" style="width: 160px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findAll">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.appUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.appUserTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份账号">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件正面">
        <template slot-scope="scope">
          <img :src="scope.row.identityImage1" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.identityImage1">
        </template>
      </el-table-column>
      <el-table-column align="center" label="证件反面">
        <template slot-scope="scope">
          <img :src="scope.row.identityImage2" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.identityImage2">
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reFindUser" />

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="600px">
      <el-form v-if="temp.dialogStatus === 'create'" ref="companyTelForm" :rules="rules" :model="temp">
        <el-form-item label="用户类型" label-width="100px" prop="roleCode">
          <el-select v-model="temp.roleCode" disabled style="width: 150px" class="filter-item" value-key="key" @change="resetData()">
            <el-option v-for="item in sortOptions" :key="item.roleCode" :label="item.chineseName" :value="item.roleCode"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.roleCode === 1005" label="查询代理" label-width="100px" prop="contactsTel">
          <el-input v-model="temp.contactsTel" style="width: 250px" placeholder="请输入手机号码"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
        <el-form-item v-else label="查询用户" label-width="100px" prop="contactsTel">
          <el-input v-model="temp.contactsTel" style="width: 250px" placeholder="请输入手机号码"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-form v-if="temp.ispresent">
        <el-form-item v-if="temp.dialogStatus === 'create'" label="合伙人" label-width="100px">
          <el-input v-model="temp.name" style="width: 250px" disabled="true"/>
        </el-form-item>
        <el-form-item label="描述" label-width="100px">
          <el-input v-model="temp.description" style="width: 250px"/>
        </el-form-item>
      </el-form>
      <div v-if="temp.ispresent" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="temp.dialogStatus==='create'?reCreatePartner():editData()">确定</el-button>
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
import { getPartnerList, getPartnerTypeList, createPartner, editPartner } from '@/api/partner'
import { getAppUser, getAgentList2 } from '@/api/agent'
export default {
  name: 'ProductList',
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
        page: 1,
        size: 8,
        tel: undefined,
        name: undefined,
        idNumber: undefined,
        userType: undefined,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [],
      temp: {
        title: undefined,
        dialogStatus: undefined,
        agentId: undefined,
        appUserId: undefined,
        description: undefined,
        roleCode: undefined,
        contactsTel: undefined,
        ispresent: undefined,
        name: undefined
      },
      dialogFormVisible: false,
      rules: {
        roleCode: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
        contactsTel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'temp.contactsTel': function(newVal) {
      this.temp.ispresent = false
    }
  },
  created() {
    this.findType()
  },
  methods: {
    // 查询所有用户
    findAll() {
      this.listLoading = true
      getPartnerList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      })
    },
    // 查询所有用户
    findType() {
      getPartnerTypeList().then(response => {
        this.sortOptions = response.data.list
        if (this.sortOptions.length > 0) {
          this.listQuery.userType = this.sortOptions[0].roleCode
          this.findAll()
        }
      })
    },
    // 查询用户
    handleSearchUser() {
      this.$refs['companyTelForm'].validate((valid) => {
        if (valid) {
          getAppUser(this.temp).then(response => {
            this.temp.appUserId = response.data.id
            this.temp.name = response.data.name
            if (this.temp.roleCode === 1005) {
              this.handleSearchAgent()
            } else {
              this.temp.ispresent = true
            }
          }).catch(error => {
            console.log(error)
            this.temp.ispresent = false
          })
        }
      })
    },
    // 查询代理
    handleSearchAgent() {
      this.$refs['companyTelForm'].validate((valid) => {
        if (valid) {
          getAgentList2(this.temp.contactsTel).then(response => {
            if (response.data.list.length > 0) {
              this.temp.ispresent = true
              this.temp.agentId = response.data.list[0].id
            } else {
              this.temp.ispresent = false
              this.$message({
                message: '代理不存在',
                type: 'error'
              })
            }
          }).catch(error => {
            console.log(error)
            this.temp.ispresent = false
          })
        }
      })
    },
    // 创建合伙人
    reCreatePartner() {
      this.listLoading = true
      createPartner(this.temp).then(response => {
        this.listLoading = false
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.findAll()
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    // 编辑合伙人
    editData() {
      this.listLoading = true
      editPartner(this.temp).then(response => {
        this.listLoading = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.findAll()
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    // 删除合伙人
    deleteData(item) {
      this.listLoading = true
      this.temp.description = undefined
      this.temp.id = item.id
      this.temp.deleted = 1
      this.temp.roleCode = this.listQuery.userType
      editPartner(this.temp).then(response => {
        this.listLoading = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.findAll()
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleCreate() {
      this.temp.title = '创建合伙人'
      this.temp.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.id = undefined
      this.temp.description = undefined
      this.temp.deleted = undefined
      this.temp.ispresent = false
      this.temp.roleCode = this.listQuery.userType
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.ispresent = true
      this.temp.title = '编辑备注'
      this.temp.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.id = item.id
      this.temp.description = item.description
      this.temp.deleted = undefined
      this.temp.roleCode = this.listQuery.userType
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetData() {
      this.temp.ispresent = false
      this.temp.contactsTel = undefined
    }
  }
}
</script>

<style scoped>

</style>
