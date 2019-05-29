<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加
      </el-button>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{ scope.row.rolename }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.roledesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="330px">
        <template slot-scope="scope">
          <el-button type="info" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row)">删除</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini" @click="reAuthorityList(scope.row)">权限配置</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="textMap"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="rolename" label-width="80px">
          <el-input v-model="textMap.rolename" style="width: 250px" placeholder="角色名称"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roledesc" label-width="80px">
          <el-input v-model="textMap.roledesc" style="width: 250px" placeholder="角色描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="isShowAccessConfiguration" title="权限配置" width="300px">
      <AccessConfiguration :roll-data="rollData" :roll-check-ids="rollCheckIds" :id="checkId" @closeDilog="closeDilog"/>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AccessConfiguration from '../../components/AccessConfiguration'
// import { findRouter } from '@/utils/readrouter'
import { createRole, roleList, editRole, authorityList, deleteRole } from '@/api/system'

export default {
  name: 'Department',
  components: { Pagination, AccessConfiguration },
  data() {
    return {
      datas: [],
      listLoading: false,
      dialogFormVisible: false,
      isShowAccessConfiguration: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建角色',
        roleid: undefined,
        rolename: '',
        deleted: 1,
        roledesc: ''
      },
      rules: {
        rolename: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roledesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      rollData: [],
      rollCheckIds: [],
      checkId: undefined
    }
  },
  created() {
    this.findAll()

    // var data = findRouter()
    //
    // // 上传权限配置
    // updateAuthority(data).then(response => {
    //   console.log('updateAuthority11111111111111111111111111')
    // }).catch(error => {
    //   console.log(error)
    // })
  },
  methods: {
    closeDilog() {
      this.isShowAccessConfiguration = false
    },
    findAll() {
      roleList().then(response => {
        this.datas = response.data
      })
    },
    handleCreate() {
      this.textMap.create = '创建角色'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.rolename = undefined
      this.textMap.roledesc = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.textMap.create = '编辑角色'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.roleid = row.roleid
      this.textMap.rolename = row.rolename
      this.textMap.roledesc = row.roledesc
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.textMap).then(response => {
            this.dialogFormVisible = false
            this.findAll()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    deleteData(row) {
      deleteRole(row.roleid).then(response => {
        this.findAll()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editRole(this.textMap).then(response => {
            this.dialogFormVisible = false
            this.deleteVisible = false
            this.findAll()
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    // 获取角色权限配置
    reAuthorityList(row) {
      authorityList(row.roleid).then(response => {
        this.showAuthorityList(response.data.list, row.roleid)
      }).catch(error => {
        console.log(error)
      })
    },
    // 显示权限配置
    showAuthorityList(data, id) {
      this.checkId = id
      this.rollData = []
      this.rollCheckIds = []
      for (let i = 0; i < data.length; i++) {
        // 获取一级分类
        if (data[i].pAuthNo === '0') {
          this.rollData.push(data[i])
        }
        // 获取非一级分类同时是选中状态
        if (data[i].pAuthNo !== '0' && data[i].checked) {
          this.rollCheckIds.push(data[i].authNo)
        }
      }
      for (let i = 0; i < this.rollData.length; i++) {
        var tempArr = []
        for (let j = 0; j < data.length; j++) {
          if (this.rollData[i].authNo === data[j].pAuthNo) {
            tempArr.push(data[j])
          }
        }
        this.rollData[i].children = tempArr
      }
      this.isShowAccessConfiguration = true
    }
  }
}
</script>

<style scoped>
</style>
