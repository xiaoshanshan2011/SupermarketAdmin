// 库存列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.inventoryType" style="width: 120px" class="filter-item" value-key="key" @change="reGetInventoryList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetInventoryList()">搜索</el-button>
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
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" width="200px">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImage" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.goodsImage">
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品编号">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsSn }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品单位">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存类型">
        <template slot-scope="scope">
          <span v-if="scope.row.inventoryType === 0">平台库存 </span>
          <span v-if="scope.row.inventoryType === 1">加盟店库存 </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存数量">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店名">
        <template slot-scope="scope">
          <span v-if="scope.row.storeName">{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店长电话">
        <template slot-scope="scope">
          <span>{{ scope.row.storeTel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品单价(¥)">
        <template slot-scope="scope">
          <span>{{ scope.row.univalence }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      :page-sizes.sync="listQuery.pageSizes"
      @pagination="reGetProduct()"/>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="800px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 650px; margin-left:50px;">

        <el-form-item v-if="dialogStatus==='create'" label="库存类型" prop="inventoryType">
          <el-radio-group v-model="temp.inventoryType">
            <el-radio v-for="item in inventoryTypeList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create' && temp.inventoryType === 1" label="查询店铺" label-width="80px">
          <el-col :span="8">
            <el-input v-model="temp.storeName" placeholder="店铺名" style="width: 190px" />
          </el-col>
          <el-col :span="8">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getStoreList()">搜索</el-button>
          </el-col>

        </el-form-item>
        <el-form-item v-if="dialogStatus==='create' && storeList.length > 0" label="实体店" prop="store">
          <el-radio-group v-model="temp.storeId">
            <el-radio v-for="item in storeList" :label="item.id" :key="item.id">{{ item.storeName }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="dialogStatus==='create'" label="商品名" prop="goods" label-width="80px" >
          <el-select v-model="temp.goodsId" style="width: 190px" class="filter-item" value-key="key">
            <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="商品数量" prop="number" label-width="80px" >
          <el-col :span="8">
            <el-input v-model="temp.number" placeholder="商品数量"/>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?reAddInventory():reEditInventory()">确定</el-button>
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
import { getInventoryList, editInventory, addInventory } from '@/api/inventory'
import { getStoreList } from '@/api/store'
import { getProduct } from '@/api/goods'

export default {
  name: 'GoodsList',
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
        inventoryType: undefined,
        page: 1,
        size: 10,
        pageSizes: [8, 16, 24, 32]
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        number: undefined,
        title: undefined
      },
      rules: {
        number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        inventoryType: [{ required: true, message: '请选择库存类型', trigger: 'blur' }],
        store: [{ required: true, message: '请选择实体店', trigger: 'blur' }],
        goods: [{ required: true, message: '请选择商品', trigger: 'blur' }]
      },
      dialogStatus: undefined,
      inventoryTypeList: [
        {
          id: 0,
          name: '平台库存 '
        },
        {
          id: 1,
          name: '实体店库存'
        }
      ],
      storeList: [],
      goodsList: [],
      sortOptions: [{ label: '全部', key: undefined }, { label: '平台库存 ', key: 0 }, { label: '实体店库存', key: 1 }]
    }
  },
  created() {
    this.reGetInventoryList()
  },
  methods: {
    reGetInventoryList() {
      getInventoryList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.title = '添加库存'
      this.getProductList()
    },
    handleEdit(row) {
      this.dialogStatus = 'edit'
      this.temp.id = row.id
      this.temp.number = row.number
      this.temp.title = '编辑库存'
      this.dialogFormVisible = true
    },
    reAddInventory() {
      addInventory(this.temp).then(response => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
      this.dialogFormVisible = false
      this.reGetInventoryList()
    },
    reEditInventory() {
      editInventory(this.temp).then(response => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.reGetInventoryList()
      })
    },
    getStoreList() {
      this.temp.page = 1
      this.temp.select = 1
      getStoreList(this.temp).then(response => {
        this.storeList = response.data.list
      })
    },
    getProductList() {
      this.temp.page = 1
      this.temp.isDevice = 1
      getProduct(this.temp).then(response => {
        this.goodsList = response.data.list
      })
    }
  }
}
</script>

<style scoped>
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
