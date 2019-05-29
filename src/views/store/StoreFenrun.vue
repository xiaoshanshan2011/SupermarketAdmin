// 店铺分润
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>店铺分润({{ storeName }})</el-tag>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分润名称">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.appuser.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户id">
        <template slot-scope="scope">
          <span>{{ scope.row.appuser.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户头像">
        <template slot-scope="scope">
          <img :src="scope.row.appuser.icon" alt="" style="height: 40px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.appuser.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分润占比">
        <template slot-scope="scope">
          <span>{{ scope.row.ratio }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑分润</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="dialogVisible = true;clickItem = scope.row">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="700px">
      <el-form v-if="textMap.isShowSearch" ref="searchForm" :rules="rules" :model="textMap">
        <el-form-item label="查询用户" prop="contactsTel" label-width="110px" >
          <el-input v-model="textMap.contactsTel" style="width: 250px" placeholder="请输入手机号码" maxlength="11" @input.native="inputChange"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="textMap.isShowEdit" ref="dataForm" :rules="rules2" :model="textMap">
        <el-form-item v-if="textMap.isShowSearch" label="用户名称" label-width="110px">
          <el-input v-model="textMap.appUserdatas.name" style="width: 130px" disabled/>
        </el-form-item>
        <el-form-item label="分润别名" prop="alias" label-width="110px">
          <el-input v-model="textMap.alias" style="width: 250px" placeholder="请输入店分润别名"/>
        </el-form-item>
        <el-form-item label="分润占比" prop="ratio" label-width="110px">
          <el-input v-model="textMap.ratio" style="width: 250px" placeholder="请输入分润占比"/>
        </el-form-item>
      </el-form>
      <div v-if="textMap.isShowEdit" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>确定要删除该分润吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteData(clickItem)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getAppUser } from '@/api/agent'
import { getFenrunRule, addFenrunPerson, editFenrunPerso } from '@/api/store'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'StoreFenrun',
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      storeName: undefined,
      storeId: undefined,
      clickPicture: undefined,
      dialogPictureVisible: false,
      datas: [],
      listLoading: false,
      appuserListLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建分润',
        storeId: undefined,
        alias: undefined,
        deleted: undefined,
        personFenrunId: undefined,
        personId: undefined,
        ratio: undefined,
        companyTel: '',
        contactsTel: '',
        isShowEdit: false,
        appUserdatas: undefined
      },
      rules: {
        contactsTel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      rules2: {
        storeType: [{ required: true, message: '请选择店铺类型', trigger: 'blur' }],
        storeName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        storeLocation: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        storeImage: [{ required: true, message: '请选择店铺图片', trigger: 'blur' }],
        allianceStoreId: [{ required: true, message: '请选择配送店铺', trigger: 'blur' }]
      },
      jiamengData: [],
      clickItem: undefined
    }
  },
  created() {
    this.getParams()
    this.findAll()
  },
  methods: {
    getParams() {
      var data = JSON.parse(this.$route.params.data)
      this.textMap.storeId = data.id
      this.storeName = data.storeName
    },
    inputChange() {
      this.$nextTick(() => {
        if (this.listQuery.contactsTel) {
          this.listQuery.contactsTel = this.listQuery.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
        if (this.textMap.contactsTel) {
          this.textMap.contactsTel = this.textMap.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
      })
    },
    findAll() {
      getFenrunRule(this.textMap.storeId).then(response => {
        this.datas = response.data.personFenRunRuleList
      })
    },
    handleSearchUser() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          getAppUser(this.textMap).then(response => {
            this.textMap.isShowEdit = true
            this.textMap.appUserdatas = response.data
            this.textMap.personId = response.data.id
          }).catch(error => {
            console.log(error)
            this.textMap.isShowEdit = false
          })
        }
      })
    },
    handleCreate() {
      this.textMap.contactsTel = undefined
      this.textMap.isShowSearch = true
      this.textMap.isShowEdit = false
      this.textMap.create = '创建分润'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.alias = undefined
      this.textMap.deleted = undefined
      this.textMap.personFenrunId = undefined
      this.textMap.personId = undefined
      this.textMap.ratio = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.clickItem = row
      this.textMap.isShowSearch = false
      this.textMap.isShowEdit = true
      this.textMap.create = '编辑分润'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.alias = row.alias
      this.textMap.deleted = undefined
      this.textMap.personFenrunId = row.id
      this.textMap.personId = row.appuser.id
      this.textMap.ratio = row.ratio
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addFenrunPerson(this.textMap).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editFenrunPerso(this.textMap).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },
    deleteData(item) {
      console.log(item.appuser.id)
      this.textMap.deleted = 1
      this.textMap.alias = undefined
      this.textMap.ratio = undefined
      this.textMap.personId = item.appuser.id
      this.textMap.personFenrunId = item.id
      editFenrunPerso(this.textMap).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.findAll()
      })
    }
  }
}
</script>
