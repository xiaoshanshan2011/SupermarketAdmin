// 商品列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="搜索仓库" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户图片" width="130px">
        <template slot-scope="scope">
          <img :src="scope.row.userphoto" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.userphoto">
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型">
        <template slot-scope="scope">
          <div v-if="scope.row.warehouseUserRelevance">
            <span v-if="scope.row.warehouseUserRelevance.usertype === 1">仓库管理员</span>
            <span v-else-if="scope.row.warehouseUserRelevance.usertype === 2">配送员</span>
            <span v-else-if="scope.row.warehouseUserRelevance.usertype === 3">采购员</span>
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属仓库">
        <template slot-scope="scope">
          <div v-if="scope.row.warehouseUserRelevance">
            <span>{{ scope.row.warehouseUserRelevance.warehouse.warehousename }}</span>
          </div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户昵称">
        <template slot-scope="scope">
          <span v-if="scope.row.nickname.length <= 10">{{ scope.row.nickname }}</span>
          <span v-else>{{ scope.row.nickname.substr(0, 10) }}...</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province.areaname }} {{ scope.row.city.areaname }} {{ scope.row.district.areaname }} {{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="reDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes.sync="listQuery.pageSizes"
      @pagination="findAll()"/>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="700px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 550px; margin-left:50px;">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="temp.username" placeholder="仓库名称"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="登录密码" prop="tempPassword">
          <el-input v-model="temp.tempPassword" placeholder="登录密码"/>
        </el-form-item>
        <el-form-item label="用户头像" prop="userphoto">
          <el-input v-model="temp.userphoto" placeholder="用户头像"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="用户昵称"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="手机号码"/>
        </el-form-item>
        <el-form-item label="省市区" prop="districtid">
          <el-select v-model="temp.provinceid" style="width: 120px" class="filter-item" value-key="key" @change="provinceChange()">
            <el-option v-for="item in provinceidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
          </el-select>
          <el-select v-model="temp.cityid" style="width: 120px" class="filter-item" value-key="key" @change="cityChange()">
            <el-option v-for="item in cityidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
          </el-select>
          <el-select v-model="temp.districtid" style="width: 120px" class="filter-item" value-key="key">
            <el-option v-for="item in districtidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="详情地址" prop="address">
          <el-input v-model="temp.address" placeholder="详情地址"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?reAddGoods():reEditGoods()">确定</el-button>
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
import { insertWarehouseUser, selectWarehouseUser, updateWarehouseUser, deleteWarehouseUser } from '@/api/warehouse'
import { findArea } from '@/api/area'
import md5 from 'js-md5'

export default {
  name: 'WarehouseUser',
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
        keyword: undefined,
        page: 1,
        limit: 8,
        classifyid: undefined,
        pclassifyid: undefined,
        pageSizes: [8, 16, 24, 32]
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        title: undefined,
        userid: undefined,
        username: undefined,
        password: undefined,
        tempPassword: undefined,
        nickname: undefined,
        mobile: undefined,
        userphoto: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1936054037,928127912&fm=26&gp=0.jpg',
        provinceid: undefined,
        cityid: undefined,
        districtid: undefined,
        address: undefined
      },
      rules: {
        username: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        tempPassword: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        userphoto: [{ required: true, message: '请上传用户头像', trigger: 'blur' }],
        warehousesn: [{ required: true, message: '请输入仓库编号', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        districtid: [{ required: true, message: '请选择省市区', trigger: 'blur' }]
      },
      dialogStatus: undefined,
      provinceidList: [],
      cityidList: [],
      districtidList: []
    }
  },
  created() {
    this.findAll()
    this.reFindArea(1, -1)
  },
  methods: {
    // 编辑省市区数据
    provinceChange() {
      this.reFindArea(2, this.temp.provinceid)
      this.cityidList = []
      this.districtidList = []
      this.temp.cityid = undefined
      this.temp.districtid = undefined
    },
    cityChange() {
      this.reFindArea(3, this.temp.cityid)
      this.districtidList = []
      this.temp.districtid = undefined
    },
    search() {
      this.listQuery.page = 1
      this.findAll()
    },
    handleCreate() {
      this.temp.title = '添加仓库用户'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.userid = undefined
      this.temp.username = undefined
      this.temp.tempPassword = undefined
      this.temp.nickname = undefined
      this.temp.mobile = undefined
      this.temp.userphoto = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1936054037,928127912&fm=26&gp=0.jpg'
      this.temp.provinceid = undefined
      this.temp.cityid = undefined
      this.temp.districtid = undefined
      this.temp.address = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑仓库用户'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.userid = item.userid
      this.temp.username = item.username
      this.temp.tempPassword = undefined
      this.temp.nickname = item.nickname
      this.temp.mobile = item.mobile
      this.temp.userphoto = item.userphoto
      this.temp.warehousesn = item.warehousesn
      this.temp.provinceid = item.provinceid
      this.temp.cityid = item.cityid
      this.temp.districtid = item.districtid
      this.temp.address = item.address
      this.reFindArea(2, this.temp.provinceid)
      this.reFindArea(3, this.temp.cityid)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询商品
    findAll() {
      selectWarehouseUser(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    // 添加仓库用户
    reAddGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = md5(this.temp.tempPassword)
          insertWarehouseUser(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.listQuery.page = 1
            this.listQuery.keyword = undefined
            this.listQuery.classifyid = undefined
            this.listQuery.pclassifyid = undefined
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },
    // 编辑仓库用户
    reEditGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateWarehouseUser(this.temp).then(response => {
            this.findAll()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      })
    },
    // 获取省市区
    reFindArea(level, parentId) {
      findArea(parentId).then(response => {
        if (level === 1) {
          this.provinceidList = response.data
        } else if (level === 2) {
          this.cityidList = response.data
        } else if (level === 3) {
          this.districtidList = response.data
        }
      })
    },
    // 删除用户
    reDelete(item) {
      this.listLoading = true
      deleteWarehouseUser(item.userid).then(response => {
        this.listLoading = false
        this.findAll()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
