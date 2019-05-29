// 分润会员详情
<template>
  <div class="app-container">
    <img :src="icon" style="height: 400px;width: 400px;">
    <el-row class="item">
      <el-col :span="4"><span class="text">真实姓名：{{ name }}</span></el-col>
      <el-col :span="4"><span class="text">手机号码：{{ tel }}</span></el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="4">
        <span v-if="audit === -1" class="text">实名验证：未验证</span>
        <span v-if="audit === 0" class="text">实名验证：申请中</span>
        <span v-if="audit === 1" class="text">实名验证：已通过</span>
        <span v-if="audit === 2" class="text">实名验证：已拒绝</span>
      </el-col>
      <el-col :span="4">
        <span v-if="isShopkeeper === 1" class="text">是否为店主：是</span>
        <span v-else class="text">是否为店主：否</span>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="4"><span class="text">注册时间：{{ regTime }}</span></el-col>
    </el-row>
    <div style="margin-top: 40px">
      <el-button type="primary">名下店铺</el-button>
      <el-button type="primary">流水明细</el-button>
      <el-button type="primary">采购订单</el-button>
      <el-button type="primary">售卖订单</el-button>
      <el-button type="primary">租赁订单</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FrUserDetails',
  data() {
    return {
      icon: undefined,
      name: undefined,
      tel: undefined,
      audit: undefined,
      isShopkeeper: undefined,
      regTime: undefined,
      temp: {}
    }
  },
  created() {
    this.getParams()
  },
  methods: {
    getParams() {
      this.icon = this.$route.params.icon
      this.name = this.$route.params.name
      this.tel = this.$route.params.tel
      this.audit = this.$route.params.audit
      this.isShopkeeper = this.$route.params.isShopkeeper
      this.regTime = this.$route.params.regTime
    }
  }
}
</script>

<style scoped>
  .text{
    font-size: 15px;
    color: #303133;
  }
  .item{
    margin-left: 20px;
    margin-top: 25px;
  }
</style>
