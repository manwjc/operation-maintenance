<template>

  <div>
    <el-form :model="validateForm" ref="validateForm" :rules="rules" class="demo-ruleForm" label-width="100px"
             style="padding-right:0px;padding-left:0px;">
      <div style="padding:20px 0px 20px 0px;text-align:center;" align="center"><h4>新增配置</h4></div>
      <el-form-item label="" label-width="260px" prop="moduleId">
        <el-select style="" align="center" placeholder="配置类型" v-model="moduleId" :disabled="discoveryModuleId !== null && discoveryModuleId !== ''">
          <el-option-group
            v-for="group in selectData"
            :key="group.id"
            :label="group.name">
            <el-option
              v-for="item in group.item"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>

      </el-form-item>


      <div v-if="moduleId!=null && moduleId != ''">

        <div id="ss" v-loading="formLoading">

          <div v-for="(item, index) in dataList">
            <el-form-item :label="item.form.name+':'" prop="name"
                          v-if="item.form.type=='singleRowText' && item.form.code == 'Y_name'" required>
              <div style="width:calc(100% - 87px);float:left;" align="left">
                <el-input v-model="validateForm.name"></el-input>
              </div>
            </el-form-item>

            <el-form-item :label="item.form.name+':'" v-if="item.form.hidden == 'false' && item.form.code != 'Y_name'"
                          :prop="'key'+item.form.id" :required=" item.form.required == 'true' ? true : false ">
              <div style="width:calc(100% - 87px);float:left;" align="left">
                <!--单行-->
                <el-input v-if="item.form.type=='singleRowText'"  :disabled="item.form.code == 'ip' && discoveryLog.instanceName !== null && discoveryLog.instanceName !== ''" v-model="validateForm['key'+item.form.id]"></el-input>
                <!-- 多行-->
                <el-input v-if="item.form.type=='multiRowText'" type="textarea" :rows="2"
                          v-model="validateForm['key'+item.form.id]"></el-input>

                <!--下拉-->
                <el-select v-if="item.form.type=='listSel'" v-model="validateForm['key'+item.form.id]">
                  <el-option v-for="op in item.formOptions" :key="op.value" :label="op.name" :value="op.value">
                  </el-option>
                </el-select>
                <!--单选-->
                <el-radio-group v-if="item.form.type=='singleSel'" v-model="validateForm['key'+item.form.id]">
                  <el-radio v-for="op in item.formOptions" :label="op.value" :key="op.value">{{op.name}}</el-radio>
                </el-radio-group>
                <!--多选  -->
                <el-checkbox-group v-if="item.form.type=='multiSel'" v-model="validateForm['key'+item.form.id]">
                  <el-checkbox v-for="op in item.formOptions" :label="op.value" :key="op.value">{{op.name}}
                  </el-checkbox>
                </el-checkbox-group>
                <!-- 小数-->
                <div v-if="item.form.type=='double' ">
                  <el-input-number v-model="validateForm['key'+item.form.id]" :step="0.01"></el-input-number>&nbsp;
                  {{item.form.unit}}
                </div>
                <!--整数-->
                <div v-if="item.form.type=='int' ">
                  <el-input-number v-if="item.form.type=='int' " v-model="validateForm['key'+item.form.id]"
                                   :step="1"></el-input-number>&nbsp; {{item.form.unit}}
                </div>
                <!--图标-->
                <div v-if="item.form.type=='image' ">
                  <el-upload
                    class="upload-demo"
                    :action="'/cmdb/instance/uploadIcon/'+item.form.id"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                    :file-list="validateForm['key'+item.form.id]"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </div>
                <!--附件-->
                <div v-if="item.form.type=='file' ">
                  <el-upload
                    class="upload-demo"
                    :action="'/cmdb/instance/uploadIcon/'+item.form.id"
                    :on-success="handleSuccess"
                    :on-remove="handleRemove"
                    :file-list="validateForm['key'+item.form.id]">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </div>
                <!--日期时间-->
                <el-date-picker v-if="item.form.type=='dateTime' " :clearable="true"
                                v-model="validateForm['key'+item.form.id]"
                                type="datetime"
                                placeholder="选择日期时间">
                </el-date-picker>
                <!--表格-->
                <el-table v-if="item.form.type=='table'" :data="validateForm['key'+item.form.id]" highlight-current-row
                          @current-change="handleCurrentChange">
                  <el-table-column v-for="it in item.formFields" :key="it.id" inline-template :label="it.name">
                    <div>
                      <el-input :value="row.name" size="small" v-model="row[it.key]">
                      </el-input>
                    </div>
                  </el-table-column>
                  <el-table-column inline-template prop="address" label="操作" width="80">
                    <div>
                      <el-dropdown @command="handleCommand" trigger="click" menu-align="start">
                        <i class="fa fa-cog"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="add_row">添加行</el-dropdown-item>
                          <el-dropdown-item command="del_row">删除行</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-table-column>
                </el-table>

                <!--引用-->
                <el-input v-if="item.form.type=='reference' " v-model="validateForm['key'+item.form.id]"></el-input>
                <!--富文本-->
                <vue-editor v-if="item.form.type=='richText' " v-model="validateForm['key'+item.form.id]"></vue-editor>

                <!-- 级联菜单 -->
                <el-cascader v-if="item.form.type=='cascader'" :options="item.casoptions[item.form.id]"
                             v-model="validateForm['key'+item.form.id]">
                </el-cascader>
                <!-- 属性分组 -->
                <div v-if="item.form.type=='groupLine'">
                  <div
                    style="height:35px;background:#20a0ff;margin-left:-100px;margin-right:-70px;color:#fff;line-height:35px;border-color:#20a0ff;border-radius:4px">
                    <span style="margin-left:20px;">{{item.form.name}}</span>
                    <i class="el-icon-caret-bottom" style="float:right;margin-right:15px;line-height:35px;"></i>
                  </div>
                </div>

              </div>

            </el-form-item>

          </div>
        </div>
        <el-form-item align="center" style="margin-top:15px;padding-right:50px;padding-left:0px;">
          <el-button type="primary" @click="onSubmit" :loading="buttonLoading">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </div>
    </el-form>


  </div>
</template>
<style lang="scss" scoped>
  @import "./addInstance.scss";
</style>
<script>
  import $ from 'jquery'
  import {downloadUrl} from 'src/assets/js/common/constants'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'

  import {
    VueEditor
  } from 'vue2-editor'

  export default {
    components: {
      VueEditor
    },
    props: ['circleId', 'discoveryModuleId', 'discoveryLog', 'type', 'show'],
    data () {
      return {
        buttonLoading: false,
        selectData: [],
        formLoading: false,
        menuType: this.type,
        log: this.discoveryLog ? this.discoveryLog : {},
        ruleForm: {
          moduleId: '',
          name: '',
          circleId: '',
          formValues: []
        },

        validateForm: {},
        moduleId: this.discoveryModuleId ? this.discoveryModuleId : '',
        dataList: [],

        isInit: false,
        rules: {},
        contextMenu: { // 自定义右键菜单，可汉化，默认布尔值
          items: {
            'row_above': {
              name: '上方插入一行'
            },
            'row_below': {
              name: '下方插入一行'
            },
            'hsep1': '---------', // 提供分隔线
            'remove_row': {
              name: '删除行'
            }
          }
        }, // 右键效果
        currentRow: null, // 表格当前选定的行
        fileList2: [],
        formRules: []
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.initData()
        }
      },
      discoveryModuleId (val) {
        this.moduleId = val
      },
      discoveryLog (val) {
        this.log = val
      }
    },
    created: function () {

    },
    mounted: function () {
      this.initData()
      this.getModuleTree()
      this.readonlyDatePicker()
    },

    methods: {
      readonlyDatePicker () {
        // var explorer = window.navigator.userAgent
        if ((!$.support.style) && (!$.support.opacity)) {
          // alert('IE')
          setTimeout(function () {
            $('.el-date-range-picker__time-header input').attr('readonly', 'readonly')
          }, 1000)
        }
      },
      // 提交表单
      onSubmit () {
        this.$refs['validateForm'].validate((valid) => {
          if (valid) {
            var Validator = require('validator.tool')
            var v = new Validator()
            for (var i = 0; i < this.dataList.length; i++) {
              for (var j = 0; j < this.dataList[i].formParams.length; j++) {
                // 邮箱,ip验证
                if (typeof (this.dataList[i].formParams[j].key) !== 'undefined' && this.dataList[i].formParams[j].key === 'validation') {
                  for (var jjj = 0; jjj < this.formRules.length; jjj++) {
                    if (typeof (this.dataList[i].formParams[j].value) !== 'undefined' && this.dataList[i].formParams[j].value === this.formRules[jjj].id && this.formRules[jjj].code === 'IP' && !v.isIp(this.validateForm['key' + this.dataList[i].form.id])) {
                      var nameS = this.dataList[i].form.name
                      this.$notify({
                        title: '提示',
                        message: nameS + ':IP验证失败！',
                        type: 'error',
                        duration: 3000
                      })
                      return false
                    }
                    if (typeof (this.dataList[i].formParams[j].value) !== 'undefined' && this.dataList[i].formParams[j].value === this.formRules[jjj].id && this.formRules[jjj].code === 'EMAIL' && !v.isEmail(this.validateForm['key' + this.dataList[i].form.id])) {
                      let nameS = this.dataList[i].form.name
                      this.$notify({
                        title: '提示',
                        message: nameS + ':EMAIL验证失败！',
                        type: 'error',
                        duration: 3000
                      })
                      return false
                    }
                  }
                }
              }
              // 数组
              if (this.dataList[i].form.type === 'multiSel' || this.dataList[i].form.type === 'table' || this.dataList[i].form.type === 'cascader' || this.dataList[i].form.type === 'file') {
                this.dataList[i].formValue = JSON.stringify(this.validateForm['key' + this.dataList[i].form.id])
              } else if (this.dataList[i].form.type === 'dateTime') {
                if (this.validateForm['key' + this.dataList[i].form.id] !== null && this.validateForm['key' + this.dataList[i].form.id] !== undefined && this.validateForm['key' + this.dataList[i].form.id] !== '') {
                  this.dataList[i].formValue = this.$options.filters['formatDate'](this.validateForm['key' + this.dataList[i].form.id].getTime())
                } else {
                  this.dataList[i].formValue = ''
                }
              } else if (this.dataList[i].form.type === 'image') {
                if (this.validateForm['key' + this.dataList[i].form.id].length > 0) {
                  for (var kk = 0; kk < this.validateForm['key' + this.dataList[i].form.id].length; kk++) {
                    var arrObj = this.validateForm['key' + this.dataList[i].form.id][kk].url.split('//')
                    var start = arrObj[1].indexOf('/')
                    this.validateForm['key' + this.dataList[i].form.id][kk].url = arrObj[1].substring(start)
                  }
                }
                this.dataList[i].formValue = JSON.stringify(this.validateForm['key' + this.dataList[i].form.id])
              } else {
                this.dataList[i].formValue = this.validateForm['key' + this.dataList[i].form.id]
              }
            }
            this.ruleForm.formValues = this.dataList
            this.ruleForm.name = this.validateForm.name
            this.ruleForm.moduleId = this.moduleId
            this.ruleForm.circleId = this.circleId
            this.buttonLoading = true
            rbCmdbServiceFactory.updateDiscoveryLog(this.log.id, {status: '已维护'}).then((data) => {
              if (data.code === 'success') {
                rbCmdbServiceFactory.addInstance(this.ruleForm).then((data) => {
                  this.buttonLoading = false
                  if (data.success === true) {
                    this.$notify({
                      title: '提示',
                      message: '新增成功',
                      type: 'success',
                      duration: 3000
                    })
                    this.closeWin()
                  } else {
                    this.$notify({
                      title: '提示',
                      message: data.msg,
                      type: 'error',
                      duration: 3000
                    })
                  }
                }).catch((e) => {
                  this.$notify({
                    title: '提示',
                    message: '新增失败',
                    type: 'error',
                    duration: 3000
                  })
                  rbCmdbServiceFactory.updateDiscoveryLog(this.log.id, '待处理').then((data) => {
                  })
                })
              }
            }).catch((e) => {
              this.buttonLoading = false
            })
            // var submitUrl = '/cmdb/instance/addInstance'
            // $.ajax({
            //   url: submitUrl,
            //   type: 'POST',
            //   contentType: 'application/json;charset=utf-8', // 设置请求头信息
            //   cache: false,
            //   async: false,
            //   traditional: true,
            //   data: JSON.stringify(this.ruleForm),
            //   dataType: 'json',
            //   success: (json, textStatus) => {
            //     if (json.success === true) {
            //       this.$notify({
            //         title: '提示',
            //         message: '新增成功',
            //         type: 'success',
            //         duration: 3000
            //       })
            //       this.closeWin()
            //     } else {
            //       this.$notify({
            //         title: '提示',
            //         message: json.msg,
            //         type: 'error',
            //         duration: 3000
            //       })
            //     }
            //   },
            //   error: (XMLHttpRequest, textStatus, errorThrown) => {
            //     this.$notify({
            //       title: '提示',
            //       message: '新增失败',
            //       type: 'error',
            //       duration: 3000
            //     })
            //   }
            // })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      closeWin: function () {
        this.$emit('childBindAdd')
      },
      closeDialog () {
        this.$emit('childBindAdd', '')
      },
      getModuleTree () {
        rbCmdbServiceFactory.getModuleTree('').then((data) => {
          this.selectData = data
        })
      //   var sysCodeUrl = '/cmdb/circle/getModuleTree'
      //   $.ajax({
      //     url: sysCodeUrl,
      //     type: 'POST',
      //     cache: false,
      //     async: true,
      //     dataType: 'json',
      //     data: ''
      //   }).done(function (data) {
      //     this.selectData = data
      //   }.bind(this))
      },

      initData () {
        this.formLoading = true
        this.isInit = false
        this.reSet()
        var paramData = {
          'moduleId': this.moduleId
        }
        rbCmdbServiceFactory.getFormValuesByModuleId(paramData).then((data) => {
          this.formLoading = false
          this.isInit = true
          this.formRules = data.formRules
          this.rules = JSON.parse(data.rule)
          this.validateForm = JSON.parse(data.validateForm)
          for (var i = 0; i < data.dataList.length; i++) {
            if (data.dataList[i].form.type === 'multiSel' || data.dataList[i].form.type === 'image' || data.dataList[i].form.type === 'file') {
            } else if (data.dataList[i].form.type === 'table') {
              var colum = []
              for (var j = 0; j < data.dataList[i].formFields.length; j++) {
                colum.push(data.dataList[i].formFields[j].name)
              }

              data.dataList[i].transforDate = []

              let tmp = {
                id: this.uuid(),
                formId: data.dataList[i].form.id
              }
              data.dataList[i].transforDate.push(tmp)
              // data.dataList[i].transforDate.push(colum)
              this.validateForm['key' + data.dataList[i].form.id] = data.dataList[i].transforDate
            } else if (data.dataList[i].form.type === 'dateTime') {
              if (data.dataList[i].form.defaultvalue !== null && data.dataList[i].form.defaultvalue !== undefined && data.dataList[i].form.defaultvalue !== '') {
                this.validateForm['key' + data.dataList[i].form.id] = new Date(Date.parse(data.dataList[i].form.defaultvalue.replace(/-/g, '/')))
              } else {
                this.validateForm['key' + data.dataList[i].form.id] = null
              }
            } else if (data.dataList[i].form.type === 'cascader') {
              this.deleteEmptyProperty(data.dataList[i].casoptions[data.dataList[i].form.id])
            } else if (data.dataList[i].form.type === 'singleRowText' || data.dataList[i].form.type === 'multiRowText' || data.dataList[i].form.type === 'double' || data.dataList[i].form.type === 'int') {
              console.log('默认值：' + data.dataList[i].form.defaultvalue)
              if (data.dataList[i].form.defaultvalue !== null && data.dataList[i].form.defaultvalue !== undefined && data.dataList[i].form.defaultvalue !== '') {
                this.validateForm['key' + data.dataList[i].form.id] = data.dataList[i].form.defaultvalue
              } else {
                if (this.type && data.dataList[i].form.code === 'ip') {
                  this.validateForm['key' + data.dataList[i].form.id] = this.discoveryLog.instanceName
                } else {
                  this.validateForm['key' + data.dataList[i].form.id] = ''
                }
                // this.validateForm['key' + data.dataList[i].form.id] = ''
              }
            } else {
              this.validateForm['key' + data.dataList[i].form.id] = ''
            }
            this.validateForm['name'] = this.discoveryLog.instanceName
          }
          // 重复实例名称校验
          var duplicateInstanceName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入名称'))
            } else {
              rbCmdbServiceFactory.checkInstancenName({
                'name': value,
                'moduleId': this.moduleId
              }).then((data) => {
                if (data.success === true) {
                } else {
                  callback(new Error('名称已存在'))
                }
              }).catch((e) => {
                callback(new Error('请求失败'))
              })
              // var goHeadUrl = '/cmdb/instance/checkInstancenName'
              // $.ajax({
              //   url: goHeadUrl,
              //   type: 'POST',
              //   data: {
              //     'name': value,
              //     'moduleId': this.moduleId
              //   },
              //   dataType: 'json',
              //   async: false,
              //   success: function (json, textStatus) {
              //     if (json.success === true) {
              //     } else {
              //       callback(new Error('名称已存在'))
              //     }
              //   },
              //   error: function (XMLHttpRequest, textStatus, errorThrown) {
              //     callback(new Error('请求失败'))
              //   }
              // })
              callback()
            }
          }
          var cc = this.rules.name
          cc[0].validator = duplicateInstanceName
          this.dataList = data.dataList
        }).catch((e) => {
          this.formLoading = false
        })
        // var sysCodeUrl = '/cmdb/instance/getFormValuesByModuleId'
        // $.ajax({
        //   url: sysCodeUrl,
        //   type: 'POST',
        //   cache: false,
        //   async: true,
        //   dataType: 'json',
        //   data: paramData
        // }).done(function (data) {
        //   this.isInit = true
        //   this.formRules = data.formRules
        //   this.rules = JSON.parse(data.rule)
        //   this.validateForm = JSON.parse(data.validateForm)
        //
        //   for (var i = 0; i < data.dataList.length; i++) {
        //     if (data.dataList[i].form.type === 'multiSel' || data.dataList[i].form.type === 'image' || data.dataList[i].form.type === 'file') {
        //     } else if (data.dataList[i].form.type === 'table') {
        //       var colum = []
        //       for (var j = 0; j < data.dataList[i].formFields.length; j++) {
        //         colum.push(data.dataList[i].formFields[j].name)
        //       }
        //
        //       data.dataList[i].transforDate = []
        //
        //       let tmp = {
        //         id: this.uuid(),
        //         formId: data.dataList[i].form.id
        //       }
        //       data.dataList[i].transforDate.push(tmp)
        //       // data.dataList[i].transforDate.push(colum)
        //
        //       this.validateForm['key' + data.dataList[i].form.id] = data.dataList[i].transforDate
        //     } else if (data.dataList[i].form.type === 'dateTime') {
        //       if (data.dataList[i].form.defaultvalue !== null && data.dataList[i].form.defaultvalue !== undefined && data.dataList[i].form.defaultvalue !== '') {
        //         this.validateForm['key' + data.dataList[i].form.id] = new Date(Date.parse(data.dataList[i].form.defaultvalue.replace(/-/g, '/')))
        //       } else {
        //         this.validateForm['key' + data.dataList[i].form.id] = null
        //       }
        //     } else if (data.dataList[i].form.type === 'cascader') {
        //       this.deleteEmptyProperty(data.dataList[i].casoptions[data.dataList[i].form.id])
        //     } else if (data.dataList[i].form.type === 'singleRowText' || data.dataList[i].form.type === 'multiRowText' || data.dataList[i].form.type === 'double' || data.dataList[i].form.type === 'int') {
        //       console.log('默认值：' + data.dataList[i].form.defaultvalue)
        //       if (data.dataList[i].form.defaultvalue !== null && data.dataList[i].form.defaultvalue !== undefined && data.dataList[i].form.defaultvalue !== '') {
        //         this.validateForm['key' + data.dataList[i].form.id] = data.dataList[i].form.defaultvalue
        //       } else {
        //         this.validateForm['key' + data.dataList[i].form.id] = ''
        //       }
        //     } else {
        //       this.validateForm['key' + data.dataList[i].form.id] = ''
        //     }
        //   }
        //   // 重复实例名称校验
        //   var duplicateInstanceName = (rule, value, callback) => {
        //     if (value === '') {
        //       callback(new Error('请输入名称'))
        //     } else {
        //       var goHeadUrl = '/cmdb/instance/checkInstancenName'
        //       $.ajax({
        //         url: goHeadUrl,
        //         type: 'POST',
        //         data: {
        //           'name': value,
        //           'moduleId': this.moduleId
        //         },
        //         dataType: 'json',
        //         async: false,
        //         success: function (json, textStatus) {
        //           if (json.success === true) {
        //           } else {
        //             callback(new Error('名称已存在'))
        //           }
        //         },
        //         error: function (XMLHttpRequest, textStatus, errorThrown) {
        //           callback(new Error('请求失败'))
        //         }
        //       })
        //       callback()
        //     }
        //   }
        //
        //   var cc = this.rules.name
        //   cc[0].validator = duplicateInstanceName
        //   this.dataList = data.dataList
        // }.bind(this))
      },
      closeBack () {
        this.$emit('childBindAdd')
      },
      reSet () {
        this.dataList = []
      },

      handleCurrentChange (row) {
        this.currentRow = row
      },
      handleTableData (data) {
        // let tmpObj = {}
        for (var i = 0; i < data.length; i++) {
          if (data[i].type === 'table') {
            let col = data[i].formFields
            for (var j = 0; j < col.length; j++) {
              this.tableCol.push(col.key)
            }
          }
        }
      },

      handleCommand (val) {
        if (val === 'add_row') { // 增加行
          let tmp = {
            id: this.uuid(),
            formId: this.currentRow.formId
          }
          this.validateForm['key' + this.currentRow.formId].push(tmp)
        } else { // 删除行
          console.log('当前删除行:' + this.currentRow.id)
          for (var i = 0; i < this.validateForm['key' + this.currentRow.formId].length; i++) {
            if (this.validateForm['key' + this.currentRow.formId][i].id === this.currentRow.id) {
              this.validateForm['key' + this.currentRow.formId].splice(i, 1)
              break
            }
          }
        }
      },
      // 生成唯一的UUID
      uuid () {
        function S4 () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
      },
      // 删除对象中空对象，空属性
      deleteEmptyProperty (object) {
        for (var i in object) {
          var value = object[i]
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              if (value.length === 0) {
                delete object[i]
                console.log('delete Array', i)
                continue
              }
            }
            this.deleteEmptyProperty(value)
            if (this.isEmpty(value)) {
              delete object[i]
            }
          } else {
            if (value === '' || value === null || value === undefined) {
              delete object[i]
            }
          }
        }
      },
      isEmpty (object) {
        for (var name in object) {
          return false
        }
        return true
      },

      handleSuccess (response, file, fileList) {
        for (var i = 0; i < fileList.length; i++) {
          if (response.success === true) {
            let formId = response.formId
            if (file.uid === fileList[i].uid) {
              fileList[i].url = downloadUrl + response.url
              fileList[i].formId = formId

              this.validateForm['key' + formId] = fileList
            }
          } else {
            let formId = response.formId
            if (file.uid === fileList[i].uid) {
              fileList.splice(i, 1)
            }
            this.validateForm['key' + formId] = fileList
          }
        }
        console.log(this.validateForm)
      },

      handleRemove (file, fileList) {
        var formId = file.formId
        for (var i = 0; i < fileList.length; i++) {
          if (file.uid === fileList[i].uid) {
            fileList.splice(i, 1)
          }
        }
        this.validateForm['key' + formId] = fileList
      }

    }
  }
</script>
