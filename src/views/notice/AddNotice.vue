// 添加公告
<template>
  <div class="components-container">
    <el-form ref="dataForm" :model="temp" :rules="rules" class="form-container">
      <el-form-item prop="noticeTile">
        <MDinput v-model="temp.noticeTile" :maxlength="100" name="name" required>
          标题
        </MDinput>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" prop="noticeLable">
        <MDinput v-model="temp.noticeLable" :maxlength="100" name="name" required>
          简介
        </MDinput>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="通告端" prop="noticeType">
            <el-select v-model="temp.noticeType" style="width: 120px" class="filter-item" value-key="key" @change="sblx()">
              <el-option v-for="item in noticeTypes" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="100px" label="通告优先级:" class="postInfo-container-item" prop="level">
            <el-rate
              v-model="temp.level"
              :max="3"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :low-threshold="1"
              :high-threshold="3"
              style="margin-top:8px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="noticeContent">
        <tinymce :height="350" v-model="temp.noticeContent"/>
      </el-form-item>
      <div style="width: 100%;margin-top: 20px;display: flex;align-items: flex-end;justify-content: flex-end">
        <el-button type="primary" @click="publish">发布</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { addNotice } from '@/api/notice'
import MDinput from '@/components/MDinput'
export default {
  name: 'AddNotice',
  components: { Tinymce, MDinput },
  data() {
    return {
      temp: {
        level: 3,
        noticeContent: undefined,
        noticeTile: '',
        noticeType: undefined,
        noticeLable: ''
      },
      noticeTypes: [
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
      rules: {
        level: [{ required: true, message: '请设置重要性', trigger: 'blur' }],
        noticeContent: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
        noticeType: [{ required: true, message: '请选择通告端', trigger: 'blur' }],
        noticeTile: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        noticeLable: [{ required: true, message: '请输入简介', trigger: 'blur' }]
      }
    }
  },
  methods: {
    publish() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addNotice(this.temp).then(response => {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.$router.push({
              path: 'noticelist',
              name: 'NoticeList',
              params: {
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
