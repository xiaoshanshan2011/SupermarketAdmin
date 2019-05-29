// 权限配置
<template>
  <div>
    <el-form ref="dataForm">
      <el-form-item>
        <el-tree
          ref="tree"
          :data="rollData"
          :default-checked-keys="rollCheckIds"
          :props="defaultProps"
          show-checkbox
          node-key="authNo"/>
      </el-form-item>
      <div style="display: flex;justify-content: flex-end">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { editRole } from '@/api/system'
export default {
  name: 'AccessConfiguration',
  props: {
    id: {
      type: String,
      default: ''
    },
    // 所有数据
    rollData: {
      type: Array,
      default: () => []
    },
    // 选中状态
    rollCheckIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDilog')
    },
    save() {
      // console.log(this.$refs.tree.getCheckedNodes())
      var checkedNodes = this.$refs.tree.getCheckedNodes()
      var checkPData = []
      for (let i = 0; i < this.rollData.length; i++) {
        for (let j = 0; j < checkedNodes.length; j++) {
          if (this.rollData[i].authNo === checkedNodes[j].pAuthNo) {
            checkPData.push(this.rollData[i].authNo)
            break
          }
        }
      }
      console.log(checkPData)
      var checkData = this.$refs.tree.getCheckedKeys()
      checkData = checkData.concat(checkPData)
      checkData = this.unique(checkData)
      this.updateData(checkData)
    },
    // 去重
    unique(arr) {
      var x = new Set(arr)
      return [...x]
    },
    updateData(authorityIdList) {
      if (!authorityIdList || authorityIdList.length === 0) {
        this.$message({
          message: '请选择权限',
          type: 'error'
        })
        return
      }
      var data = {
        authorityIdList: authorityIdList,
        id: this.id
      }
      editRole(data).then(response => {
        this.dialogFormVisible = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.closeDialog()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>
