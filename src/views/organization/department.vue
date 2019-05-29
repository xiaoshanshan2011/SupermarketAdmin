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

      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门人数">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门描述">
        <template slot-scope="scope">
          <span>{{ scope.row.departmentdesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row)">删除</el-button>
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
        <el-form-item label="部门名称" prop="departmentname" label-width="80px">
          <el-input v-model="textMap.departmentname" style="width: 250px" placeholder="请输入部门名称"/>
        </el-form-item>
        <el-form-item label="部门描述" prop="content" label-width="80px">
          <el-input v-model="textMap.departmentdesc" style="width: 250px" placeholder="请输入部门描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentList, createDepartment, editDepartment, deleteDepartment } from '@/api/department'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Department',
  components: { Pagination },
  data() {
    return {
      datas: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建部门',
        departmentid: '',
        departmentname: '',
        deleted: '',
        departmentdesc: ''
      },
      rules: {
        departmentname: [{ required: true, message: '部门名称是必须的', trigger: 'blur' }],
        content: [{ required: false, message: '部门描述可选填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    findAll() {
      getDepartmentList().then(response => {
        this.datas = response.data
      })
    },
    handleCreate() {
      this.textMap.create = '创建部门'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.departmentname = undefined
      this.textMap.departmentdesc = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.textMap.create = '编辑部门'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.departmentid = row.departmentid
      this.textMap.departmentname = row.departmentname
      this.textMap.departmentdesc = row.departmentdesc
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.handleSearch()
    },
    createData() {
      if (!this.textMap.departmentname) {
        this.$message({
          message: '请输入部门名称',
          type: 'error'
        })
        return
      }
      this.dialogFormVisible = false
      createDepartment(this.textMap).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.findAll()
      })
      this.listQuery.departmentname = undefined
      this.findAll()
    },
    updateData() {
      if (!this.textMap.departmentname) {
        this.$message({
          message: '请输入部门名称',
          type: 'error'
        })
        return
      }
      this.dialogFormVisible = false
      editDepartment(this.textMap).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.findAll()
      })
      this.listQuery.departmentname = undefined
    },
    deleteData(item) {
      deleteDepartment(item.departmentid).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.findAll()
      })
      this.listQuery.departmentname = undefined
    }
  }
}
</script>

<style scoped>
</style>
