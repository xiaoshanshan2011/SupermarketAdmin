<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.deviceId" placeholder="设备id" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备id">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">初始化</span>
          <span v-if="scope.row.status === 1">正常使用</span>
          <span v-if="scope.row.status === 2">故障待维修</span>
          <span v-if="scope.row.status === 3">正在检修</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市区域">
        <template slot-scope="scope">
          <span style="font-size: 12px">{{ scope.row.cityCode.mergerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="绑定状态">
        <template slot-scope="scope">
          <span v-if="scope.row.bindStatus === 0">未绑定</span>
          <span v-if="scope.row.bindStatus === 1">已绑定</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推送Id">
        <template slot-scope="scope">
          <span v-if="scope.row.jgUser">{{ scope.row.jgUser.registrationId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出厂日期">
        <template slot-scope="scope">
          <span>{{ scope.row.releaseDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <!--<template slot-scope="scope">
          <span>{{ scope.row.gmtModified }}</span>
        </template>-->
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModified | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button v-if="scope.row.bindStatus === 1" type="success" size="mini" @click="toDeviceStore(scope.row)">
            查看绑定店铺
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes.sync="listQuery.pageSizes"
      @pagination="findAll"/>

    <el-dialog :title="temp.create" :visible.sync="dialogFormVisible" width="700px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="城市区域" prop="cityCode" label-width="80px">
          <el-select v-model="temp.select1" style="width: 100px" class="filter-item" value-key="key" @change="reGetCity(2)">
            <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
          </el-select>
          <el-select v-model="temp.select2" style="width: 100px" class="filter-item" value-key="key" @change="reGetCity(3)">
            <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
          </el-select>
          <el-select v-model="temp.select3" style="width: 100px" class="filter-item" value-key="key" @change="reGetCity(4)">
            <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeId" label-width="80px">
          <el-select v-model="temp.deviceTypeId" style="width: 120px" class="filter-item" value-key="key">
            <el-option v-for="item in deviceTypes" :key="item.id" :label="item.typeName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备Id" prop="deviceId" label-width="80px">
          <el-input v-model="temp.deviceId" style="width: 250px" clearable/>
        </el-form-item>
        <el-form-item label="出厂日期" prop="releaseDate" label-width="80px">
          <el-date-picker v-model="temp.releaseDate" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <!--<el-form-item label="出厂日期" prop="releaseDate" label-width="80px">
          <el-input v-model="temp.releaseDate" style="width: 250px"/>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceList, getDeviceTypeList, createDevice, editDevice } from '@/api/device'
import Pagination from '@/components/Pagination'
import { formatDate } from '../../utils/utils' // Secondary package based on el-pagination
import { getCity } from '@/api/agent'

export default {
  name: 'Device',
  components: { Pagination },
  data() {
    return {
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      datas: [],
      deviceTypes: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 8,
        pageSizes: [8, 16, 24, 32],
        deviceId: undefined
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        update: 'Edit',
        create: '创建设备',
        cityCode: '',
        deviceId: '',
        hardwareVersion: '',
        softwareVersion: '',
        deviceTypeId: '',
        releaseDate: new Date(),
        levelType: undefined,
        parentId: 100000,
        select1: undefined,
        select2: undefined,
        select3: undefined,
        id: undefined
      },
      rules: {
        deviceId: [{ required: true, message: '请输入设备Id', trigger: 'blur' }],
        deviceTypeId: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        releaseDate: [{ required: true, message: '请选择出厂日期', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请选择城市区域', trigger: 'blur' }]
      },
      clickItem: undefined
    }
  },
  created() {
    this.findAll()
    this.reGetCity(1)
    this.findDeviceTypeList()
  },
  methods: {
    // 跳转到成员
    toDeviceStore(item) {
      this.clickItem = item
      this.$router.push({
        path: 'devicestore',
        name: 'DeviceStore',
        params: {
          id: this.clickItem.id
        }
      })
    },
    findAll() {
      getDeviceList(this.listQuery).then(response => {
        this.total = response.data.total
        this.datas = response.data.list
      })
    },
    findDeviceTypeList() {
      getDeviceTypeList({}).then(response => {
        this.deviceTypes = response.data.list
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.datas = []
      this.findAll()
    },
    handleCreate() {
      this.temp.create = '创建设备'
      this.dialogStatus = 'create'
      this.temp.parentId = 100000
      this.dialogFormVisible = true
      this.sortOptionsShi = []
      this.sortOptionsQu = []
      this.temp.select1 = undefined
      this.temp.select2 = undefined
      this.temp.select3 = undefined
      this.temp.cityCode = undefined
      this.temp.deviceTypeId = undefined
      this.temp.deviceId = undefined
      this.temp.releaseDate = new Date()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.temp.create = '编辑设备'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.deviceId = row.deviceId
      this.temp.deviceTypeId = row.deviceType.id
      this.temp.releaseDate = new Date(row.releaseDate)
      this.temp.cityCode = row.cityCode.id
      this.temp.id = row.id
      this.sortOptionsShi = []
      this.sortOptionsQu = []
      this.reEditGetCity(row.cityCode.id, row.cityCode.parentId, row.cityCode.levelType)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
        this.temp.parentId = this.temp.select1
        this.temp.cityCode = this.temp.select1
      } else if (level === 3) {
        this.sortOptionsQu = undefined
        this.temp.select3 = undefined
        this.temp.parentId = this.temp.select2
        this.temp.cityCode = this.temp.select2
      } else if (level === 4) {
        this.temp.cityCode = this.temp.select3
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
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.releaseDate = formatDate(this.temp.releaseDate, 'yyyy-MM-dd hh:mm:ss')
          createDevice(this.temp).then(response => {
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
      if (!this.temp.deviceId) {
        this.$message({
          message: '请输入必填项',
          type: 'error'
        })
        return
      }
      console.log(this.temp.releaseDate)
      this.temp.releaseDate = formatDate(this.temp.releaseDate, 'yyyy-MM-dd hh:mm:ss')
      editDevice(this.temp).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.findAll()
      })
    }
  }
}
</script>

<style scoped>
</style>
