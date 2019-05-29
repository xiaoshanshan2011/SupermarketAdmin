// 分润设置
<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.deviceTypeId" style="width: 140px" class="filter-item" value-key="key" @change="findAll">
        <el-option v-for="item in deviceTypeList2" :key="item.id" :label="item.typeName" :value="item.id"/>
      </el-select>
      <el-select v-model="temp2.select1" style="width: 105px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity2(2)">
        <el-option v-for="item in sortOptionsShen" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="temp2.select2" style="width: 105px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity2(3)">
        <el-option v-for="item in sortOptionsShi2" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="temp2.select3" style="width: 105px" class="filter-item" value-key="key" placeholder="区/县" @change="reGetCity2(4)">
        <el-option v-for="item in sortOptionsQu2" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;margin-bottom: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1)*listQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分润名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceType">{{ scope.row.deviceType.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="售价">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="成本">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商家">
        <template slot-scope="scope">
          <span>{{ scope.row.merchant }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="加盟店">
        <template slot-scope="scope">
          <span>{{ scope.row.franchisee }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="利润">
        <template slot-scope="scope">
          <span>{{ scope.row.profit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="城市区域">
        <template slot-scope="scope">
          <span v-if="scope.row.city" style="font-size: 12px">{{ scope.row.city.mergerName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">详情/编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :page-sizes.sync="listQuery.pageSizes" @pagination="findAll" />

    <el-dialog :title="temp.title" :visible.sync="dialogFormVisible" width="900px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 750px; margin-left:50px;">
        <el-row :gutter="50">
          <el-col :span="14">
            <el-form-item v-if="dialogStatus === 'create'" label="设备类型" prop="deviceTypeId" label-width="85px">
              <el-select v-model="temp.deviceTypeId" style="width: 120px" class="filter-item" value-key="key" @change="sblx()">
                <el-option v-for="item in deviceTypeList" :key="item.id" :label="item.typeName" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item v-else label="设备类型" prop="deviceTypeId" label-width="85px">
              <el-select v-model="temp.deviceTypeId" disabled style="width: 120px" class="filter-item" value-key="key" @change="sblx()">
                <el-option v-for="item in deviceTypeList" :key="item.id" :label="item.typeName" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create'" label="区域类型" prop="areaType" label-width="90px">
              <el-radio-group v-model="temp.areaType">
                <el-radio v-for="item in temp.areaTypeList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-else label="区域类型" prop="areaType" label-width="90px">
              <el-radio-group v-model="temp.areaType">
                <el-radio v-for="item in temp.areaTypeList" :label="item.id" :key="item.id" disabled>{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="dialogStatus === 'create'">
              <el-form-item v-if="temp.areaType" label="城市区域" prop="cityId" label-width="90px">
                <el-select v-model="temp.select1" style="width: 105px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity(2)">
                  <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
                </el-select>
                <el-select v-if="temp.areaType === 2 || temp.areaType === 3" v-model="temp.select2" style="width: 105px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity(3)">
                  <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
                </el-select>
                <el-select v-if="temp.areaType === 3" v-model="temp.select3" style="width: 105px" class="filter-item" value-key="key" placeholder="区/县" @change="reGetCity(4)">
                  <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
                </el-select>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item v-if="temp.areaType" label="城市区域" prop="cityId" label-width="90px">
                <el-select v-model="temp.select1" disabled style="width: 105px" class="filter-item" value-key="key" placeholder="省" @change="reGetCity(2)">
                  <el-option v-for="item1 in sortOptionsShen" :key="item1.id" :label="item1.name" :value="item1.id"/>
                </el-select>
                <el-select v-if="temp.areaType === 2 || temp.areaType === 3" v-model="temp.select2" disabled style="width: 105px" class="filter-item" value-key="key" placeholder="市" @change="reGetCity(3)">
                  <el-option v-for="item2 in sortOptionsShi" :key="item2.id" :label="item2.name" :value="item2.id"/>
                </el-select>
                <el-select v-if="temp.areaType === 3" v-model="temp.select3" disabled style="width: 105px" class="filter-item" value-key="key" placeholder="区/县" @change="reGetCity(4)">
                  <el-option v-for="item3 in sortOptionsQu" :key="item3.id" :label="item3.name" :value="item3.id"/>
                </el-select>
              </el-form-item>
            </div>
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
            <el-form-item v-for="item in temp.guojiaList" :key="item.key" :label="item.name + '(' + temp.priceUnit + ')'" label-width="140px" style="margin-left: 20px">
              <el-input v-model="item.money"/>
            </el-form-item>
            <el-form-item :label="'地方慈善('+ temp.priceUnit +')'" prop="dfcsFenrun" label-width="110px">
              <span>总共{{ temp.dfcsFenrun }}</span>
            </el-form-item>
            <el-form-item v-for="item in temp.shengList" :key="item.key" :label="item.name + '(' + temp.priceUnit + ')'" label-width="140px" style="margin-left: 20px">
              <el-input v-model="item.money"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():editData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { getCity, getBeneficence, getShengBeneficence } from '@/api/funds'
import { getDeviceTypeList2 } from '@/api/device'
import { setFenrun, getFenrunList, editFenrun } from '@/api/fenrun'
export default {
  name: 'FenRunSet',
  components: { Pagination },
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
        fenrunType: 0,
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
        areaType: undefined,
        areaTypeList: [
          {
            id: 1,
            name: '省'
          },
          {
            id: 2,
            name: '市'
          },
          {
            id: 3,
            name: '区'
          }
        ],
        guojiaList: [],
        shengList: [],
        cityId: undefined, // 城市id
        cost: undefined, // 成本（单位：分）
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
        dfcsFenrun: 0.25 // 地方慈善分润
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
      dialogStatus: undefined,
      sortOptionsShen: [],
      sortOptionsShi: [],
      sortOptionsQu: [],
      sortOptionsShi2: [],
      sortOptionsQu2: [],
      deviceTypeList: [],
      deviceTypeList2: [],
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
    this.findAll()
    this.reGetCity(1)
    this.reFunds()
    this.reGetDeviceTypeList()
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
    // 获取列表数据
    findAll() {
      this.listLoading = true
      getFenrunList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleCreate() {
      this.temp.title = '创建地瓜分润'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.areaType = undefined
      this.temp.deviceTypeId = undefined
      this.temp.select1 = undefined
      this.temp.select2 = undefined
      this.temp.select3 = undefined
      this.temp.discounts = undefined
      this.sortOptionsShi = undefined
      this.sortOptionsQu = undefined
      this.temp.shengList = []
      this.temp.name = undefined
      this.temp.cost = 6
      this.temp.district = undefined
      this.temp.franchisee = undefined
      this.temp.fund = undefined
      this.temp.merchant = undefined
      this.temp.price = 28
      this.temp.profit = undefined
      this.temp.province = undefined
      this.temp.town = undefined
      this.temp.waiter = undefined
      this.clickItem = undefined
      for (let i = 0; i < this.temp.guojiaList.length; i++) {
        this.temp.guojiaList[i].money = undefined
      }
      for (let i = 0; i < this.temp.shengList.length; i++) {
        this.temp.shengList[i].money = undefined
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(item) {
      this.temp.title = '分润详情'
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.temp.areaType = item.areaType
      this.temp.deviceTypeId = item.deviceType.id
      this.temp.select1 = undefined
      this.temp.select2 = undefined
      this.temp.select3 = undefined
      this.sortOptionsShi = undefined
      this.sortOptionsQu = undefined
      this.temp.shengList = []
      this.temp.name = item.name
      this.temp.cost = item.cost
      this.temp.district = item.district
      this.temp.franchisee = item.franchisee
      this.temp.fund = item.fund
      this.temp.merchant = item.merchant
      this.temp.price = item.price
      this.temp.discounts = item.discounts
      this.temp.profit = item.profit
      this.temp.province = item.province
      this.temp.town = item.town
      this.temp.waiter = item.waiter
      this.temp.areaType = item.city.levelType
      this.temp.cityId = item.city.id
      this.temp.id = item.id
      this.clickItem = item
      for (let i = 0; i < this.temp.guojiaList.length; i++) {
        this.temp.guojiaList[i].money = undefined
        for (let j = 0; j < item.stateBenefit.length; j++) {
          if (item.stateBenefit[j].beneficence.id === this.temp.guojiaList[i].id) {
            this.temp.guojiaList[i].money = item.stateBenefit[j].money
            break
          }
        }
      }
      this.reEditGetCity(item.city.id, item.city.parentId, item.city.levelType)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    // 城市数据
    reGetCity(level) {
      this.temp.levelType = level
      if (level === 2) {
        this.sortOptionsShi = undefined
        this.sortOptionsQu = undefined
        this.temp.select2 = undefined
        this.temp.select3 = undefined
        this.temp.cityId = undefined
        this.temp.parentId = this.temp.select1
        this.reGetShengBeneficence()
        if (this.temp.areaType === 1) {
          this.temp.cityId = this.temp.select1
        }
      } else if (level === 3) {
        this.sortOptionsQu = undefined
        this.temp.select3 = undefined
        this.temp.cityId = undefined
        this.temp.parentId = this.temp.select2
        if (this.temp.areaType === 2) {
          this.temp.cityId = this.temp.select2
        }
      } else if (level === 4) {
        this.temp.cityId = this.temp.select3
        return
      }
      getCity(this.temp).then(response => {
        if (this.temp.levelType === 1) {
          this.sortOptionsShen = response.data
        } else if (this.temp.levelType === 2) {
          this.sortOptionsShi = response.data
        } else if (this.temp.levelType === 3) {
          this.sortOptionsQu = response.data
        }
      })
    },
    // 城市数据
    reGetCity2(level) {
      this.temp2.levelType = level
      if (level === 2) {
        this.sortOptionsShi2 = undefined
        this.sortOptionsQu2 = undefined
        this.temp2.select2 = undefined
        this.temp2.select3 = undefined
        this.temp2.cityId = undefined
        this.temp2.parentId = this.temp2.select1
        if (this.temp2.areaType === 1) {
          this.temp2.cityId = this.temp2.select1
        }
        for (let i = 0; i < this.sortOptionsShen.length; i++) {
          if (this.sortOptionsShen[i].id === this.temp2.select1) {
            this.listQuery.mergerName = this.sortOptionsShen[i].mergerName
          }
        }
        this.findAll()
      } else if (level === 3) {
        this.sortOptionsQu2 = undefined
        this.temp2.select3 = undefined
        this.temp2.cityId = undefined
        this.temp2.parentId = this.temp2.select2
        if (this.temp2.areaType === 2) {
          this.temp2.cityId = this.temp2.select2
        }
        for (let i = 0; i < this.sortOptionsShi2.length; i++) {
          if (this.sortOptionsShi2[i].id === this.temp2.select2) {
            this.listQuery.mergerName = this.sortOptionsShi2[i].mergerName
          }
        }
        this.findAll()
      } else if (level === 4) {
        this.temp2.cityId = this.temp2.select3
        this.listQuery.mergerName = this.temp2.select3.mergerName
        for (let i = 0; i < this.sortOptionsQu2.length; i++) {
          if (this.sortOptionsQu2[i].id === this.temp2.select3) {
            this.listQuery.mergerName = this.sortOptionsQu2[i].mergerName
          }
        }
        this.findAll()
        return
      }
      getCity(this.temp2).then(response => {
        if (this.temp2.levelType === 1) {
          this.sortOptionsShen = response.data
        } else if (this.temp2.levelType === 2) {
          this.sortOptionsShi2 = response.data
        } else if (this.temp2.levelType === 3) {
          this.sortOptionsQu2 = response.data
        }
      })
    },

    // 获取城市数据
    reEditGetCity(id, parentId, levelType) {
      this.temp.parentId = parentId
      this.temp.levelType = levelType
      getCity(this.temp).then(response => {
        if (this.temp.levelType === 1) {
          // 省
          this.sortOptionsShen = response.data
          this.temp.select1 = id
          this.reGetShengBeneficence()
        } else if (this.temp.levelType === 2) {
          // 市
          this.sortOptionsShi = response.data
          this.temp.select2 = id
          id = parentId
          parentId = 100000
          levelType = 1
          this.reEditGetCity(id, parentId, levelType)
        } else if (this.temp.levelType === 3) {
          // 区
          this.sortOptionsQu = response.data
          this.temp.select3 = id
          id = parentId
          parentId = parseInt(parentId / 10000) * 10000
          levelType = 2
          this.reEditGetCity(id, parentId, levelType)
        }
      })
    },
    // 获取国家慈善列表
    reFunds() {
      this.temp.beneficenceType = 1 // 慈善类型 1:国家慈善, 2:地方慈善
      getBeneficence(this.temp).then(response => {
        this.temp.guojiaList = response.data.list
      })
    },
    // 获取国家慈善列表
    reGetShengBeneficence() {
      getShengBeneficence(this.temp.select1).then(response => {
        this.temp.shengList = response.data.list
        this.refreshData()
      })
    },
    // 查找所有设备类型
    reGetDeviceTypeList() {
      getDeviceTypeList2().then(response => {
        this.deviceTypeList = response.data.list
        const all = {
          id: undefined,
          typeName: '全部设备类型'
        }
        this.deviceTypeList2.push(all)
        for (let i = 0; i < this.deviceTypeList.length; i++) {
          this.deviceTypeList2.push(this.deviceTypeList[i])
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
          setFenrun(this.temp).then(response => {
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
    editData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
            benefitBean.money = this.temp.guojiaList[i].money
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
            benefitBean.money = this.temp.shengList[i].money
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
          editFenrun(this.temp).then(response => {
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
    sblx() {
      for (let i = 0; i < this.deviceTypeList.length; i++) {
        if (this.temp.deviceTypeId === this.deviceTypeList[i].id) {
          const typeName = this.deviceTypeList[i].typeName
          if (typeName === '按份卖') {
            this.temp.priceUnit = '¥'
            this.temp.gjcsFenrun = 0.25
            this.temp.dfcsFenrun = 0.25
            this.temp.cost = 6 // 按份卖成本价
          } else if (typeName === '按斤卖') {
            this.temp.priceUnit = '%'
            this.temp.gjcsFenrun = 0.125
            this.temp.dfcsFenrun = 0.125
            this.temp.cost = 0 // 按斤卖成本价
          } else {
            this.temp.priceUnit = '¥'
            this.temp.gjcsFenrun = 0.25
            this.temp.dfcsFenrun = 0.25
            this.temp.cost = 6 // 按份卖成本价
          }
          break
        }
      }
      // 清空分润数据
      this.temp.merchant = undefined
      this.temp.district = undefined
      this.temp.franchisee = undefined
      this.temp.fund = undefined
      this.temp.profit = undefined
      this.temp.province = undefined
      this.temp.town = undefined
      this.temp.waiter = undefined
      for (let i = 0; i < this.temp.guojiaList.length; i++) {
        this.temp.guojiaList[i].money = undefined
      }
      for (let i = 0; i < this.temp.shengList.length; i++) {
        this.temp.shengList[i].money = undefined
      }
    }
  }
}
</script>

<style scoped>

</style>
