<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.userphoto" alt="" style="height: 40px" @click="dialogPictureVisible = true,clickPicture = scope.row.userphoto">
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <span>{{ scope.row.sysDepartment.departmentname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属角色">
        <template slot-scope="scope">
          <span>{{ scope.row.sysRole.roledesc }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮件">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status === 0" type="warning" size="mini" @click="band(scope.row, 1)">禁用</el-button>
          <el-button v-if="scope.row.status === 1" type="info" size="mini" @click="band(scope.row, 0)">启用</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="showHint(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <!--<el-form-item label="用户头像" prop="name" label-width="80px">-->
        <!--<div v-for="item in headImages" :label="item" :key="item" style="position: relative;float: left;">-->
        <!--<img-->
        <!--:src="item"-->
        <!--style="height: 90px;width: 90px;border-radius: 5px;margin: 0 15px 15px 20px">-->
        <!--</div>-->
        <!--&lt;!&ndash;添加视频封面图&ndash;&gt;-->
        <!--<div class="add" style="position: relative;float: left;margin-left: 20px" >-->
        <!--<input-->
        <!--id="upload2"-->
        <!--accept=".jpg,.jpeg"-->
        <!--type="file"-->
        <!--style="background-color: transparent;color: transparent;height: 90px;width: 90px;"-->
        <!--@change="reGetOssToken2">-->
        <!--<div-->
        <!--style="position: absolute;top:0;pointer-events: none;background-color: white;height: 90px;width: 90px;border-radius: 5px;border:1px dashed #cccccc;display: flex;align-items: center;justify-content: center">-->
        <!--<img style="height: 30px;width: 30px" src="../../assets/img/add.png">-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-form-item>-->
        <el-form-item label="选择部门" prop="name">
          <el-select v-model="temp.departmentid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in departments" :key="item.departmentid" :label="item.departmentname" :value="item.departmentid"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="clickItem.sysRole && clickItem.sysRole.roledesc === '超级管理员'" label="选择角色" prop="name">
          <el-input disabled value="超级管理员"/>
        </el-form-item>
        <el-form-item v-else label="选择角色" prop="name">
          <el-select v-model="temp.roleid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleLists" :key="item.roleid" :label="item.roledesc" :value="item.roleid"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="name" placeholder="请输入管理员姓名">
          <el-input v-model="temp.nickname"/>
        </el-form-item>
        <el-form-item label="管理员用户名" prop="name" placeholder="请输入管理员用户名">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" placeholder="请输入管理员手机号码">
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item label="邮件" prop="email" placeholder="请输入管理员邮件">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="管理员密码" placeholder="请输入管理员密码">
          <el-input v-model="temp.password" type="password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="deleteVisible"
      title="提示"
      width="30%">
      <span>确定要删除该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="reDeleteUser">确 定</el-button>
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
import { getWebOssToken } from '@/api/upload'
import axios from 'axios'
import { getFromData } from '@/utils/OssUtils'
import { roleList } from '@/api/system'
import { getDepartmentList, administratorCreate, administratorList, administratorEdit, deleteUser } from '@/api/department'
import md5 from 'js-md5'
export default {
  name: 'Administratorlist',
  data() {
    return {
      clickPicture: undefined,
      dialogPictureVisible: false,
      headImages: [],
      list: [],
      listLoading: false,
      tableKey: 0,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        userid: undefined,
        roleid: undefined,
        departmentid: undefined,
        username: undefined,
        password: undefined,
        userphoto: undefined,
        mobile: undefined,
        nickname: undefined,
        deleted: undefined,
        email: undefined,
        password2: undefined,
        roleIdList: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '创建管理员'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        headImages: [{ required: true, message: '请上传用户头像', trigger: 'blur' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        nickname: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入管理员用户名', trigger: 'blur' }],
        managerAccount: [{ required: true, message: '请输入管理员帐号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        departmentid: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮件', trigger: 'blur' }],
        roleIdList: [{ required: true, message: '请选中角色', triadministratorEditgger: 'blur' }]
      },
      downloadLoading: false,
      roleLists: [],
      departments: [],
      deleteVisible: false,
      clickItem: {}
    }
  },
  created() {
    this.getRoleLists()
    this.departmentList()
    this.findAll()
  },
  methods: {
    findAll() {
      this.listLoading = true
      administratorList().then(response => {
        this.listLoading = false
        var data = response.data
        // for (let i = 0; i < data.length; i++) {
        //   var isAdmin = false // 是否为超级管理员
        //   var roles = data[i].roles
        //   for (let j = 0; j < roles.length; j++) {
        //     if (roles[j].name === 'ROLE_ADMIN') {
        //       isAdmin = true
        //       break
        //     }
        //   }
        //   data[i].isAdmin = isAdmin
        // }
        this.list = data
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    edit(row) {
      console.log(row.name)
    },
    handleCreate() {
      this.textMap.create = '创建管理员'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.headImages = []
      this.temp.userid = undefined
      this.temp.departmentid = undefined
      this.temp.roleid = undefined
      this.temp.username = undefined
      this.temp.password = undefined
      this.temp.userphoto = undefined
      this.temp.mobile = undefined
      this.temp.nickname = undefined
      this.temp.deleted = undefined
      this.temp.email = undefined
      this.temp.password2 = undefined
      this.temp.roleIdList = []
      this.clickItem = {}
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.clickItem = row
      this.textMap.create = '编辑管理员'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.headImages[0] = row.userphoto
      this.temp.userid = row.userid
      this.temp.roleid = row.roleid
      this.temp.departmentid = row.departmentid
      this.temp.username = row.username
      this.temp.password = undefined
      this.temp.userphoto = row.userphoto
      this.temp.mobile = row.mobile
      this.temp.nickname = row.nickname
      this.temp.email = row.email
      this.temp.deleted = undefined
      this.temp.password2 = undefined
      this.temp.roleIdList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilterClick(row) {
      this.textMap.create = '编辑管理员'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
                  this.headImages = []
                  this.headImages.push(result.host + '/' + fromData.get('key'))
                  this.temp.userphoto = result.host + '/' + fromData.get('key')
                })
            })
          })
        }
      }
    },
    // 获取角色
    getRoleLists() {
      roleList().then(response => {
        this.roleLists = response.data
      })
    },
    // 获取部门
    departmentList() {
      getDepartmentList({}).then(response => {
        this.departments = response.data
      })
    },
    // 创建用户
    createData() {
      // if (!this.temp.userphoto) {
      //   this.$message({
      //     message: '请上传头像',
      //     type: 'error'
      //   })
      //   return
      // } else
      if (!this.temp.departmentid) {
        this.$message({
          message: '请选择部门',
          type: 'error'
        })
        return
      } else if (!this.temp.roleid) {
        this.$message({
          message: '请选择角色',
          type: 'error'
        })
        return
      } else if (!this.temp.password) {
        this.$message({
          message: '请输入管理员密码',
          type: 'error'
        })
        return
      }
      this.temp.password2 = md5(this.temp.password)
      this.temp.roleIdList[0] = this.temp.roleid
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          administratorCreate(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },
    // 编辑用户
    updateData() {
      // if (!this.temp.userphoto) {
      //   this.$message({
      //     message: '请上传头像',
      //     type: 'error'
      //   })
      //   return
      // } else
      if (!this.temp.departmentid) {
        this.$message({
          message: '请选择部门',
          type: 'error'
        })
        return
      } else if (!this.temp.roleid) {
        this.$message({
          message: '请选择角色',
          type: 'error'
        })
        return
      }
      if (this.temp.password) {
        this.temp.password2 = md5(this.temp.password)
      }
      this.temp.roleIdList[0] = this.temp.roleid
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          administratorEdit(this.temp).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.findAll()
          })
        }
      })
    },

    // 禁用
    band(item, status) {
      var temp = {
        'administratorId': item.id,
        'status': status
      }
      administratorEdit(temp).then(response => {
        if (status === 1) {
          this.$message({
            message: '禁用成功',
            type: 'success'
          })
        } else if (status === 0) {
          this.$message({
            message: '启用成功',
            type: 'success'
          })
        }
        this.dialogFormVisible = false
        this.findAll()
      })
    },
    showHint(item) {
      this.deleteVisible = true
      this.clickItem = item
    },
    // 删除
    reDeleteUser() {
      deleteUser(this.clickItem.userid).then(response => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.deleteVisible = false
        this.findAll()
      })
    }
  }
}
</script>

<style scoped>

</style>
