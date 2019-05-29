<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.select" style="width: 120px" class="filter-item" value-key="key" @change="handleChange()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.companyName" placeholder="代理名" style="width: 200px;" class="filter-item" prefix-icon="el-icon-search" clearable/>
      <el-input v-model="listQuery.companyTel" maxlength="11" placeholder="代理电话" style="width: 200px;" class="filter-item" @input.native="inputChange"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理名称">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司电话">
        <template slot-scope="scope">
          <span>{{ scope.row.companyTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理区域" width="230px">
        <template slot-scope="scope">
          <span style="font-size: 12px">{{ scope.row.city.mergerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理类型">
        <template slot-scope="scope">
          <span v-if="scope.row.agentType === 1">省代</span>
          <span v-else-if="scope.row.agentType === 2">市代</span>
          <span v-else>区代</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="dialogVisible = true;agentId = scope.row.id">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="findAll"/>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="companyTelForm" :rules="relRules" :model="textMap">
        <el-form-item label="查询用户" label-width="100px" prop="contactsTel">
          <el-input v-model="textMap.contactsTel" style="width: 250px" placeholder="请输入手机号码" maxlength="11" clearable @input.native="inputChange"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-form v-if="textMap.ispresent" ref="dataForm">
        <el-form-item label="代理名" label-width="100px">
          <el-input v-model="textMap.appUserdatas.name" style="width: 250px" disabled="true"/>
        </el-form-item>
        <el-form-item label="公司电话" label-width="100px">
          <el-input v-model="textMap.appUserdatas.tel" style="width: 250px" disabled="true"/>
        </el-form-item>
        <el-form-item label="代理类型" label-width="100px">
          <el-select v-model="textMap.agentType" style="width: 120px" class="filter-item" value-key="key" @change="resetCity()">
            <el-option v-for="item in sortOptions2" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="textMap.agentType" label="城市区域" prop="contactsTel" label-width="100px">
          <el-select v-model="cityCode.select1" style="width: 100px" class="filter-item" value-key="key" placeholder="省" @change="handleChange1()">
            <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
          </el-select>
          <el-select v-if="textMap.agentType === 2 || textMap.agentType === 3" v-model="cityCode.select2" style="width: 100px" class="filter-item" value-key="key" placeholder="市" @change="handleChange2()">
            <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
          </el-select>
          <el-select v-if="textMap.agentType === 3" v-model="cityCode.select3" style="width: 100px" class="filter-item" value-key="key" placeholder="区/县" @change="handleChange3()">
            <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="textMap.ispresent" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>确定要删除该代理吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAgentList, getCity, getAppUser, createAgent, editAgent, deleteAgent } from '@/api/agent'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Department',
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      agentId: undefined,
      cityCode: {
        select1: undefined,
        select2: undefined,
        select3: undefined
      },
      datas: undefined,
      sortOptions: [{ label: '全部代理', key: undefined }, { label: '省级代理', key: 1 }, { label: '市级代理', key: 2 }, { label: '区级代理', key: 3 }],
      sortOptions2: [{ label: '省级代理', key: 1 }, { label: '市级代理', key: 2 }, { label: '区级代理', key: 3 }],
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      total: 10,
      listQuery: {
        page: 1,
        limit: 10,
        select: undefined,
        companyName: undefined,
        companyTel: undefined
      },
      listLoading: false,
      appuserListLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建代理',
        parentId: 100000,
        levelType: 1,
        companyName: '',
        companyTel: '',
        contactsTel: '',
        cityCode: '',
        ispresent: false,
        appUserdatas: undefined,
        agentType: undefined
      },
      rules: {
        companyName: [{ required: true, message: '代理名称是必须的', trigger: 'blur' }]
      },
      relRules: {
        contactsTel: [{ required: true, message: '请输入联系人电话', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    inputChange() {
      this.$nextTick(() => {
        if (this.listQuery.companyTel) {
          this.listQuery.companyTel = this.listQuery.companyTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
        if (this.textMap.contactsTel) {
          this.textMap.contactsTel = this.textMap.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
      })
    },
    findAll() {
      this.datas = []
      getAgentList(this.listQuery).then(response => {
        this.datas = response.data.list
        this.total = response.data.total
      })
    },
    handleSearchUser() {
      this.$refs['companyTelForm'].validate((valid) => {
        if (valid) {
          getAppUser(this.textMap).then(response => {
            this.textMap.appUserdatas = response.data
            this.textMap.ispresent = true
            this.textMap.agentType = undefined
          }).catch(error => {
            console.log(error)
            this.textMap.ispresent = false
          })
        }
      })
    },
    handleChange() {
      this.handleSearch()
    },
    // 重置城市数据
    resetCity() {
      this.textMap.cityCode = undefined
      this.cityCode.select1 = undefined
      this.cityCode.select2 = undefined
      this.cityCode.select3 = undefined
      getCity(this.textMap).then(response => {
        this.sortOptionsShi = response.data
      })
    },
    handleChange1() {
      this.sortOptionsShi = undefined
      this.sortOptionsQu = undefined
      this.cityCode.select2 = undefined
      this.cityCode.select3 = undefined
      this.textMap.parentId = this.cityCode.select1
      this.textMap.levelType = 2
      getCity(this.textMap).then(response => {
        this.sortOptionsShi = response.data
        if (this.textMap.agentType === 1) {
          this.textMap.cityCode = this.cityCode.select1
        }
      })
    },
    handleChange2() {
      this.sortOptionsQu = undefined
      this.cityCode.select3 = undefined
      this.textMap.parentId = this.cityCode.select2
      this.textMap.levelType = 3
      getCity(this.textMap).then(response => {
        this.sortOptionsQu = response.data
        if (this.textMap.agentType === 2) {
          this.textMap.cityCode = this.cityCode.select2
        }
      })
    },
    handleChange3() {
      this.textMap.cityCode = this.cityCode.select3
    },
    handleSearch() {
      this.listQuery.page = 1
      this.datas = []
      this.findAll()
    },
    handleCreate() {
      this.textMap.ispresent = false
      this.sortOptionsQu = undefined
      this.sortOptionsShen = undefined
      this.sortOptionsShi = undefined
      this.cityCode.select1 = undefined
      this.cityCode.select2 = undefined
      this.cityCode.select3 = undefined
      this.textMap.parentId = 100000
      this.textMap.levelType = 1
      this.textMap.create = '创建代理'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.contactsTel = undefined
      this.textMap.appUserdatas = undefined
      this.textMap.agentType = undefined
      getCity(this.textMap).then(response => {
        this.sortOptionsShen = response.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.sortOptionsShen = undefined
      this.sortOptionsShi = undefined
      this.sortOptionsQu = undefined
      this.textMap.create = '编辑代理'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.companyName = row.companyName
      this.textMap.companyTel = row.companyTel
      this.textMap.contactsTel = row.companyTel
      this.textMap.agentId = row.id
      this.textMap.parentId = 100000
      this.textMap.cityCode = row.cityCode
      this.textMap.levelType = 1
      this.textMap.ispresent = false
      getCity(this.textMap).then(response => {
        this.sortOptionsShen = response.data
      })
      this.cityCode.select1 = parseInt(this.textMap.cityCode / 10000) * 10000
      this.textMap.levelType = 2
      this.textMap.parentId = this.cityCode.select1
      getCity(this.textMap).then(response => {
        this.sortOptionsShi = response.data
      })
      if (this.cityCode.select1 !== row.cityCode) {
        this.cityCode.select2 = parseInt(this.textMap.cityCode / 100) * 100
        this.textMap.levelType = 3
        this.textMap.parentId = this.cityCode.select2
        getCity(this.textMap).then(response => {
          this.sortOptionsQu = response.data
        })
        if (this.cityCode.select2 !== row.cityCode) {
          this.cityCode.select3 = row.cityCode
        } else {
          this.cityCode.select3 = undefined
        }
      } else {
        this.cityCode.select2 = undefined
        this.cityCode.select3 = undefined
      }
      this.textMap.levelType = 1
      getCity(this.textMap).then(response => {
        this.sortOptionsShen = response.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.handleSearchUser()
    },
    createData() {
      if (!this.textMap.agentType) {
        this.$message({
          message: '请选择代理类型',
          type: 'error'
        })
        return
      }
      if (!this.textMap.cityCode) {
        this.$message({
          message: '请选择城市区域',
          type: 'error'
        })
        return
      }
      createAgent(this.textMap).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.handleSearch()
        this.dialogFormVisible = false
      }).catch(error => {
        console.log(error)
        this.$message({
          message: '添加失败',
          type: 'error'
        })
      })
    },
    updateData() {
      if (!this.textMap.companyName) {
        this.$message({
          message: '请输入代理名称',
          type: 'error'
        })
        return
      }
      if (!this.textMap.appUserdatas) {
        this.$message({
          message: '没有查到对应的联系人',
          type: 'error'
        })
        return
      }
      this.dialogFormVisible = false
      editAgent(this.textMap).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.listQuery.companyName = undefined
        this.listQuery.companyTel = undefined
        this.handleSearch()
      })
    },
    deleteData() {
      deleteAgent(this.agentId).then(response => {
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
