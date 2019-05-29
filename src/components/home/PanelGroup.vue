<template>
  <div>
    <el-row :gutter="80" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">小程序</div>
            <count-to :start-val="0" :end-val="userCountData.appletUserNum" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">分润端</div>
            <count-to :start-val="0" :end-val="userCountData.appUserNum" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">代理</div>
            <count-to :start-val="0" :end-val="userCountData.agentNum" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">合作伙伴</div>
            <count-to :start-val="0" :end-val="userCountData.partnerNum" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="80">
      <el-col :span="24">
        <div style="height: 550px;margin-top: 60px">
          <el-card>
            <div style="height: 500px">
              <span>新增会员统计（总共 {{ allNewUser }} 人）</span>
              <div style="margin: 15px 0 5px 0;display: flex">
                <el-date-picker
                  v-model="date"
                  :picker-options="pickerOptions"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="selectTime"/>
              </div>
              <span style="font-size: 10px;color: dodgerblue;">(注：选择日期范围为一个月)</span>
              <ve-line :data="newUserData" style="margin-top: 50px"/>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import VeLine from 'v-charts/lib/line.common'
// import { userCount, newUser } from '@/api/home'
import { formatDate } from '../../utils/utils'
export default {
  components: {
    CountTo,
    VeLine
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      date: [],
      newUserData: {
        columns: ['日期', '小程序用户', '分润用户'],
        rows: [
          { '日期': '1/1', '小程序用户': 1393, '分润用户': 1093 },
          { '日期': '1/2', '小程序用户': 3530, '分润用户': 3230 },
          { '日期': '1/3', '小程序用户': 2923, '分润用户': 2623 },
          { '日期': '1/4', '小程序用户': 1723, '分润用户': 1423 },
          { '日期': '1/5', '小程序用户': 3792, '分润用户': 3492 },
          { '日期': '1/6', '小程序用户': 4593, '分润用户': 4293 }
        ]
      },
      startTime: undefined,
      stopTime: undefined,
      allNewUser: 0,

      userCountData: {
        agentNum: 0,
        appUserNum: 0,
        appletUserNum: 0,
        partnerNum: 0
      }
    }
  },
  created() {
    var startTime = new Date().getTime() - 30 * 1000 * 60 * 60 * 24
    var stopTime = new Date()
    this.date = [new Date(startTime), stopTime]
    this.getUserCount()
    this.getNewUser()
  },
  methods: {
    selectTime() {
      this.getNewUser()
    },
    // 统计用户数量
    getUserCount() {
      // userCount().then(response => {
      //   this.userCountData = response.data
      // })
    },
    // 新增会员统计
    getNewUser() {
      this.startTime = formatDate(this.date[0], 'yyyy-MM-dd')
      this.stopTime = formatDate(this.date[1], 'yyyy-MM-dd')
      // newUser(this.startTime, this.stopTime).then(response => {
      //   this.allNewUser = 0
      //   this.newUserData.rows = []
      //   var data = response.data.list
      //   for (let i = 0; i < data.length; i++) {
      //     var item = { '日期': data[i].time, '小程序用户': data[i].newAppletUserNum, '分润用户': data[i].newAppUserNum }
      //     this.newUserData.rows.push(item)
      //     this.allNewUser += data[i].newAppletUserNum + data[i].newAppUserNum
      //   }
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, .2);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #ffdd00
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #ffdd00
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
