// 学院
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select
        v-model="listQuery.articleType"
        style="width: 120px"
        class="filter-item"
        value-key="key"
        @change="reGetPotatoList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索关键字" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPotatoList">搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;margin-bottom: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">发布文章
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章标题">
        <template slot-scope="scope">
          <span v-if="scope.row.articleTitle.length < 20">{{ scope.row.articleTitle }}</span>
          <span v-else>{{ scope.row.articleTitle.substr(0,20) }}...</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="文章类型">
        <template slot-scope="scope">
          <span v-if="scope.row.articleType === 1">活动</span>
          <span v-else-if="scope.row.articleType === 2">公益</span>
          <span v-else-if="scope.row.articleType === 3">其他</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :page-sizes.sync="listQuery.pageSizes"
      @pagination="reGetPotatoList"/>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="1000px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="textMap"
        label-position="left"
        label-width="70px"
        style="width: 900px; margin-left:50px;">
        <el-form-item label="文章标题" prop="articleTitle" label-width="80px">
          <el-input v-model="textMap.articleTitle" placeholder="请输入文字内容"/>
        </el-form-item>
        <el-form-item label="文章类型" label-width="80px" prop="articleType">
          <el-select
            v-model="textMap.articleType"
            style="width: 120px"
            class="filter-item"
            value-key="key">
            <el-option v-for="item in sortOptions2" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择内容" label-width="80px" prop="isPicture">
          <el-radio-group v-if="textMap.update === 'create'" v-model="textMap.isPicture">
            <el-radio v-for="item in isDeviceList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
          <el-radio-group v-else v-model="textMap.isPicture" disabled>
            <el-radio v-for="item in isDeviceList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="name" label-width="80px">
          <div v-if="textMap.isPicture === 1">
            <div v-for="(item, index) in articleImages" :label="item" :key="item" style="position: relative;float: left;">
              <img
                :src="item"
                style="height: 90px;width: 90px;border-radius: 5px;margin: 0 15px 15px 0">
              <div style="position: absolute;top:0;height: 90px;width: 90px;display: flex;flex-direction: column;align-items: center;justify-content: center">
                <img style="height: 25px;width: 25px" src="../../assets/img/ic_delete.png" @click="deleteItem(1, index)">
              </div>
            </div>
          </div>
          <div v-else style="position: relative;">
            <div
              v-for="item in articleVideos"
              :label="item"
              :key="item"
              style="background-color: #1e6abc;height: 90px;width: 90px;float: left;border-radius: 5px;margin: 0 15px 15px 0"/>
            <div style="position: absolute;top:0;height: 90px;width: 90px;display: flex;flex-direction: column;align-items: center;justify-content: center">
              <img style="height: 25px;width: 25px" src="../../assets/img/ic_delete.png" @click="deleteItem(2, 0)">
            </div>
          </div>
          <!--添加图片或者视频-->
          <div v-if="isShowAdd" class="add" style="position: relative;float: left;">
            <input
              id="upload"
              :accept="accept"
              type="file"
              style="background-color: transparent;color: transparent;height: 90px;width: 90px;"
              @change="reGetOssToken">
            <div
              style="position: absolute;top:0;pointer-events: none;background-color: white;height: 90px;width: 90px;border-radius: 5px;border:1px dashed #cccccc;display: flex;align-items: center;justify-content: center">
              <img style="height: 30px;width: 30px" src="../../assets/img/add.png">
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="textMap.isPicture === 2" label="视频封面" prop="isPicture" label-width="80px">
          <div v-for="item in articleVideoImages" :label="item" :key="item" style="position: relative;float: left;">
            <img
              :src="item"
              style="height: 90px;width: 90px;border-radius: 5px;margin: 0 15px 15px 0">
          </div>
          <!--添加视频封面图-->
          <div class="add" style="position: relative;float: left;" >
            <input
              id="upload2"
              accept=".jpg,.jpeg"
              type="file"
              style="background-color: transparent;color: transparent;height: 90px;width: 90px;"
              @change="reGetOssToken2">
            <div
              style="position: absolute;top:0;pointer-events: none;background-color: white;height: 90px;width: 90px;border-radius: 5px;border:1px dashed #cccccc;display: flex;align-items: center;justify-content: center">
              <img style="height: 30px;width: 30px" src="../../assets/img/add.png">
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="textMap.update ==='create'?createData():updateData()">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getArticleList, publishArticle, editArticle } from '@/api/xueyuan'
import { getWebOssToken } from '@/api/upload'
import { getFromData } from '@/utils/OssUtils'
import axios from 'axios'

export default {
  name: 'XueyuanList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 8,
        articleType: undefined,
        pageSizes: [8, 16, 24, 32]
      },
      sortOptions: [{ label: '全部', key: undefined }, { label: '活动', key: 1 }, { label: '公益', key: 2 }, {
        label: '其他',
        key: 3
      }],
      sortOptions2: [{ label: '活动', key: 1 }, { label: '公益', key: 2 }, {
        label: '其他',
        key: 3
      }],
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: '发布文章',
        isPicture: 1,
        articleTitle: '',
        articleType: undefined,
        articleImage: '',
        articleVideo: '',
        deleted: 1,
        articleVideoImage: ''
      },
      isDeviceList: [
        {
          id: 1,
          name: '图片'
        },
        {
          id: 2,
          name: '视频'
        }
      ],
      articleImages: [],
      articleVideos: [],
      articleVideoImages: [],
      rules: {
        articleTitle: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        isPicture: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        articleType: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        articleVideoImage: [{ required: true, message: '请选择视频封面图', trigger: 'blur' }]
      },
      accept: '.jpg,.jpeg',
      isShowAdd: true
    }
  },
  watch: {
    'textMap.isPicture': function(newVal) {
      if (newVal === 1) {
        this.accept = '.jpg,.jpeg'
        if (this.articleImages.length === 9) {
          this.isShowAdd = false
        }
      } else {
        this.accept = '.mp4'
        this.isShowAdd = true
      }
    },
    'articleImages': function(newVal) {
      if (newVal.length === 9) {
        this.isShowAdd = false
      } else {
        this.isShowAdd = true
      }
    }
  },
  created() {
    this.reGetPurchaseOrderList()
  },
  methods: {
    deleteItem(type, index) {
      console.log('111111111111111111')
      console.log(type)
      if (type === 1) {
        this.articleImages.splice(index, 1)
      } else {
        this.articleVideos = []
      }
    },
    handleCreate() {
      this.textMap.deleted = undefined
      this.accept = '.jpg,.jpeg'
      this.textMap.isPicture = 1
      this.textMap.create = '发布文章'
      this.textMap.update = 'create'
      this.dialogFormVisible = true
      this.textMap.title = '发布文章'
      this.textMap.articleTitle = undefined
      this.textMap.articleType = undefined
      this.articleImages = []
      this.articleVideos = []
      this.articleVideoImages = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.textMap.deleted = undefined
      if (item.articleImage) {
        this.articleImages = item.articleImage.split(',')
        this.textMap.isPicture = 1
        this.accept = '.jpg,.jpeg'
      } else {
        this.articleVideos = []
        if (item.articleVideo) {
          this.articleVideos = item.articleVideo.split(',')
        }
        this.textMap.isPicture = 2
        this.accept = '.mp4'
        if (item.articleVideoImage) {
          this.articleVideoImages = item.articleVideoImage.split(',')
        }
      }
      this.textMap.articleVideo = ''
      this.textMap.articleImage = ''
      this.textMap.title = '编辑文章'
      this.textMap.update = 'edit'
      this.dialogFormVisible = true
      this.textMap.id = item.id
      this.textMap.articleTitle = item.articleTitle
      this.textMap.articleType = item.articleType
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 增加
    createData() {
      this.textMap.articleVideo = ''
      this.textMap.articleImage = ''
      if (this.articleVideoImages.length > 0) {
        this.textMap.articleVideoImage = this.articleVideoImages[0]
      } else {
        this.textMap.articleVideoImage = ''
      }
      if (this.textMap.isPicture === 1) {
        if (this.articleImages.length === 0) {
          this.$message({
            message: '请上传图片',
            type: 'error'
          })
          return
        }
        for (let i = 0; i < this.articleImages.length; i++) {
          if (i === 0) {
            this.textMap.articleImage = this.articleImages[i]
          } else {
            this.textMap.articleImage = this.textMap.articleImage + ',' + this.articleImages[i]
          }
        }
      } else {
        if (this.articleVideos.length === 0) {
          this.$message({
            message: '请上传视频',
            type: 'error'
          })
          return
        }
        if (this.articleVideoImages.length === 0) {
          this.$message({
            message: '请上传视频封面图片',
            type: 'error'
          })
          return
        }
        for (let i = 0; i < this.articleVideos.length; i++) {
          if (i === 0) {
            this.textMap.articleVideo = this.articleVideos[i]
          } else {
            this.textMap.articleVideo = this.textMap.articleVideo + ',' + this.articleVideos[i]
          }
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          publishArticle(this.textMap).then(response => {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.listQuery.articleType = undefined
            this.reGetPurchaseOrderList()
          })
        }
      })
    },
    // 编辑
    updateData() {
      this.textMap.articleVideo = ''
      this.textMap.articleImage = ''
      if (this.articleVideoImages.length > 0) {
        this.textMap.articleVideoImage = this.articleVideoImages[0]
      } else {
        this.textMap.articleVideoImage = ''
      }
      if (this.textMap.isPicture === 1) {
        if (this.articleImages.length === 0) {
          this.$message({
            message: '请上传图片',
            type: 'error'
          })
          return
        }
        for (let i = 0; i < this.articleImages.length; i++) {
          if (i === 0) {
            this.textMap.articleImage = this.articleImages[i]
          } else {
            this.textMap.articleImage = this.textMap.articleImage + ',' + this.articleImages[i]
          }
        }
      } else {
        if (this.articleVideos.length === 0) {
          this.$message({
            message: '请上传视频',
            type: 'error'
          })
          return
        }
        if (this.articleVideoImages.length === 0) {
          this.$message({
            message: '请上传视频封面图片',
            type: 'error'
          })
          return
        }
        for (let i = 0; i < this.articleVideos.length; i++) {
          if (i === 0) {
            this.textMap.articleVideo = this.articleVideos[i]
          } else {
            this.textMap.articleVideo = this.textMap.articleVideo + ',' + this.articleVideos[i]
          }
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editArticle(this.textMap).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.reGetPurchaseOrderList()
          })
        }
      })
    },
    // 删除
    deleteData(item) {
      this.textMap.deleted = 1
      this.textMap.id = item.id
      this.textMap.articleTitle = undefined
      this.textMap.articleType = undefined
      this.textMap.articleImage = undefined
      this.textMap.articleVideo = undefined
      editArticle(this.textMap).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.reGetPurchaseOrderList()
      })
    },
    // 阿里上传文件
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
                  if (this.textMap.isPicture === 1) {
                    this.articleImages.push(result.host + '/' + fromData.get('key'))
                  } else {
                    this.$message({
                      message: '视屏已替换',
                      type: 'success'
                    })
                    this.articleVideos = []
                    this.articleVideos.push(result.host + '/' + fromData.get('key'))
                  }
                })
            })
          })
        }
      }
    },
    // 阿里上传文件
    reGetOssToken2() {
      const files = document.getElementById('upload2')
      if (files.files) {
        const fileLen = document.getElementById('upload2').files
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
                  this.articleVideoImages = []
                  this.articleVideoImages.push(result.host + '/' + fromData.get('key'))
                })
            })
          })
        }
      }
    },
    reGetPurchaseOrderList() {
      this.listLoading = true
      getArticleList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
