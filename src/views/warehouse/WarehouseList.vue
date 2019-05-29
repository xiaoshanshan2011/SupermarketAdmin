// 商品列表
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.pclassifyid" style="width: 120px" class="filter-item" value-key="key" @change="classifyChange(1)">
        <el-option v-for="item in pclassifyids" :key="item.classifyid" :label="item.name" :value="item.classifyid"/>
      </el-select>
      <el-select v-model="listQuery.classifyid" style="width: 120px" class="filter-item" value-key="key" @change="classifyChange(2)">
        <el-option v-for="item in classifyids" :key="item.classifyid" :label="item.name" :value="item.classifyid"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索商品" style="width: 200px;" class="filter-item"/>
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

      <el-table-column align="center" label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.goodsimg" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.picture">
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品名称">
        <template slot-scope="scope">
          <span v-if="scope.row.goodsname.length <= 10">{{ scope.row.goodsname }}</span>
          <span v-else>{{ scope.row.goodsname.substr(0, 10) }}...</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品编号">
        <template slot-scope="scope">
          <span>{{ scope.row.goodscode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品条码">
        <template slot-scope="scope">
          <span>{{ scope.row.barcode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品单位">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsunit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="原价" width="80px">
        <template slot-scope="scope">
          <span>¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员价" width="80px">
        <template slot-scope="scope">
          <span>¥{{ scope.row.vipprice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠价" width="80px">
        <template slot-scope="scope">
          <span>¥{{ scope.row.discountsprice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="特卖价" width="80px">
        <template slot-scope="scope">
          <span>¥{{ scope.row.specialsaleprice }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="批发价" width="80px">
        <template slot-scope="scope">
          <span>¥{{ scope.row.wholesaleprice }}</span>
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
      @pagination="reGetProduct()"/>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="800px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="110px"
        style="width: 650px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='create'" label="商品类型" prop="goodstype">
          <el-radio-group v-model="temp.goodstype" @change="deviceTypeEvent">
            <el-radio v-for="item in isGoodsTypes" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="商品条码" prop="barcode">
              <el-input v-model="temp.barcode" placeholder="商品条码"/>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsname">
              <el-input v-model="temp.goodsname" placeholder="商品名称"/>
            </el-form-item>
            <el-form-item label="商品单位" prop="goodsunit">
              <el-input v-model="temp.goodsunit" placeholder="商品单位" maxlength="3"/>
            </el-form-item>
            <el-form-item label="商品规格">
              <el-input v-model="temp.goodsspec" placeholder="商品描述"/>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input v-model="temp.goodsdesc" placeholder="商品描述"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价（¥）" prop="price">
              <el-input v-model="temp.price" placeholder="原价" @input.native="inputChange(1)"/>
            </el-form-item>
            <el-form-item label="会员价（¥）" prop="vipprice">
              <el-input v-model="temp.vipprice" placeholder="会员价" @input.native="inputChange(1)"/>
            </el-form-item>
            <el-form-item label="优惠价（¥）" prop="discountsprice">
              <el-input v-model="temp.discountsprice" placeholder="优惠价" @input.native="inputChange(2)"/>
            </el-form-item>
            <el-form-item label="特卖价（¥）" prop="specialsaleprice">
              <el-input v-model="temp.specialsaleprice" placeholder="特卖价" @input.native="inputChange(1)"/>
            </el-form-item>
            <el-form-item label="批发价（¥）" prop="wholesaleprice">
              <el-input v-model="temp.wholesaleprice" placeholder="批发价" @input.native="inputChange(2)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="一级分类" prop="pclassifyid">
          <el-radio-group v-model="temp.pclassifyid">
            <el-radio
              v-for="item in oneLevel"
              :label="item.classifyid"
              :key="item.classifyid"
              @change="chooseItem(item)">{{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.pclassifyid" label="二级分类" prop="classifyid">
          <el-radio-group v-model="temp.classifyid">
            <el-radio v-for="item in twoLevel" :label="item.classifyid" :key="item.classifyid">{{ item.name }}</el-radio>
          </el-radio-group>
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
import { getProductType, addGoods, getProduct, editGoods } from '@/api/warehouse'
import { getFromData } from '@/utils/OssUtils'
import { getWebOssToken } from '@/api/upload'
import axios from 'axios'

export default {
  name: 'WarehouseList',
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
        barcode: undefined,
        classifyid: undefined,
        goodscode: undefined,
        pclassifyid: undefined,
        goodsname: undefined,
        goodsimg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558976775735&di=358004bb43e13445d62c1166d29b64e4&imgtype=0&src=http%3A%2F%2Fwww.shengyuan.cn%2Fupload%2Fimage%2F201504%2F1291f47e-402c-4106-8296-6ad9ce8e5388.jpg',
        goodsunit: undefined,
        ishot: undefined,
        vipprice: undefined,
        discountsprice: undefined,
        specialsaleprice: undefined,
        wholesaleprice: undefined,
        price: undefined,
        goodsdesc: undefined,
        goodsspec: undefined,
        goodstype: undefined
      },
      isGoodsTypes: [
        {
          id: 1,
          name: '食品'
        },
        {
          id: 2,
          name: '用品'
        },
        {
          id: 3,
          name: '生鲜'
        }
      ],
      rules: {
        pclassifyid: [{ required: true, message: '请选择一级分类', trigger: 'blur' }],
        classifyid: [{ required: true, message: '请选择二级分类', trigger: 'blur' }],
        goodstype: [{ required: true, message: '请选择商品类型', trigger: 'blur' }],
        goodsname: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        barcode: [{ required: true, message: '请输入商品条码', trigger: 'blur' }],
        goodsunit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品原价', trigger: 'blur' }],
        vipprice: [{ required: true, message: '请输入商品会员价', trigger: 'blur' }],
        specialsaleprice: [{ required: true, message: '请输入商品特卖价', trigger: 'blur' }],
        wholesaleprice: [{ required: true, message: '请输入商品批发价', trigger: 'blur' }],
        discountsprice: [{ required: true, message: '请输入商品优惠价', trigger: 'blur' }]
      },
      dialogStatus: undefined,
      oneLevel: [],
      twoLevel: [],
      towName: undefined,
      imageUrl: '',
      classifyids: [
        {
          name: '二级分类',
          classifyid: undefined
        }
      ],
      pclassifyids: [
        {
          name: '一级分类',
          classifyid: undefined
        }
      ],
      classifyParentId: undefined
    }
  },
  created() {
    this.reGetProduct()
    this.reFindType()
  },
  methods: {
    classifyChange(position) {
      if (position === 1) {
        this.classifyids = [
          {
            name: '二级分类',
            classifyid: undefined
          }
        ]
        this.listQuery.classifyid = undefined
        if (this.listQuery.pclassifyid) {
          this.reTowFindType2()
        }
      }
      this.reGetProduct()
    },
    uploadImage() {
      var moveDiv = document.getElementById('upload')
      moveDiv.click()
    },
    deviceTypeEvent() {
      this.oneCheckList = []
      this.twoCheckList = []
      this.temp.deviceGoodsType = undefined
    },
    inputChange(position) {
      this.$nextTick(() => {
        if (position === 1 && this.temp.univalence) {
          this.temp.univalence = this.temp.univalence.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.univalence = this.temp.univalence.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.univalence = this.temp.univalence.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.univalence = this.temp.univalence.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.univalence = this.temp.univalence.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 2 && this.temp.vipPrice) {
          this.temp.vipPrice = this.temp.vipPrice.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.vipPrice = this.temp.vipPrice.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.vipPrice = this.temp.vipPrice.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.vipPrice = this.temp.vipPrice.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.vipPrice = this.temp.vipPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        }
      })
    },
    selectFile() {
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
                  this.temp.picture = result.host + '/' + fromData.get('key')
                })
            })
          })
        }
      }
    },
    search() {
      this.listQuery.page = 1
      this.reGetProduct()
    },
    handleCreate() {
      this.temp.title = '添加商品'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.barcode = undefined
      this.temp.classifyid = undefined
      this.temp.goodscode = undefined
      this.temp.pclassifyid = undefined
      this.temp.goodsname = undefined
      this.temp.goodsimg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558976775735&di=358004bb43e13445d62c1166d29b64e4&imgtype=0&src=http%3A%2F%2Fwww.shengyuan.cn%2Fupload%2Fimage%2F201504%2F1291f47e-402c-4106-8296-6ad9ce8e5388.jpg'
      this.temp.goodsunit = undefined
      this.temp.ishot = undefined
      this.temp.vipprice = undefined
      this.temp.discountsprice = undefined
      this.temp.specialsaleprice = undefined
      this.temp.wholesaleprice = undefined
      this.temp.price = undefined
      this.temp.goodsdesc = undefined
      this.temp.goodsspec = undefined
      this.temp.goodstype = undefined
      this.twoLevel = []
      this.classifyParentId = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑商品'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.barcode = item.barcode
      this.temp.classifyid = item.classifyid
      this.temp.pclassifyid = item.pclassifyid
      this.temp.goodscode = item.goodscode
      this.temp.goodsname = item.goodsname
      this.temp.goodsimg = item.goodsimg
      this.temp.goodsunit = item.goodsunit
      this.temp.ishot = item.ishot
      this.temp.vipprice = item.vipprice
      this.temp.discountsprice = item.discountsprice
      this.temp.specialsaleprice = item.specialsaleprice
      this.temp.wholesaleprice = item.wholesaleprice
      this.temp.price = item.price
      this.temp.goodsdesc = item.goodsdesc
      this.temp.goodsspec = item.goodsspec
      this.temp.goodstype = item.goodstype
      this.twoLevel = []
      this.classifyParentId = item.pclassifyid
      this.reTowFindType()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 查询分类
    reFindType() {
      getProductType('0').then(response => {
        this.oneLevel = response.data
        var alldata = [{
          name: '一级分类',
          classifyid: undefined
        }]
        this.pclassifyids = alldata.concat(response.data)
      })
    },
    // 查询分类
    reTowFindType() {
      getProductType(this.classifyParentId).then(response => {
        this.twoLevel = response.data
      })
    },
    // 查询分类
    reTowFindType2() {
      getProductType(this.listQuery.pclassifyid).then(response => {
        var alldata = [{
          name: '二级分类',
          classifyid: undefined
        }]
        this.classifyids = alldata.concat(response.data)
      })
    },
    // 查询商品
    reGetProduct() {
      getProduct(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    // 添加商品
    reAddGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addGoods(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.listQuery.page = 1
            this.listQuery.keyword = undefined
            this.listQuery.classifyid = undefined
            this.listQuery.pclassifyid = undefined
            this.dialogFormVisible = false
            this.reGetProduct()
          })
        }
      })
    },
    // 编辑商品
    reEditGoods() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editGoods(this.temp).then(response => {
            this.reGetProduct()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        }
      })
    },
    // 上下架商品
    rePutaway(item) {
      if (item.isSale === 1) {
        this.temp.isSale = 0
      } else {
        this.temp.isSale = 1
      }
      this.temp.goodsId = item.id
      this.temp.name = undefined
      this.temp.goodsDesc = undefined
      this.temp.picture = undefined
      this.temp.univalence = undefined
      this.temp.vipPrice = undefined
      this.temp.deleted = undefined
      this.temp.goodsCatsIdSet = undefined
      editGoods(this.temp).then(response => {
        this.reGetProduct()
        if (item.isSale === 1) {
          this.$message({
            message: '下架成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '上架成功',
            type: 'success'
          })
        }
      })
    },
    // 删除商品
    reDelete(item) {
      this.temp.deleted = 1
      this.temp.goodsId = item.id
      this.temp.name = undefined
      this.temp.goodsDesc = undefined
      this.temp.picture = undefined
      this.temp.univalence = undefined
      this.temp.vipPrice = undefined
      this.temp.isSale = undefined
      this.temp.goodsCatsIdSet = undefined
      editGoods(this.temp).then(response => {
        this.reGetProduct()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    chooseItem(item) {
      this.temp.classifyid = undefined
      this.classifyParentId = item.classifyid
      this.reTowFindType()
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
