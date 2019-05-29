// 分润设置
<template>
  <div class="app-container">

    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="90px"
      style="width: 750px; margin-left:50px;">
      <el-row :gutter="50">
        <el-col :span="14">
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="分润名称" prop="name" label-width="90px">
                <el-input v-model="temp.name" placeholder="分润名称"/>
              </el-form-item>
              <el-form-item label="售价(¥)" prop="price" label-width="90px">
                <el-input v-model="temp.price" placeholder="售价" @input.native="inputChange(1)"/>
              </el-form-item>
              <el-form-item label="成本(¥)" prop="cost" label-width="90px">
                <el-input v-model="temp.cost" :disabled="true" placeholder="成本"/>
              </el-form-item>
              <span style="font-size: 11px;color: red">（注：创业者门店成本归属商家）</span>
              <el-form-item :label="'商家('+ temp.priceUnit +')'" prop="merchant" label-width="90px">
                <el-input v-model="temp.merchant" placeholder="商家" @input.native="inputChange(2)"/>
              </el-form-item>
              <el-form-item :label="'加盟店('+ temp.priceUnit +')'" prop="franchisee" label-width="90px">
                <el-input v-model="temp.franchisee" placeholder="加盟店" @input.native="inputChange(3)"/>
              </el-form-item>
              <el-form-item :label="'基金('+ temp.priceUnit +')'" prop="fund" label-width="85px">
                <el-input v-model="temp.fund" placeholder="基金" @input.native="inputChange(4)"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="'省代('+ temp.priceUnit +')'" prop="province" label-width="100px">
                <el-input v-model="temp.province" placeholder="省代" @input.native="inputChange(5)"/>
              </el-form-item>
              <el-form-item :label="'市代('+ temp.priceUnit +')'" prop="town" label-width="100px">
                <el-input v-model="temp.town" placeholder="市代" @input.native="inputChange(6)"/>
              </el-form-item>
              <el-form-item :label="'区代('+ temp.priceUnit +')'" prop="district" label-width="100px">
                <el-input v-model="temp.district" placeholder="区代" @input.native="inputChange(7)"/>
              </el-form-item>
              <el-form-item :label="'服务员('+ temp.priceUnit +')'" prop="waiter" label-width="100px">
                <el-input v-model="temp.waiter" placeholder="服务员" @input.native="inputChange(8)"/>
              </el-form-item>
              <el-form-item :label="'利润('+ temp.priceUnit +')'" prop="profit" label-width="100px">
                <el-input v-model="temp.profit" :disabled="true" placeholder="利润" @input.native="inputChange(9)"/>
              </el-form-item>
              <el-form-item label="优惠金额(¥)" label-width="100px">
                <el-input v-model="temp.discounts" placeholder="优惠金额" @input.native="inputChange(10)"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="'国家慈善('+ temp.priceUnit +')'" prop="gjcsFenrun" label-width="110px">
            <span>总共{{ temp.gjcsFenrun }}</span>
          </el-form-item>
          <el-form-item
            v-for="item in temp.guojiaList"
            :key="item.key"
            :label="item.name + '(' + temp.priceUnit + ')'"
            label-width="140px"
            style="margin-left: 20px">
            <el-input v-model="item.money"/>
          </el-form-item>
          <el-form-item :label="'地方慈善('+ temp.priceUnit +')'" prop="dfcsFenrun" label-width="110px">
            <span>总共{{ temp.dfcsFenrun }}</span>
          </el-form-item>
          <el-form-item
            v-for="item in temp.shengList"
            :key="item.key"
            :label="item.name + '(' + temp.priceUnit + ')'"
            label-width="140px"
            style="margin-left: 20px">
            <el-input v-model="item.money"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="createData()">通过</el-button>
    </div>
  </div>
</template>

<script>
import { getBeneficence, getShengBeneficence } from '@/api/funds'
import { applyEdit } from '@/api/fenrun'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    cityId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      tableKey: 0,
      total: 0,
      listQuery: {
        page: 1,
        size: 12,
        pageSizes: [12, 24, 36, 48],
        deviceTypeId: undefined,
        area: undefined,
        mergerName: undefined
      },
      dialogFormVisible: false,
      temp: {
        title: undefined,
        id: undefined,
        beneficenceType: 2, // 慈善类型 1:国家慈善, 2:地方慈善
        parentId: 100000, // 父级城市编码
        levelType: 1, // 0:国家，1:省，2:市，3:区
        select1: undefined,
        select2: undefined,
        select3: undefined,
        guojiaList: [],
        shengList: [],
        cityId: undefined, // 城市id
        cost: 6, // 成本（单位：分）
        deviceTypeId: undefined, // 设备类型id
        district: undefined, // 区代得 （单位：分）
        franchisee: undefined, // 加盟店得 （单位：分）
        fund: undefined, // 基金分润（单位：分）
        merchant: undefined, // 商家得（单位：分）
        name: undefined, // 分润名
        price: undefined, // 单价（单位：分）
        profit: undefined, // 利润（单位：分）
        discounts: undefined, // 会员优惠金额
        province: undefined, // 省代得（单位：分）
        town: undefined, // 市代得（单位：分）
        waiter: undefined, // 服务员得（单位：分）
        placeBenefit: [], // 地方慈善分润配置列表
        stateBenefit: [], // 地方慈善分润配置列表
        priceUnit: '¥',
        gjcsFenrun: 0.25, // 国家慈善分润
        dfcsFenrun: 0.25, // 地方慈善分润
        status: 1
      },
      temp2: {
        parentId: 100000, // 父级城市编码
        levelType: 1, // 0:国家，1:省，2:市，3:区
        select1: undefined,
        select2: undefined,
        select3: undefined,
        areaType: undefined,
        guojiaList: [],
        shengList: [],
        cityId: undefined // 城市id
      },
      rules: {
        areaType: [{ required: true, message: '请选择区域类型', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市区域', trigger: 'blur' }],
        cost: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
        deviceTypeId: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        district: [{ required: true, message: '请输入区代分润', trigger: 'blur' }],
        franchisee: [{ required: true, message: '请输入加盟店分润', trigger: 'blur' }],
        fund: [{ required: true, message: '请输入基金分润', trigger: 'blur' }],
        merchant: [{ required: true, message: '请输入商家分润', trigger: 'blur' }],
        name: [{ required: true, message: '请输入分润名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
        profit: [{ required: true, message: '请输入利润', trigger: 'blur' }],
        province: [{ required: true, message: '请输入省代分润', trigger: 'blur' }],
        town: [{ required: true, message: '请输入市代分润', trigger: 'blur' }],
        waiter: [{ required: true, message: '请输入推荐人分润', trigger: 'blur' }],
        gjcsFenrun: [{ required: true, message: '请输入国家分润', trigger: 'blur' }],
        dfcsFenrun: [{ required: true, message: '请输入地方分润', trigger: 'blur' }],
        discounts: [{ required: true, message: '请输入优惠金额', trigger: 'blur' }]
      },
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      sortOptionsShi2: [],
      sortOptionsQu2: [],
      clickItem: undefined // 点中的item
    }
  },
  watch: {
    'temp.price': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.merchant': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter) {
        if (this.temp.priceUnit === '%') {
          this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
              parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
              parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
              parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
        } else {
          this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
              parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
              parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
              parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
        }
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.franchisee': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.fund': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.province': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.town': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.district': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    },
    'temp.waiter': function(newVal) {
      if (!(this.temp.price && this.temp.merchant && this.temp.franchisee && this.temp.fund && this.temp.province && this.temp.town && this.temp.district && this.temp.waiter)) {
        return
      }
      if (this.temp.priceUnit === '%') {
        this.temp.profit = 100 - parseFloat(parseFloat(this.temp.cost) / parseFloat(this.temp.price) * 100) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      } else {
        this.temp.profit = parseFloat(this.temp.price) - parseFloat(this.temp.cost) -
            parseFloat(this.temp.merchant) - parseFloat(this.temp.franchisee) - parseFloat(this.temp.fund) -
            parseFloat(this.temp.province) - parseFloat(this.temp.town) - parseFloat(this.temp.district) - parseFloat(this.temp.waiter) -
            parseFloat(this.temp.gjcsFenrun) - parseFloat(this.temp.dfcsFenrun)
      }
      this.temp.profit = Math.floor(this.temp.profit * 10000) / 10000
    }
  },
  created() {
    this.reGetShengBeneficence()
    this.reFunds()
  },
  methods: {
    inputChange(position) {
      this.$nextTick(() => {
        if (position === 1 && this.temp.price) {
          this.temp.price = this.temp.price.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        } else if (position === 2 && this.temp.merchant) {
          this.temp.merchant = this.temp.merchant.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.merchant = this.temp.merchant.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.merchant = this.temp.merchant.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.merchant = this.temp.merchant.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.merchant = this.temp.merchant.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 3 && this.temp.franchisee) {
          this.temp.franchisee = this.temp.franchisee.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.franchisee = this.temp.franchisee.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.franchisee = this.temp.franchisee.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.franchisee = this.temp.franchisee.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.franchisee = this.temp.franchisee.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 4 && this.temp.fund) {
          this.temp.fund = this.temp.fund.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.fund = this.temp.fund.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.fund = this.temp.fund.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.fund = this.temp.fund.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.fund = this.temp.fund.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 5 && this.temp.province) {
          this.temp.province = this.temp.province.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.province = this.temp.province.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.province = this.temp.province.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.province = this.temp.province.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.province = this.temp.province.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 6 && this.temp.town) {
          this.temp.town = this.temp.town.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.town = this.temp.town.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.town = this.temp.town.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.town = this.temp.town.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.town = this.temp.town.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 7 && this.temp.district) {
          this.temp.district = this.temp.district.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.district = this.temp.district.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.district = this.temp.district.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.district = this.temp.district.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.district = this.temp.district.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 8 && this.temp.waiter) {
          this.temp.waiter = this.temp.waiter.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.waiter = this.temp.waiter.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.waiter = this.temp.waiter.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.waiter = this.temp.waiter.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.waiter = this.temp.waiter.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 9 && this.temp.profit) {
          this.temp.profit = this.temp.profit.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.profit = this.temp.profit.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.profit = this.temp.profit.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.profit = this.temp.profit.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.profit = this.temp.profit.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        } else if (position === 10 && this.temp.discounts) {
          this.temp.discounts = this.temp.discounts.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          this.temp.discounts = this.temp.discounts.replace(/^\./g, '') // 验证第一个字符是数字而不是
          this.temp.discounts = this.temp.discounts.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          this.temp.discounts = this.temp.discounts.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          this.temp.discounts = this.temp.discounts.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入n位小数
        }
      })
    },
    refreshData() {
      if (!this.clickItem) {
        return
      }
      for (let i = 0; i < this.temp.shengList.length; i++) {
        this.temp.shengList[i].money = undefined
        for (let j = 0; j < this.clickItem.placeBenefit.length; j++) {
          console.log(this.clickItem.placeBenefit[j].beneficence.id)
          if (this.clickItem.placeBenefit[j].beneficence.id === this.temp.shengList[i].id) {
            this.temp.shengList[i].money = this.clickItem.placeBenefit[j].money
            break
          }
        }
      }
    },
    // 获取国家慈善列表
    reFunds() {
      this.temp.beneficenceType = 1 // 慈善类型 1:国家慈善, 2:地方慈善
      getBeneficence(this.temp).then(response => {
        this.temp.guojiaList = response.data.list
      })
    },
    // 获取地方慈善列表
    reGetShengBeneficence() {
      getShengBeneficence(this.cityId).then(response => {
        this.temp.shengList = response.data.list
        this.refreshData()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.id
          // 国家慈善基金计算
          var allGuojiaMoney = 0
          this.temp.stateBenefit = []
          for (let i = 0; i < this.temp.guojiaList.length; i++) {
            allGuojiaMoney += parseFloat(this.temp.guojiaList[i].money)
            const benefitBean = {
              beneficenceId: undefined,
              money: undefined
            }
            benefitBean.beneficenceId = this.temp.guojiaList[i].id
            benefitBean.money = this.temp.guojiaList[i].money ? this.temp.guojiaList[i].money : 0
            this.temp.stateBenefit.push(benefitBean)
          }
          if (allGuojiaMoney > this.temp.gjcsFenrun) {
            this.$message({
              message: '国家慈善分润计算有误',
              type: 'error'
            })
            return
          }
          // 地方慈善基金计算
          var allplaceMoney = 0
          this.temp.placeBenefit = []
          for (let i = 0; i < this.temp.shengList.length; i++) {
            allplaceMoney += parseFloat(this.temp.shengList[i].money)
            const benefitBean = {
              beneficenceId: undefined,
              money: undefined
            }
            benefitBean.beneficenceId = this.temp.shengList[i].id
            benefitBean.money = this.temp.shengList[i].money ? this.temp.shengList[i].money : 0
            this.temp.placeBenefit.push(benefitBean)
          }
          if (allplaceMoney > this.temp.dfcsFenrun) {
            this.$message({
              message: '地方慈善分润计算有误',
              type: 'error'
            })
            return
          }
          if (this.temp.profit <= 0) {
            this.$message({
              message: '利润设置有误',
              type: 'error'
            })
            return
          }
          var profitMoney = 0
          // 判断优惠金额是否合理
          if (this.temp.priceUnit === '%') {
            profitMoney = parseFloat(this.temp.profit) * parseFloat(this.temp.price) * 0.4 // 最大优惠价格
          } else {
            profitMoney = parseFloat(this.temp.profit) * 0.4 // 最大优惠价格
          }
          if (!this.temp.discounts) {
            this.temp.discounts = 0
          }
          if (parseFloat(this.temp.discounts) > profitMoney) {
            this.$message({
              message: '优惠价格不能大于利润的40%',
              type: 'error'
            })
            return
          }
          // 请求接口
          applyEdit(this.temp).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('closeDilog')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
