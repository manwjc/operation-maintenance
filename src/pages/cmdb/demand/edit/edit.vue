<template>
  <div class="component-container" v-loading="loading">
    <el-row>
      <el-button type="primary" size="mini"  @click="save()">保存</el-button>
      <el-button type="primary" size="mini"  @click="back()" >返回</el-button>
    </el-row>
    <br/>
    <fieldset class="bootstrap-elem-field">
      <el-form label-position="right" label-width="140px" :rules="rules" :model="demand" ref="demand">
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门" prop="department">
              <el-tooltip :disabled="!demand.department" :content="demand.department">
                <el-input v-model="demand.department" :disabled="true"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用系统" prop="bizSystem">
              <el-tooltip :disabled="!demand.bizSystem" :content="demand.bizSystem">
                <el-select v-model="demand.bizSystem" placeholder="请选择" filterable allow-create
                           default-first-option>
                  <el-option
                    v-for="(item, index) in bizSysList" :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求接口人" prop="tenant">
              <el-input v-model="demand.tenant" style="width: 200px" :disabled="true"></el-input >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否立项" prop="isProject">
              <el-switch v-model="demand.isProject" active-color="#13ce66" inactive-color="#C0CCDA" active-value="是" inactive-value="否"
                         active-text="是" inactive-text="否" @change="changeProject" :disabled="true"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立项时间" prop="projectTime">
              <el-date-picker v-model="demand.projectTime" :disabled="true" type="date"
                              value-format="yyyy-MM-dd" placeholder="选择日期时间" format="yyyy-MM-dd" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求接口人电话" prop="tenantPhone">
              <el-input v-model="demand.tenantPhone" style="width: 200px" :disabled="true"></el-input >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="有无容灾高可用" prop="isDisaster">
              <el-switch v-model="demand.isDisaster" active-color="#13ce66" inactive-color="#C0CCDA" active-value="有" inactive-value="无"
                         active-text="有" inactive-text="无" @change="changeDisaster"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容灾类型" prop="disasterType">
              <el-radio v-model="demand.disasterType" label="双活" :disabled="!control.isDisaster">双活</el-radio>
              <el-radio v-model="demand.disasterType" label="异地灾备" :disabled="!control.isDisaster">异地灾备</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽带要求" prop="wlanRequirement">
              <el-input v-model="demand.wlanRequirement" style="width: 200px" :disabled="!control.isDisaster"></el-input >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否需主机代维" prop="isHostMaintenance">
              <el-switch v-model="demand.isHostMaintenance" active-color="#13ce66" inactive-color="#C0CCDA" active-value="是" inactive-value="否"
                         active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源需求提出时间" prop="submitTime">
              <el-date-picker v-model="demand.submitTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :editable="false" :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源预期投产时间" prop="commissionTime">
              <el-date-picker v-model="demand.commissionTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部署资源池要求" prop="isIdcRequirement">
              <el-switch v-model="demand.isIdcRequirement" active-color="#13ce66" inactive-color="#C0CCDA" active-value="有" inactive-value="无"
                         active-text="有" inactive-text="无" @change="changeIdcRequirement"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源池要求" prop="idcRequirement">
<!--              <el-input  style="width:80% !important;" v-model="demand.idcRequirement" :disabled="!control.isIdcRequirement"></el-input >-->
              <el-select style="width: 200px" v-model="demand.idcRequirement" placehoder="请选择" :disabled="!control.isIdcRequirement">
                <el-option
                  v-for="(item,index) in idcRequirementList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求满足周期" prop="cycleTime">
              <el-date-picker
                format="yyyy-MM"
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
            <td width="45%">使用场景描述（如有IOPS、时延、数据库高可用等要求，请说明）</td>
            <td>资源用途</td>
          </tr>
          <tr v-for="(type, typeIndex) in data.data">
            <td style= "white-space:nowrap;overflow:hidden;text-overflow: ellipsis;" width="10%">
              {{type.resource_type_name}}
            </td>
            <td>
              <el-input v-model="dynamicModel[type.resource_type_id]['count_' + type.resource_type_id]" @change="validNumber(type.resource_type_id)"></el-input>
            </td>
            <td>
              <el-input v-model="dynamicModel[type.resource_type_id]['scene_' + type.resource_type_id]"></el-input>
            </td>
            <td>
              <el-input v-model="dynamicModel[type.resource_type_id]['use_' + type.resource_type_id]"></el-input>
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
        biz_system: [],
        demandInfo: {},
        demand: {},
        bizSysList: [],
        departmentList: [],
        idcRequirementList: [],
        demand_id: this.$route.query.demand_id,
        demandTypeList: [],
        dynamicModel: {},
        resourceTypeIds: [],
        control: {
          isProject: false,
          oldProjectTime: '',
          isDisaster: false,
          oldDisasterType: '',
          oldWlanRequirement: '',
          isIdcRequirement: false,
          oldIdcRequirement: ''
        },
        rules: {
          department: [
            { required: true, message: '请选部门', trigger: 'blur' }
          ],
          bizSystem: [
            { required: true, message: '请选应用系统', trigger: 'blur' }
          ],
          tenant: [
            {min: 0, max: 20, message: '最多20个字符', trigger: 'blur'}
          ],
          projectTime: [],
          tenantPhone: [
            {pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '号码格式不正确', trigger: 'blur'}
          ],
          wlanRequirement: [
            {min: 0, max: 100, message: '最多100个字符', trigger: 'blur'}
          ],
          idcRequirement: [
            {min: 0, max: 125, message: '最多125个字符', trigger: 'blur'}
          ],
          systemDescription: [
            {min: 0, max: 100, message: '最多100个字符', trigger: 'blur'}
          ]
        }
      }
    },
    mounted () {
      this.loading = true
      this.initModelData()
      this.getBizSysList()
      this.getDepartment()
      this.getIdcList()
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
      changeProject (val) {
        if (val === '是') {
          this.control.isProject = true
          this.demand.projectTime = this.control.oldProjectTime
          this.rules.projectTime = [{ required: true, message: '请选择日期', trigger: 'blur' }]
        } else {
          this.control.isProject = false
          this.demand.projectTime = ''
          this.rules.projectTime = []
        }
      },
      changeDisaster (val) {
        if (val === '有') {
          this.control.isDisaster = true
          this.demand.disasterType = this.control.oldDisasterType
          this.demand.wlanRequirement = this.control.oldWlanRequirement
        } else {
          this.control.isDisaster = false
          this.demand.disasterType = ''
          this.demand.wlanRequirement = ''
        }
      },
      changeIdcRequirement (val) {
        if (val === '有') {
          this.control.isIdcRequirement = true
          this.demand.idcRequirement = this.control.oldIdcRequirement
        } else {
          this.control.isIdcRequirement = false
          this.demand.idcRequirement = ''
        }
      },
      initModelData () {
        let _t = this
        cmdbServiceFactory.getModelDemandType().then((res) => {
          if (res) {
            _t.demandTypeList = res
            _t.loadDynamicModel()
            _t.initDemandInfo()
          }
        }).catch((data) => {
          _t.$message.error('查询资源分类失败')
        }).finally(() => {
          _t.loading = false
        })
      },
      initDemandInfo () {
        let _t = this
        cmdbServiceFactory.getById(this.$route.query.demand_id).then((res) => {
          if (res) {
            _t.demandInfo = res
            _t.demand = res.demandManager
            _t.control.isProject = res.demandManager.isProject === '是'
            _t.control.isDisaster = res.demandManager.isDisaster === '有'
            _t.control.isIdcRequirement = res.demandManager.isIdcRequirement === '有'
            if (_t.control.isProject) {
              this.rules.projectTime = [{ required: true, message: '请选择日期', trigger: 'blur' }]
            } else {
              this.rules.projectTime = []
            }
            if (res.resourceTypeValueList) {
              res.resourceTypeValueList.forEach((item) => {
                _t.$set(_t.dynamicModel[item.resourceTypeId], 'count_' + item.resourceTypeId, item.resourceCount || '');
                _t.$set(_t.dynamicModel[item.resourceTypeId], 'scene_' + item.resourceTypeId, item.resourceScene || '');
                _t.$set(_t.dynamicModel[item.resourceTypeId], 'use_' + item.resourceTypeId, item.resourceUse || '');
              })
            }
          }
        }).catch((data) => {
          _t.$message.error('查询需求信息失败')
        })
      },
      loadDynamicModel () {
        let _t = this
        this.demandTypeList.forEach((data) => {
          if (data.data) {
            data.data.forEach((item2) => {
              if (item2.data) {
                item2.data.forEach((dataItem) => {
                  _t.resourceTypeIds.push(dataItem.resource_type_id)
                  _t.$set(_t.dynamicModel, dataItem.resource_type_id, {});
                  _t.$set(_t.dynamicModel[dataItem.resource_type_id], 'count_' + dataItem.resource_type_id, '');
                  _t.$set(_t.dynamicModel[dataItem.resource_type_id], 'scene_' + dataItem.resource_type_id, '');
                  _t.$set(_t.dynamicModel[dataItem.resource_type_id], 'use_' + dataItem.resource_type_id, '');
                })
              }
            })
          }
        })
      },
      back () {
        this.$router.push({path: '/cmdb/demand/detail', query: {demand_id: this.demand_id}})
      },
      // 保存
      save () {
        let postData = {}
        postData.demandManager = this.demand
        let _t = this
        let resourceTypeValueList = []
        this.resourceTypeIds.forEach((item) => {
          if (_t.dynamicModel[item] && _t.dynamicModel[item]['count_' + item]) {
            resourceTypeValueList.push({
              demandId: _t.demand.demandId,
              resourceTypeId: item,
              resourceCount: _t.dynamicModel[item]['count_' + item],
              resourceScene: _t.dynamicModel[item]['scene_' + item],
              resourceUse: _t.dynamicModel[item]['use_' + item]
            })
          }
        })
        postData.resourceTypeValueList = resourceTypeValueList
        console.log(resourceTypeValueList)
        // 提交postData 到后台即可
        this.$refs['demand'].validate((valid) => {
          if (valid) {
            _t.loading = true
            cmdbServiceFactory.update(postData).then((res) => {
              if (res === 'success') {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.$router.push({path: '/cmdb/demand/list'})
              } else {
                this.$message.error('保存失败')
              }
            }).catch((item2) => {
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
      getBizSysList () {
        let obj = {
          'type': 'bizSystem',
          'pid': '',
          'pValue': '',
          'pType': ''
        }
        let _t = this
        cmdbServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            _t.bizSysList = res
          }
        })
      },
      // 获取部门
      getDepartment () {
        let obj = {
          'type': 'department1',
          'pid': '',
          'pValue': '',
          'pType': ''
        }
        let _t = this
        cmdbServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            _t.departmentList = res
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .basic {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    width: 100%;
  }
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
    color: #F56C6C;
    font-size: 12px;
    line-height: 0;
    padding-top: 0px;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 9999;
  }
  .el-date-editor {
    width: 100% !important;
    max-width: 200px !important;
  }
  .bootstrap-elem-field{
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
    border-bottom:none;
    width: auto;
  }
  .bootstrap-field-box{padding: 10px 15px;}
  /deep/ .el-input__inner {
    height: 25px;
  }
</style>
