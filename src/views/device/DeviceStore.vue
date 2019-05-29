// 绑定设备的店铺
<template>
  <div class="app-container">
    <el-tag style="margin-bottom: 20px">绑定设备的店铺</el-tag>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatStoreType" align="center" label="店铺类型" prop="storeType">
        <!--<template slot-scope="scope" >
          <span>{{ scope.row.storeType }}</span>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="店铺图片">
        <template slot-scope="scope">
          <img :src="scope.row.storeImage" alt="" style="height: 40px">
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺区域">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.city.mergerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店铺地址">
        <template slot-scope="scope">
          <span style="font-size: 13px">{{ scope.row.storeLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人名">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contactsTel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getBindStore } from '@/api/device'

export default {
  name: 'DeviceStore',
  data() {
    return {
      datas: [],
      listLoading: false,
      id: undefined
    }
  },
  created() {
    this.getParams()
    this.findAll()
  },
  methods: {
    getParams() {
      this.id = this.$route.params.id
    },
    findAll() {
      getBindStore(this.id).then(response => {
        this.datas = response.data.list
        for (let i = 0; i < this.datas.length; i++) {
          var members = this.datas[i].members
          for (let j = 0; j < members.length; j++) {
            if (members[j].memberRole === 0) {
              // 店主
              this.datas[i].contactsName = members[j].appUser.name
              this.datas[i].contactsTel = members[j].appUser.tel
              break
            }
          }
          if (this.datas[i].city !== null) {
            this.datas[i].cityCode = this.datas[i].city.id
            this.datas[i].storeArea = this.datas[i].city.mergerName
          }
        }
      })
    }
  }
}
</script>
