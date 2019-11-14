<template>
  <el-dialog class="yw-dialog"
             width="1000px"
             title="监控项详情"
             :visible.sync="dialogMsg.dialogVisible">
    <section class="yw-dialog-main">
      <el-collapse class="yw-dashboard-section"
                   v-model="activeCollapseNames">
        <el-collapse-item name="1">
          <template slot="title">
            监控定义
          </template>
          <el-form class="yw-form is-required"
                   :inline="true"
                   :model="ruleForm"
                   label-width="115px">
            <el-form-item label="监控名称"
                          prop="monitor_name">
                {{ruleForm.monitor_name}}
            </el-form-item>
            <el-form-item label="业务系统"
                          prop="biz_system_id">
                  {{ruleForm.biz_system_id}}
            </el-form-item>
            <el-form-item label="告警级别"
                          prop="alert_level">
                {{getAlertLevel(ruleForm.alert_level)}}
            </el-form-item><br/>
              <el-form-item label="资源池"
                            prop="idcType">
                  {{ruleForm.idcType}}
              </el-form-item>
            <el-form-item label="检查周期"
                          prop="test_period">
                {{ruleForm.test_period}}分钟
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            请求返回信息
          </template>
          <el-form class="yw-form is-required form-info-item"
                   :model="ruleForm"
                   ref="ruleForm"
                   label-width="130px">
            <el-form-item label="服务地址"
                          prop="request_http_addr">
                {{ruleForm.request_http_addr}}
            </el-form-item>
            <el-form-item label="请求方法"
                          prop="request_method">
                {{ruleForm.request_method}}
            </el-form-item>
            <el-form-item label="content-type类型"
                          prop="http_content_type">
                {{ruleForm.http_content_type}}
            </el-form-item>

            <el-form-item label="请求参数"
                          prop="request_parm">
                <p>{{ruleForm.request_parm}}</p>
            </el-form-item>
            <el-form-item label="超时时间（毫秒）"
                          prop="time_out">
                {{ruleForm.time_out}}
            </el-form-item>
          </el-form>
          <el-form class="yw-form is-required form-info-item"
                   :model="ruleForm"
                   ref="ruleForm"
                   label-width="100px">

            <el-radio-group v-model="codeRadio" >
              <!-- 返回码200 -->
              <el-radio label="1" v-if="codeRadio === '1'" disabled >
                返回码200
                <el-form-item label="类型"
                              >
                  <el-radio-group v-model="typeRadio" disabled>
                    <el-radio label="JSON">JSON</el-radio>
                    <el-radio label="HTML">HTML</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="JSON格式"
                              prop="json_attribute" v-if="typeRadio === 'JSON'">
                  obj.{{ruleForm.json_attribute}}{{getOperater(ruleForm.json_operator)}}{{ruleForm.json_value}}
                  <i class="el-icon-warning"></i>
                </el-form-item>
                  <el-form-item label="HTML格式"
                                prop="html_format" v-else>
                      {{ruleForm.html_format}}
                  </el-form-item>
              </el-radio>
              <!-- 返回码200 -->

              <!-- 返回码非200 -->
              <el-radio label="0" v-else disabled >
                返回码非200
                <el-form-item label="返回码正则"
                              prop="regular_check">
                    {{ruleForm.regular_check}}
                  <i class="el-icon-warning"></i>
                </el-form-item>
                <el-form-item label=" ">
                  <el-button>3XX</el-button>
                  <el-button>4XX</el-button>
                  <el-button>5XX</el-button>
                </el-form-item>
              </el-radio>
              <!-- 返回码非200 -->
            </el-radio-group>
            <p class="remarks">注：如果未按上述预调的设定返回数据，系统将判定为异常，同时发起告警！</p>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </section>
    <section class="btn-wrap">
        <el-button @click="cancel()">返回</el-button>
    </section>
  </el-dialog>

</template>
<script>
  import rbMonitorManageServicesFactory from 'src/services/alert/rb-monitorManage-services.factory.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import {alert_level} from 'src/pages/mirror_alert/alert_his/config/options.js'
  import {cal_operator} from 'src/pages/mirror_alert/http/options.js'
export default {
  props: ['dialogMsg'],

  data () {
    return {
      cal_operator: [],
      activeCollapseNames: ['1', '2'],
      config: {},
      configId: this.dialogMsg.data.configId,
      alert_level: [],
      backForm: {},
      typeRadio: 'JSON',
      methodRadio: 'GET',
      codeRadio: '1',
      bizSystemList: [],
      idcTypeList: [],
      ruleForm: {
        name: ''
      },
      value: '',
      radio: 3
    }
  },
  mounted () {
    this.alert_level = alert_level
    this.cal_operator = cal_operator
    this.initData()
    if(this.configId){
        this.getConfig()
    }
  },
  methods: {
    getOperater(oper){
        let obj = this.cal_operator.find(function(o){
          return o.code === oper
        })
      if(obj){
        return obj.name
      }
    },
    getAlertLevel(level){
      let obj = this.alert_level.find(function(o){
        return o.value === (level + '')
      })
      if(obj){
        return obj.label
      }
    },
    getConfig() {
      rbMonitorManageServicesFactory.getByKey(this.configId).then((res) => {
        if (res) {
          this.config = res
          this.ruleForm = JSON.parse(JSON.stringify(res))
          this.typeRadio = this.ruleForm.response_type
          this.methodRadio = this.ruleForm.request_method
          this.codeRadio = this.ruleForm.response_code + ''
        }
      })
    },
    initData () {
      let obj = {
        'type': 'idcType',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.idcTypeList = res
        }
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.biz_system_id = '22'
          this.ruleForm.idcType = '信息港资源池'
          this.ruleForm.request_method = this.methodRadio
          this.ruleForm.response_type = this.typeRadio
          this.ruleForm.response_code = this.codeRadio
          this.ruleForm.status  = 1
          //清空其他数据
          if (this.codeRadio === '1'){
            this.ruleForm.regular_check = ''
          }else{
            this.ruleForm.json_attribute = ''
            this.ruleForm.json_value = ''
            this.ruleForm.json_operator = ''
            this.ruleForm.html_format = ''
            this.ruleForm.response_type = 'JSON'
          }
          if(this.configId){
            rbMonitorManageServicesFactory.update(this.ruleForm).then((res) => {
              if (res === 'fail') {
                this.$message.warning('监控名称已经存在，请重新命名！')
                return
              }
              this.$message.success('修改成功')
              this.$emit('closeDialog', 'update');
            }).catch(() => {
              this.$message.error('修改失败')
            })
          }else{
            rbMonitorManageServicesFactory.create(this.ruleForm).then((res) => {
              if (res === 'fail') {
                this.$message.warning('监控名称已经存在，请重新命名！')
                return
              }
              this.$message.success('新增成功')
              this.$emit('closeDialog', 'update');
            }).catch(() => {
              this.$message.error('新增失败')
            })
          }
        }
      })
    },
    test () {
      this.$emit('closeDialog');
    },
    cancel () {
      this.$emit('closeDialog');
    }
  }
}

</script>
<style lang="scss" scoped>
/deep/ .form-info-item {
  display: inline-block;
  vertical-align: top;
  width: 47%;
  min-height: 152px;
  border: 1px solid $color-border;
  padding: 10px;
  margin-bottom: 10px;
  &:nth-of-type(even) {
    margin-left: 25px;
  }
  &:nth-of-type(1),
  &:nth-of-type(2) {
    height: 265px;
  }
  .el-textarea {
    width: $width-base;
  }
  .el-radio__label {
    .el-form-item {
      padding-left: 20px;
    }
  }
}
</style>
