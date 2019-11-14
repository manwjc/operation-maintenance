<template>
    <el-dialog class="yw-dialog"
               width="1000px"
               title="新增监控项"
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
                             :rules="rules"
                             ref="ruleForm1"
                             label-width="115px">
                        <el-form-item label="监控名称"
                                      prop="monitor_name">
                            <el-input v-model="ruleForm.monitor_name"
                                      placeholder=""
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="业务系统"
                                      prop="biz_system_id">
                            <treeselect class="yw-treeselect" v-model="ruleForm.biz_system_id"
                                        :multiple="false"
                                        :options="bizDepTreeSelOpts"
                                        placeholder="请选择" />
                        </el-form-item>
                        <el-form-item label="告警级别"
                                      prop="alert_level">
                            <el-select v-model="ruleForm.alert_level"
                                       placeholder="请选择">
                                <el-option v-for="item in alert_level"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="内网资源池"
                                      prop="idcType">
                            <el-select v-model="ruleForm.idcType"
                                       placeholder="资源池"
                                       clearable
                                       @change="idcTypeChange"
                                       filterable>
                                <el-option v-for="(item, index) in idcTypeList"
                                           :key="index"
                                           :label="item.idcType"
                                           :value="item.idcType">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="检查周期"
                                      prop="test_period">
                            <el-input v-model="ruleForm.test_period" type="number"
                                      placeholder=""
                                      clearable></el-input>分钟
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        请求返回信息
                    </template>
                    <el-form class="yw-form is-required form-info-item"
                             :model="ruleForm"
                             :rules="rules"
                             ref="ruleForm"
                             label-width="130px">
                        <el-form-item label="服务地址"
                                      prop="request_http_addr">
                            <el-input v-model="ruleForm.request_http_addr"
                                      placeholder=""
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="请求方法"
                                      prop="name">
                            <el-radio-group v-model="methodRadio">
                                <el-radio label="GET">GET</el-radio>
                                <el-radio label="POST">POST</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="content-type类型"
                                      prop="http_content_type">
                            <el-select v-model="ruleForm.http_content_type"
                                       placeholder="请选择">
                                <el-option label="application/json"
                                           value="application/json"></el-option>
                                <el-option label="text/xml"
                                           value="text/xml"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="请求参数"
                                      prop="request_parm">
                            <el-input type="textarea"
                                      :rows="3"
                                      placeholder="请输入内容"
                                      v-model="ruleForm.request_parm">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="超时时间（毫秒）"
                                      prop="time_out">
                            <el-input v-model="ruleForm.time_out" type="number"
                                      placeholder=""
                                      clearable></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form class="yw-form is-required form-info-item"
                             :model="ruleForm"
                             :rules="rules"
                             ref="ruleForm2"
                             label-width="100px">
                        
                        <el-radio-group v-model="codeRadio">
                            <!-- 返回码200 -->
                            <el-radio label="1">
                                返回码200
                                <el-form-item label="类型"
                                              prop="name">
                                    <el-radio-group v-model="typeRadio" @change="chooseType">
                                        <el-radio label="JSON">JSON</el-radio>
                                        <el-radio label="HTML">HTML</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item
                                        prop="json_val" v-if="typeRadio === 'JSON'">
                                    <span slot="label"><span style="color:red;margin-right: 4px;">*</span>JSON格式</span>
                                    obj.<el-input v-model="ruleForm.json_attribute"
                                                  style="width:80px"
                                                  placeholder=""
                                                  clearable></el-input>
                                    <el-select v-model="ruleForm.json_operator"
                                               style="width:60px"
                                               placeholder="">
                                        <el-option :label="o.name" :key="index" v-for="(o,index) in cal_operator"
                                                   :value="o.code" ></el-option>
                                    </el-select>
                                    <el-input v-model="ruleForm.json_value"
                                              style="width:80px"
                                              placeholder=""
                                              clearable></el-input>
                                    <el-tooltip content="例如a=1" placement="top">
                                        <i class="el-icon-warning"></i>
                                    </el-tooltip>
                                    <div class="my-error-tip data-filter-error" style="color:red"
                                         v-if="flag && (json_val === '' )">不能为空</div>
                                </el-form-item>
                                <el-form-item
                                        prop="html_format" v-else>
                                    <span slot="label"><span style="color:red;margin-right: 4px;">*</span>HTML格式</span>
                                    <el-input v-model="ruleForm.html_format"
                                              placeholder=""
                                              clearable></el-input>
                                    <div class="my-error-tip data-filter-error" style="color:red"
                                         v-if="flagHtml && (ruleForm.html_format=== '' || ruleForm.html_format=== null)">不能为空</div>
                                </el-form-item>
                            </el-radio>
                            <!-- 返回码200 -->
                            
                            <!-- 返回码非200 -->
                            <el-radio label="0">
                                返回码非200
                                <el-form-item
                                        prop="regular_check">
                                    <span slot="label"><span style="color:red;margin-right: 4px;">*</span>返回码正则</span>
                                    <el-input v-model="ruleForm.regular_check"
                                              placeholder=""
                                              clearable></el-input>
                                    <el-tooltip content="表达式为真则结果判断正常，否则为异常" placement="top">
                                        <i class="el-icon-warning"></i>
                                    </el-tooltip>
                                    <div class="my-error-tip data-filter-error" style="color:red"
                                         v-if="flagRegular && (ruleForm.regular_check === '' || ruleForm.regular_check=== null)">不能为空</div>
                                </el-form-item>
                                <el-form-item label=" ">
                                    <el-button @click="example('3XX')">3XX</el-button>
                                    <el-button @click="example('4XX')">4XX</el-button>
                                    <el-button @click="example('5XX')">5XX</el-button>
                                </el-form-item>
                            </el-radio>
                            <!-- 返回码非200 -->
                        </el-radio-group>
                        <p class="remarks">注：如果未按上述预调的设定返回数据，系统将判定为异常，同时发起告警！</p>
                    </el-form>
                    <el-form class="yw-form is-required form-info-item"
                             :model="backForm"
                             ref="backForm"
                             label-width="130px">
                        <el-form-item label="调用返回 headers">
                            <el-input type="textarea"
                                      :rows="3"
                                      placeholder="请输入内容"
                                      v-model="backForm.head_response">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="结果判定">
                            <el-radio-group v-model="backForm.result">
                                <el-radio label="1">正常</el-radio>
                                <el-radio label="0">异常</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    
                    </el-form>
                    <el-form class="yw-form is-required form-info-item"
                             :model="backForm"
                             ref="backForm"
                             label-width="120px">
                        <el-form-item label="调用返回 body">
                            <el-input type="textarea"
                                      :rows="3"
                                      placeholder="请输入内容"
                                      v-model="backForm.request_result">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
            </el-collapse>
        </section>
        <section class="btn-wrap">
            <el-button type="primary"
                       @click="submit(['ruleForm1','ruleForm'])">提交</el-button>
            <el-button @click="test(['ruleForm1','ruleForm'])">测试监控</el-button>
            <el-button @click="cancel()">返回</el-button>
        </section>
    </el-dialog>

</template>
<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import rbMonitorManageServicesFactory from 'src/services/alert/rb-monitorManage-services.factory.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
  import {alert_level} from 'src/pages/mirror_alert/alert_his/config/options.js'
  import {cal_operator} from 'src/pages/mirror_alert/http/options.js'
  export default {
    props: ['dialogMsg'],
    components: {Treeselect},
    data () {
      return {
        flag: false,
        flagHtml:false,
        flagRegular:false,
        json_val: '',
        bizDepTreeSelOpts: this.dialogMsg.data.bizDepTreeSelOpts,
        idcTypeList: this.dialogMsg.data.idcTypeList,
        activeCollapseNames: ['1', '2'],
        config: {},
        configId: this.dialogMsg.data.configId,
        alert_level: [],
        cal_operator: [],
        backForm: {},
        typeRadio: 'JSON',
        methodRadio: 'GET',
        codeRadio: '1',
        oldName: '',
        bizSystemList: [],
        ruleForm: {
          name: ''
        },
        rules: {
          monitor_name: [
            { required: true, message: '不能为空'}
          ],
          biz_system_id: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          alert_level: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          test_period: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          request_http_addr: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          http_content_type: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        },
        value: '',
        radio: 3
      }
    },
    mounted () {
      this.alert_level = alert_level
      this.cal_operator = cal_operator
      //this.initData()
      if(this.configId){
        this.getConfig()
      }
    },
    methods: {
      chooseType(){
        this.$refs['ruleForm2'].clearValidate()
        this.flag = false
      },
      idcTypeChange(val){
        if(val){
          let c = this.idcTypeList.find(function (r) {
            return r.idcType === val
          })
          if(c){
            this.ruleForm.idcTypeUrl = c.url
          }
        }else{
          this.ruleForm.idcTypeUrl = ''
        }
      },
      example(code){
        if(this.ruleForm.regular_check){
          this.ruleForm.regular_check += ',' + code
        }else{
          this.ruleForm.regular_check = code
        }
        this.$forceUpdate()
      },
      getConfig() {
        rbMonitorManageServicesFactory.getByKey(this.configId).then((res) => {
          if (res) {
            this.config = res
            this.ruleForm = JSON.parse(JSON.stringify(res))
            this.ruleForm.alert_level = this.ruleForm.alert_level + ''
            this.typeRadio = this.ruleForm.response_type
            this.methodRadio = this.ruleForm.request_method
            this.codeRadio = this.ruleForm.response_code + ''
            this.oldName = res.monitor_name
            let idcType = this.ruleForm.idcType
            if(idcType){
              let c = this.idcTypeList.find(function (r) {
                return r.idcType === idcType
              })
              if(c){
                this.ruleForm.idcTypeUrl = c.url
              }
            }
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
      submit (formNames) {
        let isValid = true;
        isValid = this.validData(formNames,isValid)
        if (isValid) {
          //this.ruleForm.biz_system_id = '22'
          //this.ruleForm.idcType = '信息港资源池'
          this.ruleForm.request_method = this.methodRadio
          this.ruleForm.response_type = this.typeRadio
          this.ruleForm.response_code = this.codeRadio
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
          if(this.ruleForm.idcType){
            this.isIntranet = 1
          }else{
            this.isIntranet = 0
          }
          if(this.configId){
            rbMonitorManageServicesFactory.update(this.ruleForm,this.oldName).then((res) => {
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
            this.ruleForm.status  = 1
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
      },
      validData(formNames,isValid) {
        formNames.forEach((formName,index)=>{
          this.$refs[formName].validate((valid)=>{
            if(!valid){
              isValid = valid
            }
          })
        })
        if(this.codeRadio === '0'){
          this.flagRegular = true
          this.flag = false
          this.flagHtml = false
          //this.$refs['ruleForm2'].validateField('regular_check')
          if(!this.ruleForm.regular_check){
            isValid = false
          }
        }else{
          if(this.typeRadio === 'JSON'){
            if(this.ruleForm.json_attribute && this.ruleForm.json_operator && this.ruleForm.json_value){
              this.json_val = (this.ruleForm.json_attribute) + this.ruleForm.json_operator + this.ruleForm.json_value
            }else{
              this.json_val = ''
            }
            this.flag = true
            this.flagRegular = false
            this.flagHtml = false
            if(!(this.json_val)){
              isValid = false
            }
          }else{
            this.flagHtml = true
            this.flag = false
            this.flagRegular = false
            //this.$refs['ruleForm2'].validateField('html_format')
            if(!this.ruleForm.html_format){
              isValid = false
            }
          }
        }
        return isValid
      },
      test (formNames) {
        let isValid = true;
        isValid = this.validData(formNames,isValid)
        /*this.$refs['ruleForm2'].validateField({'json_attribute','json_operator','json_value'},(valid)=>{
          if(valid){
          }
        })*/
        if (isValid) {
          //this.ruleForm.biz_system_id = '22'
          //this.ruleForm.idcType = '信息港资源池'
          this.ruleForm.request_method = this.methodRadio
          this.ruleForm.response_type = this.typeRadio    //JSON\Html
          this.ruleForm.response_code = this.codeRadio  //1:200
          //清空其他数据
          if (this.codeRadio === '1') {
            this.ruleForm.regular_check = ''
          } else {
            this.ruleForm.json_attribute = ''
            this.ruleForm.json_value = ''
            this.ruleForm.json_operator = ''
            this.ruleForm.html_format = ''
            this.ruleForm.response_type = 'JSON'
          }
          if (this.ruleForm.idcType) {
            this.ruleForm.isIntranet = 1
          } else {
            this.ruleForm.isIntranet = 0
          }
          rbMonitorManageServicesFactory.testHttp(this.ruleForm).then((res) => {
            if(res){
              this.backForm.request_result = res.request_result
              this.backForm.head_response = res.head_response
              this.backForm.result = res.result + ''
              console.log(this.backForm)
              this.$forceUpdate()
            }
            //this.$emit('closeDialog', 'update');
          }).catch(() => {
            this.$message.error('测试监控失败')
          })
        }
        // this.$emit('closeDialog');
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
    /deep/{
        .el-collapse-item__wrap{
            overflow: inherit;
        }
    }
</style>
