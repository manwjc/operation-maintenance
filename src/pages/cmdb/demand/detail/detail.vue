<template>
  <div class="component-container" v-loading="loading">
    <el-row>
      <el-button type="primary" size="mini" @click="edit()">编辑需求</el-button>
      <el-button type="primary" size="mini" @click="back()" >返回</el-button>
    </el-row>
    <br/>
    <fieldset class="bootstrap-elem-field">
      <el-form label-position="right" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门">
              <div class="detail_value">{{demand.demandManager.department}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用系统">
              <div class="detail_value">{{demand.demandManager.bizSystem}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求接口人">
              <div class="detail_value">{{demand.demandManager.tenant}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否立项">
              <div class="detail_value">{{demand.demandManager.isProject}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="立项时间">
              <div class="detail_value">{{demand.demandManager.projectTime}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求接口人电话">
              <div class="detail_value">{{demand.demandManager.tenantPhone}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="有无容灾高可用">
              <div class="detail_value">{{demand.demandManager.isDisaster}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="容灾类型">
              <div class="detail_value">{{demand.demandManager.disasterType}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽带要求">
              <div class="detail_value">{{demand.demandManager.wlanRequirement}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否需主机代维">
              <div class="detail_value">{{demand.demandManager.isHostMaintenance}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源需求提出时间">
              <div class="detail_value">{{demand.demandManager.submitTime}}</div>
              <span v-model="demand.submitTime"></span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源预期投产时间">
              <div class="detail_value">{{demand.demandManager.commissionTime}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部署资源池要求">
              <div class="detail_value">{{demand.demandManager.isIdcRequirement}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源池要求">
              <div class="detail_value">{{demand.demandManager.idcRequirement}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求满足周期">
              <div class="detail_value">{{demand.demandManager.cycleTime}}</div>
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
            <td width="20%">资源配置</td>
            <td width="10%">资源需求数量</td>
            <td width="35%">使用场景描述（如有IOPS、时延、数据库高可用等要求，请说明）</td>
            <td width="35%">资源用途</td>
          </tr>
          <tr v-for="(type, typeIndex) in data.data">
            <td style= "white-space:nowrap;overflow:hidden;text-overflow: ellipsis;">
              {{type.resource_type_name}}
            </td>
            <td>
              {{dynamicModel[type.resource_type_id]['count_' + type.resource_type_id]}}
            </td>
            <td>
              {{dynamicModel[type.resource_type_id]['scene_' + type.resource_type_id]}}
            </td>
            <td>
              {{dynamicModel[type.resource_type_id]['use_' + type.resource_type_id]}}
            </td>
          </tr>
        </table>
    </fieldset>
    <fieldset class="bootstrap-elem-field">
      <legend>需求变化记录</legend>
      <table class="gridtable">
        <tr>
          <th style="width: 20%; text-align: center;">资源项</th>
          <th style="width: 20%; text-align: center;">历史值</th>
          <th style="width: 20%; text-align: center;">当前值</th>
          <th style="width: 20%; text-align: center;">修改时间</th>
          <th style="width: 20%; text-align: center;">修改人员</th>
        </tr>
        <tr v-for="(defItem, defIndex) in defData">
          <td style="width: 20%; text-align: center;">{{defItem.name}}</td>
          <td style="width: 20%; text-align: center;">{{defItem.oldVal}}</td>
          <td style="width: 20%; text-align: center;">{{defItem.newVal}}</td>
          <td style="width: 20%; text-align: center;">{{defItem.updateTime}}</td>
          <td style="width: 20%; text-align: center;">{{defItem.updateUser}}</td>
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
        demandId: this.$route.query.demand_id,
        biz_system: [],
        demand: {},
        demand2: {},
        dynamicModel: {},
        defData: []
      }
    },
    mounted () {
      this.initModelData()
    },
    watch: {
    },
    methods: {
      initModelData () {
        let _t = this
        this.loading = true
        cmdbServiceFactory.getModelDemandType().then((res) => {
          if (res) {
            _t.demandTypeList = res
            _t.loadDynamicModel()
            _t.initDemandInfo()
          }
        }).catch((data) => {
          _t.$message.error('查询资源分类失败')
        }).finally(() => {
          this.loading = false
        })
      },
      initDemandInfo () {
        let _t = this
        cmdbServiceFactory.getById(this.$route.query.demand_id).then((res) => {
          if (res) {
            _t.demand = res
            _t.defData = res.changedList
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
        }).finally(() => {
          _t.loading = false
        })
      },
      loadDynamicModel () {
        let _t = this
        this.demandTypeList.forEach((data) => {
          if (data.data) {
            data.data.forEach((item2) => {
              if (item2.data) {
                item2.data.forEach((dataItem) => {
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
        this.$router.push({path: '/cmdb/demand/list'})
      },
      edit () {
        this.$router.push({path: '/cmdb/demand/edit', query: {demand_id: this.demandId}})
      }
    }
  }
</script>
<style lang="scss" scoped>
  table.gridtable {
    font-family: verdana,arial,sans-serif;
    font-size:11px;
    color:#333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }
  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #dedede;
  }
  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #ffffff;
  }
  .el-row {
    margin-bottom: 0px !important;
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
  .el-input-number__decrease {
    display: none;
  }
  .el-input-number__increase {
    right: 9999px !important;
  }
  .el-input-number .el-input__inner {
    text-align: left !important;
    padding-left: 10px !important;
    padding-right:10px !important;
  }
  .detail_value {
    font-weight: bold;
    color: #1E90FF;
  }
  .detail_value2 {
    color: #1E90FF;
  }

  .bootstrap-elem-field{
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    border-width: 1px;
    border-style: solid;
    border-color: #b4b4b4;
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
</style>
