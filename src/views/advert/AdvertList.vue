// 分润端广告申请
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.state" style="width: 120px" class="filter-item" value-key="key" @change="reGetPotatoList()">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.keyword" placeholder="搜索广告" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="reGetPotatoList">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="营业执照">
        <template slot-scope="scope">
          <img :src="scope.row.businessImg" alt="" style="height: 40px" @click="dialogPictureVisible = true,clickPicture = scope.row.businessImg">
        </template>
      </el-table-column>

      <el-table-column align="center" label="其他证件">
        <template slot-scope="scope">
          <img :src="scope.row.certificateImg" alt="" style="height: 40px" @click="dialogPictureVisible = true,clickPicture = scope.row.certificateImg">
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请人">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请人id">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审阅人">
        <template slot-scope="scope">
          <span>{{ scope.row.adminUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state === 0" icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.row, 2)">审阅</el-button>
          <el-button v-else type="info" size="mini" disabled @click="handleEdit(scope.row)">已审阅</el-button>
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
        <el-button type="primary" @click="handleEdit(clickItem, 1)">确 定</el-button>
      </span>
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
import { advertList, advertEdit } from '@/api/advert'
export default {
  name: 'SellOrderList',
  components: { Pagination },
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      clickItem: undefined,
      dialogVisible: false,
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        keyword: undefined,
        page: 1,
        limit: 12,
        state: undefined,
        pageSizes: [12, 24, 36, 48]
      },
      temp: {
        deleted: undefined,
        id: undefined,
        state: undefined // 状态(0未审阅,1已审阅)
      },
      sortOptions: [{ label: '全部状态', key: undefined }, { label: '未审阅', key: 0 }, { label: '已审阅', key: 1 }]
    }
  },
  created() {
    this.reGetPotatoList()
  },
  methods: {
    handleEdit(item, type) {
      this.temp.id = item.id
      if (type === 1) {
        this.temp.deleted = 1
        this.temp.state = 0
      } else {
        this.temp.deleted = 0
        this.temp.state = 1
      }
      this.listLoading = true
      advertEdit(this.temp).then(response => {
        this.listLoading = false
        if (type === 1) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.dialogVisible = false
        } else {
          this.$message({
            message: '审阅成功',
            type: 'success'
          })
        }
        this.reGetPotatoList()
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    reGetPotatoList() {
      this.listLoading = true
      advertList(this.listQuery).then(response => {
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
