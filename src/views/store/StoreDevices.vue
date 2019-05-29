<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>店内设备</el-tag>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="devices" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
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

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="updateData(scope.row)">
            解绑
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getStoreDetails } from '@/api/store'
import { editStore } from '@/api/store'

export default {
  name: 'StoreDevices',
  data() {
    return {
      listLoading: false,
      id: undefined,
      devices: [],
      textMap: {
        storeId: undefined, // 店铺归属加盟店铺id
        potatoMachineId: undefined // 解绑指定设备
      }
    }
  },
  created() {
    this.getParams()
    this.findAll()
  },
  methods: {
    getParams() {
      this.id = this.$route.params.id
      this.textMap.storeId = this.$route.params.id
    },
    findAll() {
      getStoreDetails(this.id).then(response => {
        this.devices = response.data.devices
      })
    },
    // 解绑
    updateData(row) {
      this.textMap.potatoMachineId = row.id
      editStore(this.textMap).then(response => {
        this.$router.go(-1) // 返回上一层
        this.$message({
          message: '解绑成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
