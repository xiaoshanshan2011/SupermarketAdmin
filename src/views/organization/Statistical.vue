// 统计报表
<template>
  <div class="app-container">
    <div style="height: 550px">
      <el-card>
        <div style="height: 500px">
          <span>资金统计（总共 ¥345）</span>
          <div style="margin: 15px 0 5px 0;display: flex">
            <div>
              <el-date-picker
                v-model="moneyStartTime"
                :picker-options="optionsStart"
                type="date"
                placeholder="开始日期"
                @change="selectStartTime"/>
            </div>
            <div style="margin-left: 20px">
              <el-date-picker
                v-model="moneyEndTime"
                :picker-options="optionsEnd"
                type="date"
                placeholder="结束日期"
                @change="selectStartTime"/>
            </div>
          </div>
          <span style="font-size: 10px;color: dodgerblue;">(注：选择日期范围为一个月)</span>
          <ve-pie :data="moneyData" style="margin-top: 50px"/>
        </div>
      </el-card>
    </div>
    <div style="height: 500px">
      <el-card>
        <div style="height: 500px">
          <div style="margin-bottom: 50px">
            <span>区域统计</span>
            <el-select v-model="temp.select1" style="width: 100px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity(2)">
              <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
            </el-select>
            <el-select v-model="temp.select2" style="width: 100px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity(3)">
              <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
            </el-select>
          </div>
          <ve-histogram :data="chartData" :settings="chartSettings"/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram.common'
import VePie from 'v-charts/lib/pie.common'
import { moneyStatistics, areaStatistics } from '@/api/home'
import { formatDate } from '../../utils/utils'
import { getCity } from '@/api/funds'
export default {
  name: 'Statistical',
  components: { VeHistogram, VePie },
  data() {
    this.chartSettings = {
      metrics: ['售卖订单', '设备数量', '门店数量'],
      dimension: ['地区']
    }
    return {
      chartData: {
        columns: ['地区', '售卖订单', '设备数量', '门店数量'],
        rows: []
      },
      // 资金统计数据
      moneyData: {
        columns: ['账户', '金额'],
        rows: []
      },
      moneyStartTime: '',
      moneyEndTime: '',
      optionsStart: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      optionsEnd: {
        disabledDate(time) {
          var disabled1 = time.getTime() > Date.now()
          return disabled1
        }
      },
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      temp: {
        cityId: undefined,
        parentId: 100000, // 父级城市编码
        levelType: 1, // 0:国家，1:省，2:市，3:区
        select1: undefined,
        select2: undefined,
        select3: undefined
      }
    }
  },
  created() {
    this.moneyStartTime = new Date((new Date().getTime() - 30 * 1000 * 60 * 60 * 24))
    this.moneyEndTime = new Date()
    this.getMoneyStatistics()
    this.getAreaStatistics()
    this.reGetCity(1)
  },
  methods: {
    selectStartTime() {
      this.getMoneyStatistics()
    },
    // 资产统计
    getMoneyStatistics() {
      console.log(this.moneyStartTime)
      console.log(this.moneyEndTime)
      var startTime = formatDate(this.moneyStartTime, 'yyyy-MM-dd')
      var stopTime = formatDate(this.moneyEndTime, 'yyyy-MM-dd')
      moneyStatistics(startTime, stopTime).then(response => {
        var data = response.data
        var moneyData = {
          columns: ['账户', '金额'],
          rows: []
        }
        moneyData.rows[0] = { '账户': '分润账户（¥' + data.fenrun + '）', '金额': data.fenrun }
        moneyData.rows[1] = { '账户': '成本账户（¥' + data.cost + '）', '金额': data.cost }
        moneyData.rows[2] = { '账户': '合作伙伴账户（¥' + data.partner + '）', '金额': data.partner }
        moneyData.rows[3] = { '账户': '公司利润（¥' + data.company + '）', '金额': data.company }
        this.moneyData = moneyData
      })
    },
    // 区域统计
    getAreaStatistics() {
      areaStatistics(this.temp.cityId).then(response => {
        var chartData = {
          columns: ['地区', '售卖订单', '设备数量', '门店数量'],
          rows: []
        }
        var list = response.data.list
        for (let i = 0; i < list.length; i++) {
          var item = { '地区': list[i].cityName, '售卖订单': list[i].sellOrderNum, '设备数量': list[i].deviceNum, '门店数量': list[i].storeNum }
          chartData.rows.push(item)
        }
        this.chartData = chartData
      })
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
        this.temp.cityId = this.temp.select1
        this.getAreaStatistics()
      } else if (level === 3) {
        this.sortOptionsQu = undefined
        this.temp.select3 = undefined
        this.temp.parentId = this.temp.select2
        this.temp.cityId = this.temp.select2
        this.getAreaStatistics()
        return
      }
      getCity(this.temp).then(response => {
        if (this.temp.levelType === 1) {
          var data = response.data
          data.unshift({ name: '全国', id: undefined })
          this.sortOptionsShen = data
        } else if (this.temp.levelType === 2) {
          this.sortOptionsShi = response.data
        } else if (this.temp.levelType === 3) {
          this.sortOptionsQu = response.data
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
