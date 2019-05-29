// 公告
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.noticeType" style="width: 120px" class="filter-item" value-key="key" @change="findAll()">
        <el-option v-for="item in noticeTypes" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input v-model="listQuery.noticeTile" placeholder="搜索公告标题" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="findAll">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.offset-1)*listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.noticeTile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通告优先级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">III</span>
          <span v-else-if="scope.row.level === 2">II</span>
          <span v-else-if="scope.row.level === 3">I</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="通告端">
        <template slot-scope="scope">
          <span v-if="scope.row.noticeType === 0">所有端</span>
          <span v-else-if="scope.row.noticeType === 1">app分润端</span>
          <span v-else-if="scope.row.noticeType === 2">红薯机</span>
          <span v-else-if="scope.row.noticeType === 3">小程序</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModified }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="toEditNotice(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="reEditNotice(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.offset" :limit.sync="listQuery.limit" :page-sizes.sync="listQuery.pageSizes" @pagination="findAll" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getNoticeList, editNotice } from '@/api/notice'
export default {
  name: 'NoticeList',
  components: { Pagination },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        offset: 1,
        limit: 10,
        noticeType: undefined,
        noticeTile: undefined,
        pageSizes: [10, 20, 30, 40]
      },
      noticeTypes: [
        {
          id: undefined,
          name: '全部公告'
        },
        {
          id: 0,
          name: '所有端'
        },
        {
          id: 1,
          name: 'app分润端'
        },
        {
          id: 2,
          name: '红薯机'
        },
        {
          id: 3,
          name: '小程序'
        }
      ],
      temp: {
        id: undefined,
        deleted: 1
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    reEditNotice(item) {
      this.temp.id = item.id
      editNotice(this.temp).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.findAll()
      })
    },
    // 编辑公告
    toEditNotice(item) {
      this.$router.push({
        path: 'editnotice',
        name: 'EditNotice',
        params: {
          item: item
        }
      })
    },
    handleCreate() {
      this.$router.push({
        path: 'addnotice',
        name: 'AddNotice',
        params: {
        }
      })
    },
    findAll() {
      this.listLoading = true
      getNoticeList(this.listQuery).then(response => {
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
