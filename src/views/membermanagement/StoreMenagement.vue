<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tag>名下店铺</el-tag>
    </div>
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
          <span style="font-size: 13px">{{ scope.row.storeArea }}</span>
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
import { getStoreList } from '@/api/store'

import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Department',
  components: { Pagination },
  data() {
    return {
      cityCode: {
        select1: undefined,
        select2: undefined,
        select3: undefined
      },
      datas: [],
      // sortOptions: [{ label: '全部店铺', key: undefined }, { label: '创业店铺', key: 0 }, { label: '实体店', key: 1 }, { label: '餐饮店', key: 2 }],
      // storeTypeOptions: [{ label: '创业店铺', key: 0 }, { label: '实体店', key: 1 }, { label: '餐饮店', key: 2 }],
      sortOptions: [{ label: '全部店铺', key: undefined }, { label: '实体店', key: 1 }, { label: '餐饮店', key: 2 }],
      storeTypeOptions: [{ label: '实体店', key: 1 }, { label: '餐饮店', key: 2 }],
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      total: 10,
      listQuery: {
        page: 1,
        limit: 9,
        select: undefined,
        storeName: undefined,
        contactsTel: undefined,
        appUserId: undefined,
        pageSizes: [9, 18, 27, 36]
      },
      listLoading: false,
      appuserListLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建店铺',
        parentId: 100000,
        storeId: undefined,
        levelType: 1,
        storeName: '',
        companyTel: '',
        contactsTel: '',
        storeLocation: '',
        cityCode: undefined,
        storeType: 0,
        appUserdatas: undefined,
        isShowSearch: false,
        isShowEdit: false
      },
      rules: {
        contactsTel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      rules2: {
        storeType: [{ required: true, message: '请选择店铺类型', trigger: 'blur' }],
        storeName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        storeLocation: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getParams()
    this.findAll()
  },
  methods: {
    getParams() {
      this.listQuery.appUserId = this.$route.params.appUserId
    },
    findAll() {
      this.datas = []
      getStoreList(this.listQuery).then(response => {
        var dataList = response.data.list
        this.total = response.data.total
        for (var i = 0; i < dataList.length; i++) {
          var temp = {}
          var members = dataList[i].members
          temp.id = dataList[i].id
          temp.storeName = dataList[i].storeName
          temp.storeType = dataList[i].storeType
          temp.storeImage = dataList[i].storeImage
          if (dataList[i].city !== null) {
            temp.cityCode = dataList[i].city.id
            temp.storeArea = dataList[i].city.mergerName
          }
          temp.gmtCreate = dataList[i].gmtCreate

          temp.storeLocation = dataList[i].storeLocation
          for (var j = 0; j < members.length; j++) {
            if (members[j].memberRole === 0) {
              // 店主
              temp.contactsName = members[j].appUser.name
              temp.contactsTel = members[j].appUser.tel
            }
          }

          this.datas.push(temp)
        }
      })
    },
    formatStoreType: function(row, column) {
      switch (row.storeType) {
        case 0:return '创业店铺'
        case 1: return '实体店'
        case 2: return '餐饮店'
        default: return ''
      }
    }
  }
}
</script>
