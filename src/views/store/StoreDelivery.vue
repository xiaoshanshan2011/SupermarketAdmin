<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>配送店铺</el-tag>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="stores" border fit highlight-current-row style="width: 100%">

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
import { getStoreDetails } from '@/api/store'

export default {
  name: 'StoreDelivery',
  data() {
    return {
      listLoading: false,
      id: undefined,
      stores: []
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
      getStoreDetails(this.id).then(response => {
        this.stores = response.data.stores
      })
    }
  }
}
</script>
