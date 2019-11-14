<template>
  <div :class="state !== 'detail' ? 'components-container yw-dashboard' : ''">
    <!-- tab -->
    <section class="yw-tab-section">
      <el-tabs class="yw-tabs"
               v-if="state !== 'detail'"
               v-loading="loading"
               value="配置字段信息">
        <el-tab-pane label="配置字段信息"
                     name="配置字段信息">
        </el-tab-pane>
      </el-tabs>
      <el-form class="yw-tab-right yw-form">
        <!--<el-button v-if="state === 'update'"-->
                   <!--@click="editData">编辑</el-button>-->
        <el-button v-if="state === 'update'"
                   @click="saveData">更新</el-button>
        <!--<el-button v-if="state === 'update'"-->
                   <!--@click="cancelUpdate">取消</el-button>-->
        <el-button v-if="state === 'add'"
                   @click="saveData">保存</el-button>
      </el-form>
    </section>
    <!-- tab -->

    <!-- 内容 -->
    <el-collapse class="yw-dashboard-section"
                 v-model="activeCollapseNames">
      <el-collapse-item :name="index+1"
                        v-for="(group, index) in form.groupList"
                        :key="index">
        <template slot="title">
          {{group.groupName}}
        </template>
        <el-form class="yw-form form-setting"
                 :inline="true"
                 :model="form"
                 ref="form">
          <el-form-item  :prop="'groupList.' + index + '.codeList.' + codeIndex + '.defaultValue'"
                        :rules="code.valid"
                        :required="code.isRequire === '是'"
                        v-for="(code, codeIndex) in group.codeList"
                        :key="codeIndex">
            <el-tooltip :disabled="code.name.length <= 7"
                        :content="code.name">
              <span class="text-ellipse"
                    style="width: 88px;">
                <i v-if="code.isRequire === '是'"
                   style="color: red">*</i> {{code.name}}
              </span>
            </el-tooltip>

            <el-tooltip :disabled="code.defaultValue && code.defaultValue.length <= 16"
                        :content="code.defaultValue ? code.defaultValue.toString() : ''">
              <span class="text-ellipse"
                    style="width: 200px;"
                    v-if="state === 'detail'">
                {{code.defaultValue}}
              </span>
            </el-tooltip>

            <div class="inline-block-middle"
                 v-if="state !== 'detail'">
              <el-select filterable
                         clearable
                         v-model="code.defaultValue"
                         v-if="code.controlCode === 'listSel'  && code.bindSource === null"
                         size="mini"
                         :placeholder="'请选择' + code.name">
                <el-option v-for="(option, index) in codeOptions[code.code]"
                           :key="index"
                           :label="option.name"
                           :value="option.value">
                </el-option>
              </el-select>
              <el-select filterable
                         clearable
                         v-model="code.defaultValue"
                         v-if="code.controlCode === 'listSel'  && code.bindSourceType === '数据字典'"
                         size="mini"
                         :placeholder="'请选择' + code.name"
                         @clear="resetCode(code)"
                         @change="handleCascaderChange($event, code)">
                <el-option v-for="(option, index) in codeOptions[code.code]"
                           :key="index"
                           :label="option.dictCode"
                           :value="option.dictCode">
                </el-option>
              </el-select>
              <el-select filterable
                         clearable
                         v-if=" code.controlCode === 'cascader'"
                         v-model="code.defaultValue"
                         @clear="resetCode(code)"
                         @change="handleCascaderChange($event, code)">
                <el-option v-for="(option, index) in codeOptions[code.code]"
                           :key="index"
                           :label="option.key"
                           :value="option.value">
                </el-option>
              </el-select>
              <el-select filterable
                         clearable
                         v-if="code.controlCode === 'listSel'
                                && code.bindSourceType === '数据表'"
                         v-model="code.defaultValue"
                         @clear="resetCode(code)"
                         @change="handleCascaderChange($event, code)">
                <el-option v-for="(option, index) in codeOptions[code.code]"
                           :key="index"
                           :label="option.key"
                           :value="option.value">
                </el-option>
              </el-select>
              <el-table border
                        v-if="code.controlCode === 'table'"
                        :data="JSON.parse(code.bindSource)">
                <el-table-column v-for="(item, index) in JSON.parse(code.bindSource)"
                                 :key="index"
                                 :label="item.key"
                                 prop="value"></el-table-column>
              </el-table>
              <el-date-picker v-model="code.defaultValue"
                              value-format="yyyy-MM-dd"
                              v-else-if="code.controlCode === 'dateTime'"></el-date-picker>
              <el-input v-if="code.controlCode === 'singleRowText'"
                        v-model="code.defaultValue"
                        :placeholder="'请输入' + code.name"></el-input>
              <el-input v-if="code.controlCode === 'ip'"
                        v-model="code.defaultValue"
                        :placeholder="'请输入' + code.name"></el-input>
              <el-input-number v-if="code.controlCode === 'int'"
                               :min="0"
                               :max="computedLength(code.codeLength)"
                               v-model="numberData[code.code]"></el-input-number>

              <!--{{test}}-->
              <!--<el-form v-model="test">-->
                <!--<el-form-item v-for="(item, index) in test"-->
                              <!--:prop="test.value1">-->
                  <!--<el-input>-->

                  <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<el-button @click="testtest">xxx</el-button>-->
              <!--</el-form>-->
            </div>

            <el-tooltip :content="code.codeTip"
                        v-if="state !== 'detail' && code.codeTip !== ''">
              <i style="line-height: 40px; color: #909399"
                 class="el-icon-question"></i>
            </el-tooltip>

          </el-form-item>
        </el-form>

      </el-collapse-item>
    </el-collapse>
    <!-- 内容 -->
  </div>
</template>

<script>
import rbValidate from 'src/pages/cmdb/v2/valid/validate.js'
import rbCmdbModuleService from 'src/services/cmdb/rb-cmdb-module-service.factory.js'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import rbCmdbDictConfigService from 'src/services/cmdb/rb-configDict-service.factory.js'

export default {
  name: 'instance-add',
  data () {
    return {
      test: {},
      activeCollapseNames: [1, 2, 3],
      moduleId: this.$route.query.moduleId,
      moduleInfo: {},
      form: {
        groupList: []
      },
      copyForm: {},
      instanceId: this.$route.query.instanceId,
      detail: null,
      state: '',
      loading: true,
      codeOptions: {},
      bindValues: [],
      instanceData: [],
      tableData: [],
      relationForm: {
        name: ''
      },
      dictData: {},
      cascaderData: [],
      numberData: {}
    }
  },
  watch: {
    $route (val) {
      if (val.fullPath.indexOf('/instance/add') > -1) {
        this.initData()
      }
    }
  },
  methods: {
    testtest () {
      this.test['value' + Object.keys(bookAuthors).length] = ''
    },
    resetCode (code) {
      let _this = this
      _this.form.groupList.forEach(item => {
        item.codeList.forEach(c => {
          if (c.refCode !== null && c.refCode.filedCode === code.code) {
            c.defaultValue = null
            this.$set(this.codeOptions, c.code, {})
          }
        })
      })
    },
    async initData () {
      this.moduleId = this.$route.query.moduleId
      this.instanceId = this.$route.query.instanceId
      this.state = this.$route.query.state
      this.form = { groupList: [] }
      this.loading = true
      rbCmdbModuleService.getModuleDetail(this.moduleId).then((data) => {
        this.moduleInfo = data
        if (this.instanceId) {
          // this.state = 'detail'
          this.getInstanceDetail()
        } else {
          this.resolveData();
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    computedLength (length) {
      let res = 0
      for (let i = 0; i < 11; i++) {
        res *= 10
        res += 9
      }
      return res
    },
    initCas() {
      this.bindValues.forEach(item => {
        let currentCode = item.code
        let bindValue = ''
        if (currentCode.controlType.controlCode === 'cascader') {
          let defaultValue = item.value
          if (currentCode.refCode !== null) {
            this.moduleInfo.groupList.forEach(group => {
              group.codeList.forEach(code1 => {
                if (code1.cmdbCode.cmdbCode.filedCode === currentCode.refCode.filedCode) {
                  bindValue = this.detail[code1.cmdbCode.cmdbCode.filedCode]
                  // console.log(this.detail)
                  if (bindValue !== null) {
                    this.bindValues.push({code: code1.cmdbCode.cmdbCode, value: bindValue})
                    bindValue = this.codeOptions[code1.cmdbCode.cmdbCode.filedCode].filter(function (option) {
                      return option.value === bindValue
                    })
                  }
                  bindValue = bindValue[0].id
                  // this.cascaderData.push(currentCode.refCode.filedCode)
                }
              })
            })
          }
        }
        if (bindValue !== '') {
          let sql = currentCode.bindSource.replace(/\?/g, bindValue)
          // this.loading = true
          rbCmdbModuleService.queryTableData({sql: sql}).then((data) => {
            // this.loading = false
            this.$set(this.codeOptions, currentCode.filedCode, data)
          })
        }
      })
    },
    async resolveData () {
      let promiseList = [];
      this.moduleInfo.groupList.forEach(group => {

        let codeList = []
        group.codeList.forEach(code => {
          this.loading = true
          let rules = []
          let length = code.cmdbCode.cmdbCode.codeLength
          let currentCode = code.cmdbCode.cmdbCode
          let _this = this
          rules.push({ max: length, message: '最大长度为' + length, trigger: ['blur', 'change'] })
          if (currentCode.isRequire === '是') {
            rules.push({ required: true, message: '必填', trigger: ['blur', 'change'] })
          }
          code.cmdbCode.validateList.forEach(valid => {
            rules.push({ validator: (rule, value, callback) => rbValidate[valid.validateFunc](rule, value, callback), trigger: ['blur', 'change'] })
          })
          let defaultValue = this.detail === null ? null : this.detail[code.cmdbCode.cmdbCode.filedCode]
          if (currentCode.controlType !== null) {
            if (currentCode.controlType.controlCode === 'listSel' && currentCode.bindSource !== null) {
              if (currentCode.bindSourceType === '数据字典') {
                if (defaultValue !== null) {
                  this.bindValues.push({ code: currentCode, value: defaultValue })
                }
                _this.$set(_this.codeOptions, currentCode.filedCode, this.dictData[currentCode.bindSource])
              }
              if (currentCode.bindSourceType === '数据表') {
                if (defaultValue !== null) {
                  this.bindValues.push({ code: currentCode, value: defaultValue })
                }
                this.loading = true

                let service = rbCmdbModuleService.queryTableData({ sql: currentCode.bindSource }).then((data) => {
                  this.loading = false
                  _this.$set(_this.codeOptions, currentCode.filedCode, data)
                })
                promiseList.push(service);

              }
            }
            if (currentCode.controlType.controlCode === 'cascader') {
              if (defaultValue !== null) {
                this.bindValues.push({ code: currentCode, value: defaultValue })
              }
              _this.cascaderData.push(currentCode.refCode.filedCode)
              // let bindValue = ''
              // if (currentCode.refCode !== null) {
              //   this.moduleInfo.groupList.forEach(group => {
              //     group.codeList.forEach(code1 => {
              //       if (code1.cmdbCode.cmdbCode.filedCode === currentCode.refCode.filedCode) {
              //         bindValue = this.detail[code1.cmdbCode.cmdbCode.filedCode]
              //         // console.log(this.detail)
              //         console.log(JSON.stringify(this.codeOptions))
              //         console.log(code1.cmdbCode.cmdbCode.filedCode)
              //         if (bindValue !== null) {
              //           this.bindValues.push({code: code1.cmdbCode.cmdbCode, value: bindValue})
              //           // bindValue = this.codeOptions[code1.cmdbCode.cmdbCode].filter(function (option) {
              //           //   return option.value === val
              //           // })
              //         }
              //         _this.cascaderData.push(currentCode.refCode.filedCode)
              //       }
              //     })
              //   })
              // }
              // if (bindValue !== '') {
              //   let sql = currentCode.bindSource.replace('?', bindValue)
              //   _this.loading = true
              //   rbCmdbModuleService.queryTableData({sql: sql}).then((data) => {
              //     _this.loading = false
              //     _this.$set(_this.codeOptions, currentCode.filedCode, data)
              //   })
              // }
            }
          }
          if (currentCode.controlType.controlCode === 'int') {
            this.$set(this.numberData, code.cmdbCode.cmdbCode.filedCode, code.defaultValue === null ? '' : code.defaultValue)
          }
          codeList.push({            code: code.cmdbCode.cmdbCode.filedCode,
            name: currentCode.filedName,
            codeId: currentCode.codeId,
            defaultValue: this.instanceId ? this.detail[code.cmdbCode.cmdbCode.filedCode] : code.defaultValue,
            colSpan: code.colSpan,
            codeLength: currentCode.codeLength === null ? 40 : currentCode.codeLength,
            bindSource: currentCode.bindSource,
            bindSourceType: currentCode.bindSourceType,
            isBuiltIn: currentCode.isBuiltIn,
            isRequire: currentCode.isRequire,
            codeTip: currentCode.codeTip,
            refCode: currentCode.refCode,
            controlCode: currentCode.controlType !== null ? currentCode.controlType.controlCode : null,
            valid: rules          })
        })
        this.form.groupList.push({ groupName: group.codeGroup.groupName, codeList: codeList })
        // this.editData()
      })

       Promise.all(promiseList).then((result) => {
         //所有上面请求完成后的操作写在这里
         if (this.state === 'update') {
           this.initCas()
         }
      }).catch((error) => {
        console.log(error)
      })



    },
    getInstanceDetail () {
      let params = {
        moduleCode: this.moduleInfo.module.code
      }
      rbCmdbServiceFactory.getFullInstance(this.instanceId, params).then((data) => {
        this.detail = data
        this.resolveData()
      })
    },
    handleCascaderChange (val, code) {
      if (val === null || val.trim() === '') {
        return
      }
      let _this = this
      if (this.cascaderData.indexOf(code.code) > -1) {
        _this.form.groupList.forEach(item => {
          item.codeList.forEach(c => {
            if (c.refCode !== null && c.refCode.filedCode === code.code) {
              let option = this.codeOptions[code.code].filter(function (option) {
                return option.value === val
              })
              let sql = c.bindSource.replace(/\?/g, option[0].id)
              delete _this.codeOptions[c.filedCode]
              c.defaultValue = null
              rbCmdbModuleService.queryTableData({ sql: sql }).then((data) => {
                _this.$set(_this.codeOptions, c.code, data)
              })
            }
          })
        })
      }
    },
    initCascaderChange (val, code) {
      if (val === null || val.trim() === '') {
        return
      }
      let _this = this
      if (this.cascaderData.indexOf(code.code) > -1) {
        _this.form.groupList.forEach(item => {
          item.codeList.forEach(c => {
            if (c.refCode !== null && c.refCode.filedCode === code.code) {
              let option = this.codeOptions[code.code].filter(function (option) {
                return option.value === val
              })
              let sql = c.bindSource.replace(/\?/g, option[0].id)
              delete _this.codeOptions[c.filedCode]
              rbCmdbModuleService.queryTableData({ sql: sql }).then((data) => {
                _this.$set(_this.codeOptions, c.code, data)
              })
            }
          })
        })
      }
    },
    editData () {
      // this.state = 'edit'
      this.copyForm = JSON.parse(JSON.stringify(this.form))

      this.bindValues.forEach(item => {
        this.$set(item.code, 'code', item.code.filedCode)
        this.initCascaderChange(item.value, item.code)
      })
    },
    cancelUpdate () {
      this.state = 'detail';
      this.$refs.form[0].clearValidate()
      this.form = JSON.parse(JSON.stringify(this.copyForm))
    },
    saveData () {
      let instanceTableList = []
      let otherTableList = []
      let ipManagerList = []
      this.form.groupList.forEach(item => {
        item.codeList.forEach(code => {
          if (code.controlCode === 'int') {
            code.defaultValue = '' + this.numberData[code.code]
          }
          if ((code.controlCode === 'listSel' && code.bindSourceType === '数据表') || code.controlCode === 'cascader') {
            if (code.defaultValue !== null) {
              code.defaultValue = code.defaultValue
            }
          }
          if (code.isBuiltIn === '是') {
            instanceTableList.push({ filedName: code.code, filedValue: code.defaultValue, codeId: code.codeId })
          }
          if (code.isBuiltIn === '否') {
            otherTableList.push({ filedName: code.code, filedValue: code.defaultValue, codeId: code.codeId })
          }
          if (code.controlCode === 'ip') {
            ipManagerList.push({ instanceId: this.instanceId, codeId: code.codeId, ip: code.defaultValue })
          }
        })
      })

      let allValid = true;
      for (let i = 0; i < this.$refs.form.length; i++) {
        this.$refs.form[i].validate((valid) => {

          if (!valid) {
            allValid = false;
            return;
          }
        })
      }

      if (allValid) {
        this.$confirm('确认' + (this.state === 'update' ? '更新？' : '新增？')).then(() => {
          let data = {
            module: this.moduleInfo.module,
            instanceData: {
              instanceTableList: instanceTableList,
              otherTableList: otherTableList,
              ipManagerList: ipManagerList
            },
            relationData: []
          }
          this.loading = true
          if (this.state === 'update') {
            rbCmdbServiceFactory.updateInstance(this.instanceId, data).then((data) => {
              this.loading = false
              if (data.success) {
                this.$notify({
                  title: '成功',
                  message: '成功添加更新到待审核列表',
                  type: 'success',
                  duration: 2000
                })
                this.$emit('closeTab', this.$route.fullPath)
                this.$router.push({ path: 'detail', query: { moduleId: this.moduleInfo.module.id, instanceId: this.instanceId, state: 'detail' } })
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.state === 'add') {
            rbCmdbServiceFactory.addInstance(data).then((data) => {
              this.loading = false
              if (data.success) {
                this.instanceId = data.instanceId
                this.$notify({
                  title: '成功',
                  message: '添加配置成功',
                  type: 'success',
                  duration: 2000
                })
                this.$emit('closeTab', this.$route.fullPath)
                this.$router.push({ path: 'detail', query: { moduleId: this.moduleInfo.module.id, instanceId: this.instanceId, state: 'detail' } })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }


      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     this.$confirm('确认' + (this.state === 'edit' ? '更新？' : '新增？')).then(() => {
      //       let data = {
      //         module: this.moduleInfo.module,
      //         instanceData: {
      //           instanceTableList: instanceTableList,
      //           otherTableList: otherTableList,
      //           ipManagerList: ipManagerList
      //         },
      //         relationData: []
      //       }
      //       this.loading = true
      //       if (this.state === 'edit') {
      //         rbCmdbServiceFactory.updateInstance(this.instanceId, data).then((data) => {
      //           this.loading = false
      //           if (data.success) {
      //             this.$notify({
      //               title: '成功',
      //               message: '更新配置成功',
      //               type: 'success',
      //               duration: 2000
      //             })
      //             this.state = 'detail'
      //             this.getDictAll()
      //           }
      //         }).catch(() => {
      //           this.loading = false
      //         })
      //       } else if (this.state === 'add') {
      //         rbCmdbServiceFactory.addInstance(data).then((data) => {
      //           this.loading = false
      //           if (data.success) {
      //             this.instanceId = data.instanceId
      //             this.$notify({
      //               title: '成功',
      //               message: '添加配置成功',
      //               type: 'success',
      //               duration: 2000
      //             })
      //             this.state = 'detail'
      //             this.getDictAll()
      //           }
      //         }).catch(() => {
      //           this.loading = false
      //         })
      //       }
      //     })
      //   }
      // })
    },
    getDictAll () {
      rbCmdbDictConfigService.getParentDict().then((data) => {
        data.forEach(item => {
          if (this.dictData[item.colName]) {
            this.dictData[item.colName].push(item)
          } else {
            this.$set(this.dictData, item.colName, [])
            this.dictData[item.colName].push(item)
          }
        })
        this.initData()
      })
    }
    // getInstance () {
    //   var query_data = {
    //     'pageNumber': 1,
    //     'pageSize': 10,
    //     'moduleId': this.module.id
    //   }
    //   rbCmdbServiceFactory.getInstanceList(query_data).then((data) => {
    //     this.instanceData = data.data
    //   })
    // }
  },
  created: function () {
    this.getDictAll()
    // this.getInstance()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .form-setting {
  .el-form-item {
    width: 32%;
  }
}
</style>
