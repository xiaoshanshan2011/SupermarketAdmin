// 资金账户
<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账户类型">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用资金">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row)">转账</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="700px">
      <el-form v-if="textMap.isShowSearch" ref="searchForm" :rules="rules" :model="textMap">
        <el-form-item label="查询用户" prop="contactsTel" label-width="110px" >
          <el-input v-model="textMap.contactsTel" style="width: 250px" placeholder="请输入手机号码" maxlength="11" @input.native="getUserList(1)"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="textMap.isShowEdit" ref="dataForm" :rules="rules2" :model="textMap">
        <el-form-item v-if="textMap.isShowSearch" label="姓名" label-width="110px">
          <el-input v-model="textMap.appUserdatas.name" style="width: 130px" disabled="true"/>
        </el-form-item>
        <el-form-item label="金额" prop="money" label-width="110px" >
          <el-input v-model="textMap.money" style="width: 250px" placeholder="请输入转账金额" maxlength="11" @input.native="getUserList(2)"/>
        </el-form-item>
      </el-form>
      <div v-if="textMap.isShowEdit" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="reBalanceTransfer()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getUserList, balanceTransfer } from '@/api/finance'
import { getAppUser } from '@/api/agent'
export default {
  name: 'MoneyUserList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: '转账',
        isShowSearch: false,
        contactsTel: '',
        isShowEdit: false,
        sourceUserId: undefined, // 转账人id
        toUserId: undefined, // 被转账人
        appUserdatas: undefined,
        money: undefined
      },
      rules: {
        contactsTel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      rules2: {
        money: [{ required: true, message: '请输入转账金额', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    // 转账
    reBalanceTransfer() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          balanceTransfer(this.textMap).then(response => {
            this.$message({
              message: '转账成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.listQuery.storeName = undefined
            this.listQuery.contactsTel = undefined
            this.handleSearch()
          })
        }
      })
    },
    inputChange(type) {
      this.$nextTick(() => {
        if (type === 1 && this.textMap.contactsTel) {
          this.textMap.contactsTel = this.textMap.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        } else if (type === 2 && this.textMap.contactsTel) {
          this.textMap.contactsTel = this.textMap.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
      })
    },
    handleSearchUser() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          getAppUser(this.textMap).then(response => {
            this.textMap.isShowEdit = true
            this.textMap.appUserdatas = response.data
            this.textMap.toUserId = response.data.id
          }).catch(error => {
            console.log(error)
            this.textMap.isShowEdit = false
          })
        }
      })
    },
    handleCreate(row) {
      this.textMap.appUserdatas = undefined
      this.textMap.money = undefined
      this.textMap.contactsTel = undefined
      this.textMap.isShowEdit = false
      this.textMap.sourceUserId = row.id
      this.textMap.create = '转账'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.isShowSearch = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    findAll() {
      this.listLoading = true
      getUserList().then(response => {
        this.listLoading = false
        this.list = response.data.list
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
