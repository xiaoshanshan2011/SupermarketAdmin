// banner广告管理
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.type" style="width: 120px" class="filter-item" value-key="key" @change="reGetPotatoList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索广告" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPotatoList">搜索</el-button>
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

      <el-table-column align="center" label="广告名称">
        <template slot-scope="scope">
          <span>{{ scope.row.imageName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="终端">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">地瓜机</span>
          <span v-else>手机端</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="广告描述">
        <template slot-scope="scope">
          <span>{{ scope.row.imgageDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片/视频">
        <template slot-scope="scope">
          <img v-if="scope.row.imve === 0" :src="scope.row.imageUrl" alt="" style="height: 45px" @click="dialogPictureVisible = true,clickPicture = scope.row.imageUrl">
          <el-button v-else-if="scope.row.imve === 1" type="text" @click="handlePlayVideo(scope.row)">播放视频</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="生效时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="失效时间">
        <template slot-scope="scope">
          <span>{{ scope.row.stopTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="dialogVisible = true;clickItem = scope.row">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="reGetPotatoList" />

    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>确定要删除该广告吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteAdvert(clickItem)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="700px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
        <el-form-item label="终端选择" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio v-for="item in isDeviceList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="区域类型" prop="codeType">
          <el-radio-group v-model="temp.codeType" @change="qylxEvent()">
            <el-radio v-for="item in codeSelect" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.codeType === 2" label="城市区域" prop="cityCode" label-width="100px">
          <el-select v-model="temp.select1" style="width: 100px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity(2)">
            <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
          </el-select>
          <el-select v-model="temp.select2" style="width: 100px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity(3)">
            <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
          </el-select>
          <el-select v-model="temp.select3" style="width: 100px" class="filter-item" value-key="key" placeholder="区/县" @change="reGetCity(4)">
            <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="素材类型" prop="imve">
          <el-radio-group v-model="temp.imve" @change="sclxEvent">
            <el-radio v-for="item in imves" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.imve === 0" label="选择图片" prop="type" label-width="100px">
          <div v-for="item in articleVideoImages" :label="item" :key="item" style="position: relative;float: left;">
            <img
              :src="item"
              style="height: 90px;width: 90px;border-radius: 5px;margin: 0 15px 15px 0">
          </div>
          <!--添加图片-->
          <div class="add" style="position: relative;float: left;" >
            <input
              id="upload2"
              accept=".jpg,.jpeg"
              type="file"
              style="background-color: transparent;color: transparent;height: 90px;width: 90px;"
              @change="reGetOssToken2(1)">
            <div
              style="position: absolute;top:0;pointer-events: none;background-color: white;height: 90px;width: 90px;border-radius: 5px;border:1px dashed #cccccc;display: flex;align-items: center;justify-content: center">
              <img style="height: 30px;width: 30px" src="../../assets/img/add.png">
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="temp.imve === 1" label="选择视频" prop="type" label-width="100px">
          <div v-for="item in articleVideoImages" :label="item" :key="item" style="position: relative;float: left;">
            <div
              style="height: 90px;width: 90px;border-radius: 5px;margin: 0 15px 15px 0;border: 1px dashed #cccccc;display: flex;align-items: center;justify-content: center"
              @click="handlePlayVideo()">
              <img style="height: 30px;width: 30px" src="../../assets/img/ic_video.png">
            </div>
          </div>
          <!--添加视频-->
          <div class="add" style="position: relative;float: left;" >
            <input
              id="upload3"
              accept=".mp4"
              type="file"
              style="background-color: transparent;color: transparent;height: 90px;width: 90px;"
              @change="reGetOssToken2(2)">
            <div
              style="position: absolute;top:0;pointer-events: none;background-color: white;height: 90px;width: 90px;border-radius: 5px;border:1px dashed #cccccc;display: flex;align-items: center;justify-content: center">
              <img style="height: 30px;width: 30px" src="../../assets/img/add.png">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="广告名称" prop="imageName" label-width="100px">
          <el-input v-model="temp.imageName" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="广告描述" prop="imgageDesc" label-width="100px">
          <el-input v-model="temp.imgageDesc" placeholder="描述"/>
        </el-form-item>

        <el-form-item label="时间选择" prop="startTime" label-width="100px">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
            @change="selectTimeEvent()"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():editData()">确定</el-button>
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { slideList, addBanner, editSlide } from '@/api/advert'
import { getWebOssToken } from '@/api/upload'
import { getFromData } from '@/utils/OssUtils'
import { getCity } from '@/api/funds'
import axios from 'axios'
import { formatDate } from '../../utils/utils'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'BannerList',
  components: { Pagination, videoPlayer },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      date: [],
      clickItem: undefined,
      dialogVisible: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: undefined,
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        type: undefined,
        keyword: undefined,
        page: 1,
        limit: 8,
        pageSizes: [8, 16, 24, 36]
      },
      temp: {
        deleted: undefined,
        slideId: undefined,
        cityCode: undefined,
        imageName: undefined,
        imageUrl: undefined,
        imgageDesc: undefined,
        startTime: undefined,
        stopTime: undefined,
        codeType: undefined, // 广告区域
        type: undefined, // 类型： 1机器端 0手机端
        imve: undefined,
        parentId: 100000, // 父级城市编码
        levelType: 1, // 0:国家，1:省，2:市，3:区
        select1: undefined,
        select2: undefined,
        select3: undefined
      },
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      articleVideoImages: [],
      isDeviceList: [
        {
          id: 1,
          name: '机器端'
        },
        {
          id: 0,
          name: '手机端'
        }
      ],
      codeSelect: [
        {
          id: 1,
          name: '全国'
        },
        {
          id: 2,
          name: '省市区'
        }
      ],
      imves: [
        {
          id: 0,
          name: '图片'
        },
        {
          id: 1,
          name: '视频'
        }
      ],
      rules: {
        codeType: [{ required: true, message: '请选择区域类型', trigger: 'blur' }],
        imageName: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请输入选择文件', trigger: 'blur' }],
        cityCode: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        imve: [{ required: true, message: '请选择素材类型', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
        stopTime: [{ required: true, message: '请选择失效时间', trigger: 'blur' }],
        type: [{ required: true, message: '请选择终端', trigger: 'blur' }],
        imgageDesc: [{ required: true, message: '请输入广告描述', trigger: 'blur' }]
      },
      sortOptions: [{ label: '全部', key: undefined }, { label: '机器端', key: 1 }, { label: '手机端', key: 0 }],
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
    this.reGetPotatoList()
    this.reGetCity(1)
  },
  methods: {
    // 选择时间回调
    selectTimeEvent() {
      if (this.date && this.date.length > 1) {
        this.temp.startTime = formatDate(this.date[0], 'yyyy-MM-dd hh:mm:ss')
        this.temp.stopTime = formatDate(this.date[1], 'yyyy-MM-dd hh:mm:ss')
      }
    },
    // 区域类型选择时间
    qylxEvent() {
      if (this.temp.codeType === 1) {
        this.temp.cityCode = '100000'
      } else if (this.temp.codeType === 2) {
        this.temp.cityCode = undefined
      }
    },
    // 素材类型选择时间
    sclxEvent() {
      this.articleVideoImages = []
      this.temp.imageUrl = undefined
    },
    handleCreate() {
      this.temp.title = '添加广告'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.cityCode = undefined
      this.temp.slideId = undefined
      this.temp.deleted = undefined
      this.temp.imageName = undefined
      this.temp.imageUrl = undefined
      this.temp.select1 = undefined
      this.temp.select2 = undefined
      this.temp.select3 = undefined
      this.sortOptionsShi = undefined
      this.sortOptionsQu = undefined
      this.temp.imgageDesc = undefined
      this.temp.startTime = undefined
      this.temp.stopTime = undefined
      this.temp.codeType = undefined
      this.temp.type = undefined
      this.temp.imve = undefined
      this.date = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '编辑广告'
      this.temp.name = item.name
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.cityCode = undefined
      this.temp.slideId = item.id
      this.temp.deleted = undefined
      this.temp.imageName = item.imageName
      this.temp.imageUrl = item.imageUrl
      this.temp.imgageDesc = item.imgageDesc
      this.temp.startTime = item.startTime
      this.temp.stopTime = item.stopTime
      this.temp.codeType = undefined
      this.temp.type = item.type
      this.temp.imve = item.imve
      this.articleVideoImages[0] = item.imageUrl
      this.date = [new Date(item.startTime), new Date(item.stopTime)]
      // this.reEditGetCity(item.city.id, item.city.parentId, 3)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteAdvert(item) {
      this.temp.cityCode = undefined
      this.temp.slideId = item.id
      this.temp.deleted = 1
      this.temp.imageName = undefined
      this.temp.imageUrl = undefined
      this.temp.imgageDesc = undefined
      this.temp.startTime = undefined
      this.temp.stopTime = undefined
      this.temp.codeType = undefined
      this.temp.type = undefined
      this.temp.imve = undefined
      editSlide(this.temp).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.reGetPotatoList()
      })
    },

    // 获取广告
    reGetPotatoList() {
      this.listLoading = true
      slideList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },

    // 阿里上传文件
    reGetOssToken2(type) {
      var files
      if (type === 1) {
        files = document.getElementById('upload2')
      } else {
        files = document.getElementById('upload3')
      }
      if (files.files) {
        var fileLen
        if (type === 1) {
          fileLen = document.getElementById('upload2').files
        } else {
          fileLen = document.getElementById('upload3').files
        }
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
                  this.temp.imageUrl = result.host + '/' + fromData.get('key')
                })
            })
          })
        }
      }
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
    // 增加广告
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addBanner(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.reGetPotatoList()
          })
        }
      })
    },
    // 编辑广告
    editData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          editSlide(this.temp).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.reGetPotatoList()
          })
        }
      })
    },
    handlePlayVideo(item) {
      var bean = {
        type: 'video/mp4',
        src: undefined
      }
      if (item) {
        bean.src = item.imageUrl
      } else {
        bean.src = this.temp.imageUrl
      }
      console.log(item.imageUrl)
      this.playerOptions.sources = []
      this.playerOptions.sources.push(bean)
      this.dialogFormVisible2 = true
    }
  }
}
</script>

<style scoped>

</style>
