// 设置手续费
<template>
  <div style="width: 100%;display: flex;justify-content: center;margin-top: 200px">
    <el-form ref="dataForm" :model="temp" :rules="rules">
      <el-form-item label="手续费(%)" prop="rate">
        <el-input v-model="temp.rate" placeholder="0.00" style="width: 300px" @input.native="inputChange(1)"/>
      </el-form-item>
      <el-form-item label="最小提现金额(¥)" prop="minEcmMoney">
        <el-input v-model="temp.minEcmMoney" placeholder="0.00" style="width: 300px" @input.native="inputChange(2)"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 150px;margin-left: 75px" @click="setData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getChargeList, setCharge } from '@/api/finance'
export default {
  name: 'SetPoundage',
  data() {
    return {
      temp: {
        minEcmMoney: undefined,
        rate: undefined
      },
      rules: {
        minEcmMoney: [{ required: true, message: '请设置手续费', trigger: 'blur' }],
        rate: [{ required: true, message: '请输入最小提现金额', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    inputChange(type) {
      this.$nextTick(() => {
        if (type === 1) {
          if (this.temp.rate) {
            this.temp.rate = this.temp.rate.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
            this.temp.rate = this.temp.rate.replace(/^\./g, '') // 验证第一个字符是数字而不是
            this.temp.rate = this.temp.rate.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
            this.temp.rate = this.temp.rate.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
          }
        } else if (type === 2) {
          if (this.temp.minEcmMoney) {
            this.temp.minEcmMoney = this.temp.minEcmMoney.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
            this.temp.minEcmMoney = this.temp.minEcmMoney.replace(/^\./g, '') // 验证第一个字符是数字而不是
            this.temp.minEcmMoney = this.temp.minEcmMoney.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
            this.temp.minEcmMoney = this.temp.minEcmMoney.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
          }
        }
      })
    },
    onSubmit() {
      console.log('submit!')
    },
    // 查询提现审核
    findAll() {
      getChargeList().then(response => {
        if (response.data.list.length > 0) {
          this.temp = response.data.list[0]
        }
      })
    },
    // 查询提现审核
    setData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          setCharge(this.temp).then(response => {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.findAll()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
