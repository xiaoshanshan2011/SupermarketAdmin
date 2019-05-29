<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.select" style="width: 120px" class="filter-item" value-key="key" @change="handleChange()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.storeName" placeholder="店铺名" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.contactsTel" maxlength="11" placeholder="联系人电话" style="width: 200px;" class="filter-item" @input.native="inputChange"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
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
          <img :src="scope.row.storeImage" alt="" style="height: 40px" @click="dialogPictureVisible = true,clickPicture = scope.row.storeImage">
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

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            详情 / 编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="findAll"/>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="700px">
      <el-form v-if="textMap.isShowSearch" ref="searchForm" :rules="rules" :model="textMap">
        <el-form-item label="查询用户" prop="contactsTel" label-width="110px" >
          <el-input v-model="textMap.contactsTel" style="width: 250px" placeholder="请输入手机号码" maxlength="11" @input.native="inputChange"/>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearchUser">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form v-if="textMap.isShowEdit" ref="dataForm" :rules="rules2" :model="textMap">
        <el-form-item v-if="textMap.isShowSearch" label="店铺老板" label-width="110px">
          <el-input v-model="textMap.appUserdatas.name" style="width: 130px" disabled="true"/>
        </el-form-item>
        <el-form-item label="店铺类型" prop="storeType" label-width="110px">
          <el-select v-if="dialogStatus==='create'" v-model="textMap.storeType" style="width: 130px" class="filter-item" value-key="key" @change="handleChange0()">
            <el-option v-for="item0 in storeTypeOptions" :key="item0.key" :label="item0.label" :value="item0.key"/>
          </el-select>
          <el-select v-else v-model="textMap.storeType" disabled style="width: 130px" class="filter-item" value-key="key" @change="handleChange0()">
            <el-option v-for="item0 in storeTypeOptions" :key="item0.key" :label="item0.label" :value="item0.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称" prop="storeName" label-width="110px">
          <el-input v-model="textMap.storeName" style="width: 250px" placeholder="请输入店铺名称"/>
        </el-form-item>
        <!--<el-form-item label="店铺电话" prop="companyTel" label-width="100px">
          <el-input v-model="textMap.storeTel" style="width: 250px"/>
        </el-form-item>-->
        <el-form-item label="城市区域" prop="cityCode" label-width="110px">
          <el-select v-model="cityCode.select1" style="width: 100px" class="filter-item" value-key="key" @change="handleChange1()">
            <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
          </el-select>
          <el-select v-model="cityCode.select2" style="width: 100px" class="filter-item" value-key="key" @change="handleChange2()">
            <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
          </el-select>
          <el-select v-model="cityCode.select3" style="width: 100px" class="filter-item" value-key="key" @change="handleChange3()">
            <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="storeLocation" label-width="110px">
          <el-input v-model="textMap.storeLocation" style="width: 250px" placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="店铺网址" prop="storeLocation" label-width="110px">
          <el-input v-model="textMap.storeLink" style="width: 250px" placeholder="请输入店铺网址"/>
        </el-form-item>
        <el-form-item label="店铺图片" prop="storeImage" label-width="110px">
          <input id="upload" type="file" style="color: transparent" @change="reGetOssToken">
          <img v-if="textMap.storeImage" :src="textMap.storeImage" style="width: 150px;height: 150px;display: block;">
        </el-form-item>
        <el-form-item v-if="textMap.storeType !== 1" label="配送店铺" prop="allianceStoreId" label-width="110px">
          <el-select v-model="textMap.allianceStoreId" style="width: 150px" class="filter-item" value-key="key">
            <el-option v-for="item in jiamengData" :key="item.id" :label="item.storeName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'edit'" label-width="0px">
          <div style="display: flex;flex-direction: row;margin-left: 40px">
            <el-button type="primary" plain @click="toStoreMembers">店内成员</el-button>
            <el-button type="primary" plain @click="toStoreDevices">店内设备</el-button>
            <el-button v-if="textMap.storeType === 1" type="primary" plain @click="toStoreDelivery">配送店铺</el-button>
            <el-button type="primary" plain @click="toStoreFenrun">设置分润</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div v-if="textMap.isShowEdit" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
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

import { getCity, getAppUser } from '@/api/agent'
import { getStoreList, getStoreList2, createStore, editStore } from '@/api/store'
import { getWebOssToken } from '@/api/upload'
import { getFromData } from '@/utils/OssUtils'
import axios from 'axios'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Department',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
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
        pageSizes: [9, 18, 27, 36]
      },
      listQuery2: {
        storeType: 1, // 实体店
        cityId: undefined
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
        storeType: 1,
        appUserdatas: undefined,
        isShowSearch: false,
        isShowEdit: false,
        allianceStoreId: undefined,
        storeImage: undefined,
        storeLink: undefined,
        isResetAllianceStoreId: false
      },
      rules: {
        contactsTel: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      rules2: {
        storeType: [{ required: true, message: '请选择店铺类型', trigger: 'blur' }],
        storeName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        storeLocation: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        storeImage: [{ required: true, message: '请选择店铺图片', trigger: 'blur' }],
        allianceStoreId: [{ required: true, message: '请选择配送店铺', trigger: 'blur' }]
      },
      jiamengData: [],
      clickItem: undefined
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    // 跳转到成员
    toStoreMembers() {
      this.$router.push({
        path: 'storemembers',
        name: 'StoreMembers',
        params: {
          id: this.clickItem.id
        }
      })
    },
    // 跳转到店铺分润
    toStoreFenrun() {
      var data = {
        id: this.clickItem.id,
        storeName: this.clickItem.storeName
      }
      this.$router.push({
        path: 'storefenrun',
        name: 'StoreFenrun',
        params: { data: JSON.stringify(data) }
      })
    },
    // 跳转到设备
    toStoreDevices() {
      this.$router.push({
        path: 'storedevices',
        name: 'StoreDevices',
        params: {
          id: this.clickItem.id
        }
      })
    },
    // 跳转到配送店铺
    toStoreDelivery() {
      this.$router.push({
        path: 'storedelivery',
        name: 'StoreDelivery',
        params: {
          id: this.clickItem.id
        }
      })
    },
    inputChange() {
      this.$nextTick(() => {
        if (this.listQuery.contactsTel) {
          this.listQuery.contactsTel = this.listQuery.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
        if (this.textMap.contactsTel) {
          this.textMap.contactsTel = this.textMap.contactsTel.replace(/[^\d]/g, '') // 清除"数字"以外的字符
        }
      })
    },
    reGetOssToken() {
      const files = document.getElementById('upload')
      if (files.files) {
        const fileLen = document.getElementById('upload').files
        for (let i = 0; i < fileLen.length; i++) {
          const file = fileLen[i]
          getWebOssToken().then(response => {
            var result = response.data
            var fromData = getFromData(result, file)
            return new Promise((resolve, reject) => {
              axios({
                url: result.host,
                method: 'post',
                data: fromData,
                headers: { 'Content-Type': 'multipart/form-data' }
              })
                .then((res) => {
                  this.textMap.storeImage = result.host + '/' + fromData.get('key')
                })
            })
          })
        }
      }
    },
    findAll() {
      getStoreList(this.listQuery).then(response => {
        this.datas = response.data.list
        this.total = response.data.total
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
    },
    // 查询加盟店
    findAll2() {
      getStoreList2(this.listQuery2).then(response => {
        this.jiamengData = response.data.list
        if (this.textMap.isResetAllianceStoreId) {
          this.textMap.allianceStoreId = undefined
        } else {
          this.textMap.isResetAllianceStoreId = true
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
    },
    handleSearchUser() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          getAppUser(this.textMap).then(response => {
            this.textMap.isShowEdit = true
            this.textMap.appUserdatas = response.data
          }).catch(error => {
            console.log(error)
            this.textMap.isShowEdit = false
          })
        }
      })
    },
    handleChange() {
      this.handleSearch()
    },
    handleChange0() {
      if (this.listQuery2.cityId) {
        this.findAll2()
      }
    },
    handleChange1() {
      this.textMap.parentId = this.cityCode.select1
      this.listQuery2.cityId = this.cityCode.select1
      this.textMap.levelType = 2
      this.cityCode.select2 = undefined
      this.cityCode.select3 = undefined
      this.textMap.cityCode = undefined
      getCity(this.textMap).then(response => {
        this.sortOptionsShi = response.data
      })
      if (this.textMap.storeType !== 1) {
        this.findAll2()
      }
    },
    handleChange2() {
      this.textMap.parentId = this.cityCode.select2
      this.textMap.levelType = 3
      this.cityCode.select3 = undefined
      this.textMap.cityCode = undefined
      getCity(this.textMap).then(response => {
        this.sortOptionsQu = response.data
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
      this.textMap.contactsTel = undefined
      this.textMap.isShowSearch = true
      this.textMap.isShowEdit = false
      this.textMap.create = '创建店铺'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.storeName = undefined
      this.textMap.storeLocation = undefined
      this.textMap.storeId = undefined
      this.textMap.cityCode = undefined
      this.textMap.appUserdatas = undefined
      this.textMap.storeImage = undefined
      this.textMap.allianceStoreId = undefined
      this.textMap.storeLink = undefined
      this.textMap.parentId = 100000
      this.textMap.levelType = 1
      this.textMap.storeType = 1
      this.cityCode.select1 = undefined
      this.cityCode.select2 = undefined
      this.cityCode.select3 = undefined
      this.listQuery2.cityId = undefined
      this.jiamengData = []
      getCity(this.textMap).then(response => {
        this.sortOptionsShen = response.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.clickItem = row
      this.jiamengData = []
      this.textMap.isShowSearch = false
      this.textMap.isShowEdit = true
      this.textMap.create = '详情 / 编辑'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.storeName = row.storeName
      this.textMap.storeImage = row.storeImage
      this.textMap.storeLink = row.storeLink
      this.textMap.storeLocation = row.storeLocation
      this.textMap.storeId = row.id
      this.textMap.cityCode = row.cityCode
      this.textMap.isResetAllianceStoreId = false
      this.textMap.allianceStoreId = row.affiliateStoreId
      this.textMap.parentId = 100000
      this.textMap.levelType = 1
      getCity(this.textMap).then(response => {
        this.sortOptionsShen = response.data
      })
      this.cityCode.select1 = parseInt(this.textMap.cityCode / 10000) * 10000
      this.textMap.parentId = this.cityCode.select1
      if (this.cityCode.select1 !== row.cityCode) {
        this.textMap.levelType = 2
        getCity(this.textMap).then(response => {
          this.sortOptionsShi = response.data
        })
        this.cityCode.select2 = parseInt(this.textMap.cityCode / 100) * 100
        if (this.cityCode.select2 !== row.cityCode) {
          this.textMap.levelType = 3
          this.textMap.parentId = this.cityCode.select2
          getCity(this.textMap).then(response => {
            this.sortOptionsQu = response.data
          })
          this.cityCode.select3 = row.cityCode
        } else {
          this.cityCode.select3 = undefined
        }
      }
      // 查询加盟店
      this.listQuery2.cityId = this.textMap.cityCode
      this.findAll2()
      // this.textMap.levelType = 1
      this.textMap.storeType = row.storeType
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createStore(this.textMap).then(response => {
            this.$message({
              message: '添加成功',
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editStore(this.textMap).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.listQuery.storeName = undefined
            this.listQuery.contactsTel = undefined
            this.handleSearch()
          })
        }
      })
    }
  }
}
</script>
