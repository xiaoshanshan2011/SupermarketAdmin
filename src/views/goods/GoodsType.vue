// 商品类型列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加一级分类</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleShowChild(scope.row)">添加子类</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="eleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():editData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="temp.title2" :visible.sync="dialogFormVisible2" width="1000px">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreateChild()">添加二级分类</el-button>
      </div>
      <el-table :data="temp.list" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="序号" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="分类名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createtime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="eleteData(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { addType, findType, editType, deleteGoodsClassify } from '@/api/goods'
export default {
  name: 'GoodsType',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: undefined,
      listQuery: {
        parentid: '0'
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      temp: {
        classifyid: undefined,
        title: undefined,
        title2: undefined,
        name: undefined, // 商品分类名
        parentid: undefined, // 父商品分类id
        deleted: undefined, // 删除1
        list: [],
        parentName: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      dialogStatus: undefined
    }
  },
  created() {
    this.reFindType()
  },
  methods: {
    search() {
      this.reFindType()
    },
    handleCreate() {
      this.temp.title = '添加一级分类'
      this.temp.name = undefined
      this.temp.parentid = undefined
      this.temp.deleted = undefined
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.listQuery.parentid = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild() {
      this.temp.title = '添加二级分类'
      this.temp.name = undefined
      this.temp.parentid = this.listQuery.parentid
      this.temp.deleted = undefined
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleShowChild(item) {
      this.temp.title2 = '（' + item.name + '）' + '二级分类'
      this.temp.name = undefined
      this.listQuery.parentid = item.classifyid
      this.temp.deleted = undefined
      this.dialogStatus = 'create'
      this.dialogFormVisible2 = true
      this.reFindType2()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑分类'
      this.temp.name = item.name
      this.temp.classifyid = item.classifyid
      this.temp.deleted = undefined
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询分类
    reFindType() {
      findType(this.listQuery).then(response => {
        this.list = response.data
      })
    },
    // 查询分类
    reFindType2() {
      findType(this.listQuery).then(response => {
        this.temp.list = response.data
      })
    },
    // 增加分类
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addType(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            if (this.dialogFormVisible2) {
              this.reFindType2()
            } else {
              this.reFindType()
            }
          })
        }
      })
    },
    // 编辑分类
    editData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editType(this.temp).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            if (this.dialogFormVisible2) {
              this.reFindType2()
            } else {
              this.reFindType()
            }
          })
        }
      })
    },
    // 删除分类
    eleteData(item) {
      deleteGoodsClassify(item.classifyid).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        if (this.dialogFormVisible2) {
          this.reFindType2()
        } else {
          this.reFindType()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
