// 商品列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.provinceid" style="width: 120px" class="filter-item" value-key="key" placeholder="选择省" @change="provinceChange2()">
        <el-option v-for="item in searchProvinceidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
      </el-select>
      <el-select v-show="searchCityidList.length>0" v-model="listQuery.cityid" style="width: 120px" class="filter-item" value-key="key" placeholder="选择市" @change="cityChange2()">
        <el-option v-for="item in searchCityidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
      </el-select>
      <el-select v-show="searchDistrictidList.length>0" v-model="listQuery.districtid" style="width: 120px" class="filter-item" value-key="key" placeholder="选择县/区" @change="districtChange2()">
        <el-option v-for="item in searchDistrictidList" :key="item.areaid" :label="item.areaname" :value="item.areaid"/>
      </el-select>
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

      <el-table-column align="center" label="仓库图片" width="130px">
        <template slot-scope="scope">
          <img :src="scope.row.warehouseimg" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.warehouseimg">
        </template>
      </el-table-column>

      <el-table-column align="center" label="仓库名称">
        <template slot-scope="scope">
          <span v-if="scope.row.warehousename.length <= 10">{{ scope.row.warehousename }}</span>
          <span v-else>{{ scope.row.warehousename.substr(0, 10) }}...</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="仓库编号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.warehousesn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="仓库地址">
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
      <el-table-column align="center" label="操作" width="280px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookWarehouseUser(scope.row.warehouseid)">仓库成员</el-button>
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
        <el-form-item label="仓库名称" prop="warehousename">
          <el-input v-model="temp.warehousename" placeholder="仓库名称"/>
        </el-form-item>
        <el-form-item label="仓库图片" prop="warehouseimg">
          <el-input v-model="temp.warehouseimg" placeholder="仓库图片"/>
        </el-form-item>
        <el-form-item label="仓库编号" prop="warehousesn">
          <el-input v-model="temp.warehousesn" placeholder="仓库编号"/>
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
        <el-form-item label="仓库描述">
          <el-input v-model="temp.warehousedesc" placeholder="仓库描述"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?reAddGoods():reEditGoods()">确定</el-button>
      </div>
    </el-dialog>

    <!--仓库成员 start -->
    <el-dialog :visible.sync="warehouseUserVisible" title="仓库成员" width="900px">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreateChild()">添加成员</el-button>
      </div>
      <el-table v-loading="listLoading" :data="warehouseUserList" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" label="序号" width="100px">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户图片" width="130px">
          <template slot-scope="scope">
            <img :src="scope.row.warehouseUser.userphoto" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.warehouseUser.userphoto">
          </template>
        </el-table-column>

        <el-table-column align="center" label="用户名称">
          <template slot-scope="scope">
            <span>{{ scope.row.warehouseUser.username }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户类型">
          <template slot-scope="scope">
            <div v-if="scope.row.warehouseUser.warehouseUserRelevance">
              <span v-if="scope.row.warehouseUser.warehouseUserRelevance.usertype === 1">仓库管理员</span>
              <span v-else-if="scope.row.warehouseUser.warehouseUserRelevance.usertype === 2">配送员</span>
              <span v-else-if="scope.row.warehouseUser.warehouseUserRelevance.usertype === 3">采购员</span>
            </div>
            <div v-else>无</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户昵称">
          <template slot-scope="scope">
            <span v-if="scope.row.warehouseUser.nickname.length <= 10">{{ scope.row.warehouseUser.nickname }}</span>
            <span v-else>{{ scope.row.warehouseUser.nickname.substr(0, 10) }}...</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="手机号码">
          <template slot-scope="scope">
            <span>{{ scope.row.warehouseUser.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="reWarehouseUserDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
    <!--仓库成员 end -->

    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { insertWarehouse, selectWarehouse, updateWarehouse, deleteWarehouse, selectWarehouseUserRelevance, deleteWarehouseUserRelevance } from '@/api/warehouse'
import { findArea } from '@/api/area'

export default {
  name: 'WarehouseList',
  components: { Pagination },
  data() {
    return {
      warehouseUserVisible: false,
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
        pageSizes: [8, 16, 24, 32],
        provinceid: undefined,
        cityid: undefined,
        districtid: undefined
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        title: undefined,
        warehouseid: undefined,
        warehousename: undefined,
        warehouseimg: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1936054037,928127912&fm=26&gp=0.jpg',
        warehousesn: undefined,
        provinceid: undefined,
        cityid: undefined,
        districtid: undefined,
        address: undefined,
        warehousedesc: undefined
      },
      rules: {
        warehousename: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        warehouseimg: [{ required: true, message: '请上传仓库图片', trigger: 'blur' }],
        warehousesn: [{ required: true, message: '请输入仓库编号', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        warehousedesc: [{ required: true, message: '请输入仓库描述', trigger: 'blur' }],
        districtid: [{ required: true, message: '请选择省市区', trigger: 'blur' }]
      },
      dialogStatus: undefined,
      provinceidList: [],
      cityidList: [],
      districtidList: [],
      searchProvinceidList: [],
      searchCityidList: [],
      searchDistrictidList: [],
      warehouseUserList: [], // 仓库用户
      warehouseid: undefined // 选中的仓库
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
    // 搜索省市区数据
    provinceChange2() {
      if (this.listQuery.provinceid) {
        this.reFindArea2(2, this.listQuery.provinceid)
      }
      this.searchCityidList = []
      this.searchDistrictidList = []
      this.listQuery.cityid = undefined
      this.listQuery.districtid = undefined
      this.search()
    },
    cityChange2() {
      if (this.listQuery.cityid) {
        this.reFindArea2(3, this.listQuery.cityid)
      }
      this.searchDistrictidList = []
      this.listQuery.districtid = undefined
      this.search()
    },
    districtChange2() {
      this.search()
    },
    search() {
      this.listQuery.page = 1
      this.findAll()
    },
    handleCreate() {
      this.temp.title = '添加仓库'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.warehouseid = undefined
      this.temp.warehousename = undefined
      this.temp.warehouseimg = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1936054037,928127912&fm=26&gp=0.jpg'
      this.temp.warehousesn = undefined
      this.temp.provinceid = undefined
      this.temp.cityid = undefined
      this.temp.districtid = undefined
      this.temp.address = undefined
      this.temp.warehousedesc = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑仓库'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.warehouseid = item.warehouseid
      this.temp.warehousename = item.warehousename
      this.temp.warehouseimg = item.warehouseimg
      this.temp.warehousesn = item.warehousesn
      this.temp.provinceid = item.provinceid
      this.temp.cityid = item.cityid
      this.temp.districtid = item.districtid
      this.temp.address = item.address
      this.temp.warehousedesc = item.warehousedesc
      this.reFindArea(2, this.temp.provinceid)
      this.reFindArea(3, this.temp.cityid)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询商品
    findAll() {
      selectWarehouse(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    // 添加仓库
    reAddGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          insertWarehouse(this.temp).then(response => {
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
    // 编辑仓库
    reEditGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateWarehouse(this.temp).then(response => {
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
          var data = response.data
          this.provinceidList = data
          var tempData = [
            {
              areaname: '全部省',
              areaid: undefined
            }
          ]
          this.searchProvinceidList = tempData.concat(data)
        } else if (level === 2) {
          this.cityidList = response.data
        } else if (level === 3) {
          this.districtidList = response.data
        }
      })
    },
    // 获取省市区
    reFindArea2(level, parentId) {
      findArea(parentId).then(response => {
        var tempData = []
        if (level === 2) {
          tempData = [
            {
              areaname: '全部市',
              areaid: undefined
            }
          ]
          this.searchCityidList = tempData.concat(response.data)
        } else if (level === 3) {
          tempData = [
            {
              areaname: '全部县/区',
              areaid: undefined
            }
          ]
          this.searchDistrictidList = tempData.concat(response.data)
        }
      })
    },
    // 删除用户
    reDelete(item) {
      this.listLoading = true
      deleteWarehouse(item.warehouseid).then(response => {
        this.listLoading = false
        this.findAll()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    lookWarehouseUser(warehouseid) {
      this.warehouseid = warehouseid
      this.warehouseUserVisible = true
      this.listLoading = true
      selectWarehouseUserRelevance(warehouseid).then(response => {
        this.listLoading = false
        this.warehouseUserList = response.data
      })
    },
    reWarehouseUserDelete(id) {
      this.listLoading = true
      deleteWarehouseUserRelevance(id).then(response => {
        this.listLoading = false
        this.lookWarehouseUser(this.warehouseid)
      })
    }
  }
}
</script>

<style scoped>
</style>
