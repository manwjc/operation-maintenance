<template>
  <div class="component-container" v-loading="loading">
    <el-row>
      <el-button type="primary" size="mini" @click="save()">保存</el-button>
      <el-button type="primary" size="mini" @click="cancel()">取消</el-button>
    </el-row>
    <br/>
    <fieldset class="bootstrap-elem-field">
      <el-form :model="demand"
               :rules="rules"
               ref="demand"
               label-position="right"
               label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门"
                          prop="department1">
              <el-tooltip :content="demand.department1.orgName || '请选择一级部门'">
                <el-select v-model="demand.department1"
                           filterable
                           allow-create
                           placeholder="请选择一级部门"
                           value-key="id"
                           @change="selectFirstDep($event);getBizSysList($event)"
                           style="width: 100px">
                  <el-option v-for="(item,index) in departmentList1"
                             :key="item.id"
                             :label="item.orgName"
                             :value="item">
                  </el-option>
                </el-select>
              </el-tooltip>
              <el-tooltip :content="demand.department2.orgName || '请选择或输入二级部门'">
                <el-select v-model="demand.department2"
                           filterable
                           allow-create
                           placeholder="请选择或输入二级部门"
                           value-key="id"
                           @change="getBizSysList($event)"
                           style="width: 100px">
                  <el-option v-for="(item,index) in departmentList2"
                             :key="item.id"
                             :label="item.orgName"
                             :value="item">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用系统" prop="bizSystem">
              <el-tooltip :content="demand.bizSystem || '请选择应用系统'">
                <el-select v-model="demand.bizSystem"
                           filterable
                           allow-create
                           default-first-option
                           placeholder="请选择应用系统">
                  <el-option v-for="(item,index) in bizSysList"
                             :key="index"
                             :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求接口人"
                          prop="tenant">
              <el-input v-model="demand.tenant"
                        style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否立项">
              <el-switch v-model="demand.isProject"
                         active-color="#13ce66"
                         inactive-color="#C0CCDA"
                         active-value="是"
                         inactive-value="否"
                         active-text="是"
                         inactive-text="否"
                         @change="changeProject()"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立项时间"
                          prop="projectTime">
              <el-date-picker v-model="demand.projectTime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :editable="false"
                              placeholder="选择日期时间"
                              :disabled="isShow_projectTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求接口人电话"
                          prop="tenantPhone">
              <el-input v-model="demand.tenantPhone"
                        style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="有无容灾高可用"
                          prop="isDisaster">
              <el-switch v-model="demand.isDisaster"
                         active-color="#13ce66"
                         inactive-color="#C0CCDA"
                         active-value="有"
                         inactive-value="无"
                         active-text="有"
                         inactive-text="无"
                         @change="changeDisaster()"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容灾类型">
              <el-radio v-model="demand.disasterType"
                        label="双活"
                        :disabled="isShow_disaster">双活</el-radio>
              <el-radio v-model="demand.disasterType"
                        label="异地灾备"
                        :disabled="isShow_disaster">异地灾备</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽带要求"
                          prop="wlanRequirement">
              <el-input v-model="demand.wlanRequirement"
                        style="width: 200px"
                        :disabled="isShow_disaster"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否需主机代维">
              <el-switch v-model="demand.isHostMaintenance"
                         active-color="#13ce66"
                         inactive-color="#C0CCDA"
                         active-value="是"
                         inactive-value="否"
                         active-text="是"
                         inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源需求提出时间">
              <el-date-picker v-model="demand.submitTime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :editable="false"
                              placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源预期投产时间">
              <el-date-picker v-model="demand.commissionTime"
                              type="date"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :editable="false"
                              placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部署资源池要求"
                          prop="isIdcRequirement">
              <el-switch v-model="demand.isIdcRequirement"
                         active-color="#13ce66"
                         inactive-color="#C0CCDA"
                         active-value="有"
                         inactive-value="无"
                         active-text="有"
                         inactive-text="无"
                         @change="changeIdcRequirement()"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源池要求"
                          prop="idcRequirement">
              <!--              <el-input  style="width:80% !important;" v-model="demand.idcRequirement" :disabled="isShow_idcRequirement" ></el-input >-->
              <el-select style="width: 200px"
                         v-model="demand.idcRequirement"
                         placehoder="请选择"
                         :disabled="isShow_idcRequirement">
                <el-option v-for="(item,index) in idcRequirementList"
                           :key="index"
                           :label="item.name"
                           :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求满足周期"
                          prop="cycleTime">
              <el-date-picker format="yyyy-MM"
                              value-format="yyyy-MM"
                              :editable="false"
                              v-model="demand.cycleTime"
                              type="month"
                              placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
    <fieldset class="bootstrap-elem-field" v-for="(item, index) in demandTypeList">
      <legend>{{item.label}}</legend>
        <table class="gridtable" v-for="(data, dataIndex) in item.data">
          <tr>
            <th colspan="4" style="text-align: left;">{{data.label}}</th>
          </tr>
          <tr>
            <td width="25%">资源配置</td>
            <td width="10%">资源需求数量</td>
            <td width="40%">使用场景描述（如有IOPS、时延、数据库高可用等要求，请说明）</td>
            <td>资源用途</td>
          </tr>
          <tr v-for="(type, typeIndex) in data.data">
            <td>
              {{type.resource_type_name}}
            </td>
            <td>
              <el-input min="0" v-model="dynamicModel[data.key]['count_' + type.resource_type_id]" @change="validNumber(type.resource_type_id)"></el-input>
            </td>
            <td>
              <el-input v-model="dynamicModel[data.key]['scene_' + type.resource_type_id]"></el-input>
            </td>
            <td>
              <el-input v-model="dynamicModel[data.key]['use_' + type.resource_type_id]"></el-input>
            </td>
          </tr>
        </table>
    </fieldset>
  </div>
</template>

<script>
import cmdbServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
export default {
  components: {
  },
  prop: [],
  data () {
    return {
      loading: false,
      timeDefaultShow: new Date(),
      isShow_projectTime: true,
      isShow_disaster: true,
      isShow_idcRequirement: true,
      biz_system: [],
      demand: {
        demandId: '',
        department: '',
        department1: '',
        department2: '',
        bizSystem: '',
        tenant: '',
        tenantPhone: '',
        isProject: '',
        projectTime: '',
        submitTime: this.formatter(new Date(), 'yyyy-MM-dd'),
        isHostMaintenance: '',
        isDisaster: '',
        disasterType: '',
        wlanRequirement: '',
        commissionTime: '',
        isIdcRequirement: '',
        idcRequirement: '',
        cycleTime: ''
      },
      bizSysList: [],
      departmentList1: [],
      departmentList2: [],
      idcRequirementList: [],
      demand_id: this.$route.query.demand_id,
      demandTypeList: [],
      dynamicModel: {},
      rules: {
        department1: [
          { required: true, message: '请选部门', trigger: 'change' }
        ],
        bizSystem: [
          { required: true, message: '请选应用系统', trigger: 'change' }
        ],
        tenant: [
          { min: 0, max: 20, message: '最多20个字符', trigger: 'blur' }
        ],
        projectTime: [],
        tenantPhone: [
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '电话格式不正确', trigger: 'blur' }
        ],
        wlanRequirement: [
          { min: 0, max: 100, message: '最多100个字符', trigger: 'blur' }
        ],
        idcRequirement: [
          { min: 0, max: 125, message: '最多125个字符', trigger: 'blur' }
        ],
        systemDescription: [
          { min: 0, max: 100, message: '最多100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initModelData()
    this.getDepartment()
    // this.getBizSysList()
    this.getIdcList()
  },
  watch: {
    demand_id: function (val) {
      this.demand_id = val
    }
  },
  methods: {
    validNumber (typeId) {
      let val = this.dynamicModel[typeId]['count_' + typeId]
      const pattern = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      if (val && (!pattern.test(val))) {
        this.$message.error('请输入数字')
        this.dynamicModel[typeId]['count_' + typeId] = ''
      }
    },
    changeProject () {
      let _t = this
      if (_t.demand.isProject === '是') {
        _t.isShow_projectTime = false
        _t.rules.projectTime = [{ required: true, message: '请选择日期', trigger: 'change' }]
      } else {
        _t.isShow_projectTime = true
        _t.rules.projectTime = []
      }
    },
    changeDisaster () {
      let _t = this
      if (_t.demand.isDisaster === '有') {
        _t.isShow_disaster = false
      } else {
        _t.isShow_disaster = true
        _t.demand.disasterType = ''
      }
    },
    changeIdcRequirement () {
      let _t = this
      if (_t.demand.isIdcRequirement === '有') {
        _t.isShow_idcRequirement = false
      } else {
        _t.isShow_idcRequirement = true
      }
    },
    initModelData () {
      let _this = this
      this.loading = true
      cmdbServiceFactory.getModelDemandType().then((res) => {
        if (res) {
          _this.demandTypeList = res
          _this.dynamicModelData()
        }
      }).catch((item) => {
        _this.$message.error('查询数据失败')
      }).finally(() => {
        _this.loading = false
      })
    },
    dynamicModelData () {
      let _this = this
      this.demandTypeList.forEach((item) => {
        if (item.data) {
          item.data.forEach((item2) => {
            _this.$set(_this.dynamicModel, item2.key, {})
          })
        }
      })
    },
    cancel () {
      this.$router.push({ path: '/cmdb/demand/list' })
    },
    // 保存
    save () {
      let _t = this
      let postData = {}
      debugger
      let dep1 = _t.demand.department1.orgName || _t.demand.department1
      let dep2 = _t.demand.department2.orgName || _t.demand.department2
      if (dep2) {
        this.demand.department = dep2
      } else {
        this.demand.department = dep1
      }
      postData.demandManager = this.demand
      let resourceTypeValueList = []
      this.demandTypeList.forEach((item) => {
        if (item.data) {
          item.data.forEach((type) => {
            if (type.data) {
              type.data.forEach((dataItem) => {
                if (_t.dynamicModel[type.key]['count_' + dataItem.resource_type_id]) {
                  resourceTypeValueList.push({
                    demandId: _t.demand.demandId,
                    resourceTypeId: dataItem.resource_type_id,
                    resourceCount: _t.dynamicModel[type.key]['count_' + dataItem.resource_type_id],
                    resourceScene: _t.dynamicModel[type.key]['scene_' + dataItem.resource_type_id],
                    resourceUse: _t.dynamicModel[type.key]['use_' + dataItem.resource_type_id]
                  })
                }
              })
            }
          })
        }
      })
      postData.resourceTypeValueList = resourceTypeValueList
      // 提交postData 到后台即可
      this.$refs['demand'].validate((valid) => {
        if (valid) {
          _t.loading = true
          cmdbServiceFactory.save(postData).then((res) => {
            if (res === 'success') {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              _t.cancel()
            } else {
              this.$message.error('添加失败')
            }
          }).catch((item) => {
            _t.$message.error('保存失败')
          }).finally(() => {
            _t.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 获取资源池列表
    getIdcList () {
      let _this = this
      let obj = {
        'type': 'idcType',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      cmdbServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          _this.idcRequirementList = res
        }
      })
    },
    // 获取业务系统
    getBizSysList ($event) {
      this.demand.bizSystem = ''
      let pid = $event.id
      let obj = {
        'type': 'bizSystem',
        'pid': pid,
        'pValue': '',
        'pType': ''
      }
      cmdbServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.bizSysList = []
          this.bizSysList = res
        }
      })
    },
    // 获取部门
    getDepartment () {
      let _this = this
      cmdbServiceFactory.getDepartment({ 'pid': '0' }).then((res) => {
        if (res) {
          _this.departmentList1 = res
        }
      })
    },
    selectFirstDep ($event) {
      let _this = this
      let pid = $event.id
      cmdbServiceFactory.getDepartment({ 'pid': pid }).then((res) => {
        if (res) {
          _this.departmentList2 = res
        }
      })
    },
    indexOf (arr, key) {
      let f = false
      arr.forEach(item => {
        if (item === key) {
          f = true
          return false
        }
      })
      return f
    },
    formatter (thistime, fmt) {
      let $this = thistime
      let o = {
        'M+': $this.getMonth() + 1,
        'd+': $this.getDate(),
        'h+': $this.getHours(),
        'm+': $this.getMinutes(),
        's+': $this.getSeconds(),
        'q+': Math.floor(($this.getMonth() + 3) / 3),
        'S': $this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="scss" scoped>
  table.gridtable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border: 1px #666666;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }
  table.gridtable th {
    padding-left: 10px;
    border: 1px solid #666666;
    background-color: #dedede;
  }
  table.gridtable tr {
    height: 30px;
    line-height: 30px;
  }
  table.gridtable td {
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid #666666;
    background-color: #ffffff;
  }
  table.gridtable td:last-child {
    background: none;
  }
.el-row {
  margin-bottom: 6px !important;
}
.el-form-item {
  margin-bottom: 0px !important;
}
.el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 0;
  padding-top: 0px;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
}
  /deep/ .el-date-editor {
    width: 100%;
    max-width: 200px;
  }
.bootstrap-elem-field {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  border: 1px solid #b4b4b4;
}
.bootstrap-elem-field legend {
  margin-left: 20px;
  padding: 0 10px;
  font-size: 15px;
  /*font-weight: 100;*/
  border-bottom: none;
  width: auto;
}
.bootstrap-field-box {
  padding: 10px 15px;
}
  /deep/ .el-input__inner {
    height: 25px;
  }
</style>
