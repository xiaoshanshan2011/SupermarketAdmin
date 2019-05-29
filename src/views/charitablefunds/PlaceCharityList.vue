// 地方慈善
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.contactMobile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开户人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行名称">
        <template slot-scope="scope">
          <span>{{ scope.row.bankName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="银行卡号">
        <template slot-scope="scope">
          <span>{{ scope.row.bankCard }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户可用资金">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="false" type="danger" icon="el-icon-delete" size="mini" @click="eleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
        <el-form-item label="机构名称" prop="name" label-width="100px">
          <el-input v-model="temp.name" placeholder="机构名称"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="contactMobile" label-width="100px">
          <el-input v-model="temp.contactMobile" placeholder="手机号码"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactTel" label-width="100px">
          <el-input v-model="temp.contactTel" placeholder="联系电话"/>
        </el-form-item>
        <el-form-item label="城市区域" prop="cityId" label-width="100px">
          <el-select v-model="temp.select1" style="width: 100px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity(2)">
            <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
          </el-select>
          <el-select v-model="temp.select2" style="width: 100px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity(3)">
            <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
          </el-select>
          <el-select v-model="temp.select3" style="width: 100px" class="filter-item" value-key="key" placeholder="区/县" @change="reGetCity(4)">
            <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress" label-width="100px">
          <el-input v-model="temp.detailAddress" placeholder="详细地址"/>
        </el-form-item>
        <el-form-item label="开户人姓名" prop="accountName" label-width="100px">
          <el-input v-model="temp.accountName" placeholder="开户人姓名"/>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCard" label-width="100px">
          <el-input v-model="temp.bankCard" placeholder="银行卡号"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():editData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addBeneficence, getBeneficence, editBeneficence, getCity } from '@/api/funds'
export default {
  name: 'PlaceCharityList',
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: undefined,
      dialogFormVisible: false,
      temp: {
        title: undefined,
        id: undefined,
        accountName: undefined,
        bankCard: undefined,
        beneficenceType: 2, // 慈善类型 1:国家慈善, 2:地方慈善
        cityId: undefined,
        contactMobile: undefined,
        contactTel: undefined,
        detailAddress: undefined,
        name: undefined,
        deleted: undefined,
        parentId: 100000, // 父级城市编码
        levelType: 1, // 0:国家，1:省，2:市，3:区
        select1: undefined,
        select2: undefined,
        select3: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        contactMobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        contactTel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        accountName: [{ required: true, message: '请输入开户名称', trigger: 'blur' }],
        bankCard: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }]
      },
      dialogStatus: undefined,
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: []
    }
  },
  created() {
    this.reFind()
    this.reGetCity(1)
  },
  methods: {
    handleCreate() {
      this.temp.title = '添加地方慈善'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.id = undefined
      this.temp.accountName = undefined
      this.temp.bankCard = undefined
      this.temp.cityId = undefined
      this.temp.contactMobile = undefined
      this.temp.contactTel = undefined
      this.temp.detailAddress = undefined
      this.temp.parentId = 100000
      this.temp.name = undefined
      this.temp.deleted = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑地方慈善'
      this.temp.name = item.name
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.id = item.id
      this.temp.accountName = item.accountName
      this.temp.bankCard = item.bankCard
      this.temp.cityId = item.city.id
      this.temp.contactMobile = item.contactMobile
      this.temp.contactTel = item.contactTel
      this.temp.detailAddress = item.detailAddress
      this.temp.name = item.name
      this.temp.deleted = undefined
      this.reEditGetCity(item.city.id, item.city.parentId, 3)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询分类
    reFind() {
      this.temp.beneficenceType = 2 // 慈善类型 1:国家慈善, 2:地方慈善
      getBeneficence(this.temp).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    // 增加分类
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addBeneficence(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.reFind()
          })
        }
      })
    },
    // 编辑分类
    editData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editBeneficence(this.temp).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.reFind()
          })
        }
      })
    },
    // 删除分类
    eleteData(item) {
      this.temp.name = undefined
      this.temp.parentGoodsCatsId = item.id
      this.temp.deleted = 1
      editBeneficence(this.temp).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.reFind()
      })
    },
    // 城市数据
    reGetCity(level) {
      this.temp.levelType = level
      if (level === 2) {
        this.sortOptionsShi = undefined
        this.sortOptionsQu = undefined
        this.temp.select2 = undefined
        this.temp.select3 = undefined
        this.temp.cityId = undefined
        this.temp.parentId = this.temp.select1
      } else if (level === 3) {
        this.sortOptionsQu = undefined
        this.temp.select3 = undefined
        this.temp.cityId = undefined
        this.temp.parentId = this.temp.select2
      } else if (level === 4) {
        this.temp.cityId = this.temp.select3
        return
      }
      getCity(this.temp).then(response => {
        if (this.temp.levelType === 1) {
          this.sortOptionsShen = response.data
        } else if (this.temp.levelType === 2) {
          this.sortOptionsShi = response.data
        } else if (this.temp.levelType === 3) {
          this.sortOptionsQu = response.data
        }
      })
    },

    // 获取城市数据
    reEditGetCity(id, parentId, levelType) {
      this.temp.parentId = parentId
      this.temp.levelType = levelType
      getCity(this.temp).then(response => {
        if (this.temp.levelType === 1) {
          // 省
          this.sortOptionsShen = response.data
          this.temp.select1 = id
        } else if (this.temp.levelType === 2) {
          // 市
          this.sortOptionsShi = response.data
          this.temp.select2 = id
          id = parentId
          parentId = 100000
          levelType = 1
          this.reEditGetCity(id, parentId, levelType)
        } else if (this.temp.levelType === 3) {
          // 区
          this.sortOptionsQu = response.data
          this.temp.select3 = id
          id = parentId
          parentId = parseInt(parentId / 10000) * 10000
          levelType = 2
          this.reEditGetCity(id, parentId, levelType)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

