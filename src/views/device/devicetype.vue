<template>
  <div class="app-container">
    <!--<div class="filter-container">-->
    <!--<el-input v-model="listQuery.typeName" placeholder="类型名" style="width: 200px;" class="filter-item"/>-->
    <!--<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
    <!--<el-button-->
    <!--class="filter-item"-->
    <!--style="margin-left: 10px;margin-bottom: 10px"-->
    <!--type="primary"-->
    <!--icon="el-icon-edit"-->
    <!--@click="handleCreate">添加-->
    <!--</el-button>-->
    <!--</div>-->
    <!--<el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>-->
    <el-table v-loading="listLoading" :data="datas" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型名称">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="视频">
        <template slot-scope="scope">
          <el-button v-if="scope.row.typeVideLocation" type="text" @click="handlePlayVideo(scope.row)">播放</el-button>
          <!--<span>{{ scope.row.typeVideLocation }}</span>-->
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.typeImageLocation" alt="" style="height: 50px" @click="dialogPictureVisible = true,clickPicture = scope.row.typeImageLocation">
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="最大装载数量">
        <template slot-scope="scope">
          <span>{{ scope.row.maxNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型介绍">
        <template slot-scope="scope">
          <span>{{ scope.row.typeDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="年单价(单位:元)">
        <template slot-scope="scope">
          <span>{{ scope.row.yearPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="160px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <!--<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>-->
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="textMap"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="类型名称" prop="typeName" label-width="130px">
          <el-input v-model="textMap.typeName" style="width: 250px" clearable disabled/>
        </el-form-item>
        <el-form-item label="类型介绍" prop="typeDescription" label-width="130px">
          <el-input v-model="textMap.typeDescription" style="width: 250px" clearable/>
        </el-form-item>
        <!--<el-form-item label="年单价(单位:元)" prop="yearPrice" label-width="130px">
          <el-input v-model="textMap.yearPrice" style="width: 250px" clearable maxlength="15" @input.native="inputChange"/>
        </el-form-item>-->
        <el-form-item label="图片地址" prop="typeImageLocation" label-width="130px">
          <input id="upload" type="file" style="display:none;" @change="reGetOssToken">
          <input type="button" value="选择图片" @click="uploadImage">
          <img v-if="textMap.typeImageLocation" :src="textMap.typeImageLocation" style="width: 130px;height: 130px;display: block;">
        </el-form-item>
        <el-form-item label="视频地址" label-width="130px">
          <input id="uploadVideo" type="file" style="display:none;" accept="video/mp4" @change="reGetOssTokenVideo">
          <input type="button" value="选择视频" @click="uploadImage2">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible2" title="视频" width="850px">
      <video-player
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
        class="video-player-box"/>
    </el-dialog>
    <el-dialog :visible.sync="dialogPictureVisible" width="1000px">
      <div style="display: flex;align-items: center;justify-content: center">
        <img :src="clickPicture" style="height: 500px">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceTypeList, createDeviceType, editDeviceType } from '@/api/device'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getWebOssToken } from '@/api/upload'
import { getFromData } from '@/utils/OssUtils'
import axios from 'axios'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'Department',
  components: { Pagination, videoPlayer },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      datas: [],
      total: 10,
      listQuery: {
        typeName: undefined
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建新的设备类型',
        typeDescription: '',
        typeImageLocation: '',
        typeName: '',
        typeVideLocation: '',
        yearPrice: '',
        id: ''
      },
      rules: {
        typeDescription: [{ required: true, message: '请输入类型介绍', trigger: 'blur' }],
        typeImageLocation: [{ required: true, message: '请输入图片地址', trigger: 'blur' }],
        typeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }],
        yearPrice: [{ required: true, message: '请输入年单价', trigger: 'blur' }]
      },
      playerOptions: {
        // videojs options
        muted: true,
        language: 'zh-CN',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        aspectRatio: '16:9',
        sources: [],
        poster: '@/assets/404_images/404.png'
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    uploadImage() {
      var moveDiv = document.getElementById('upload')
      moveDiv.click()
    },
    uploadImage2() {
      var moveDiv = document.getElementById('uploadVideo')
      moveDiv.click()
    },
    inputChange() {
      this.$nextTick(() => {
        if (this.textMap.yearPrice) {
          this.textMap.yearPrice = this.textMap.yearPrice.replace(/[^\d]/g, '') // 清除"数字"以外的字符
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
                  this.textMap.typeImageLocation = result.host + '/' + fromData.get('key')
                })
            })
          })
        }
      }
    },
    reGetOssTokenVideo() {
      const files = document.getElementById('uploadVideo')
      if (files.files) {
        const fileLen = document.getElementById('uploadVideo').files
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
                  this.textMap.typeVideLocation = result.host + '/' + fromData.get('key')
                  console.log(this.textMap.typeVideLocation)
                })
            })
          })
        }
      }
    },
    findAll() {
      getDeviceTypeList(this.listQuery).then(response => {
        this.datas = response.data.list
        this.total = response.data.total
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.findAll()
    },
    handleCreate() {
      this.textMap.create = '创建新的设备类型'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.textMap.typeDescription = undefined
      this.textMap.typeImageLocation = undefined
      this.textMap.typeName = undefined
      this.textMap.typeVideLocation = undefined
      this.textMap.yearPrice = undefined
      this.textMap.id = undefined
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.textMap.create = '编辑设备类型'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.textMap.typeDescription = row.typeDescription
      this.textMap.typeImageLocation = row.typeImageLocation
      this.textMap.typeName = row.typeName
      this.textMap.typeVideLocation = row.typeVideLocation
      this.textMap.yearPrice = row.yearPrice
      this.textMap.id = row.id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDeviceType(this.textMap).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.listQuery.typeName = undefined
            this.findAll()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editDeviceType(this.textMap).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.listQuery.departmentName = undefined
            this.findAll()
          })
        }
      })
    },
    handlePlayVideo(item) {
      var bean = {
        type: 'video/mp4',
        src: undefined
      }
      bean.src = item.typeVideLocation
      this.playerOptions.sources = []
      this.playerOptions.sources.push(bean)
      this.dialogFormVisible2 = true
    }
  }
}
</script>

<style scoped>
</style>
