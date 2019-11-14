<template>
  <div style="height: 100%;overflow: hidden">
    <el-container style="padding-top: 10px;height: 90%;">
      <el-aside class="aside" width="16%" v-if="parentForm.state !== 'detail'">
        <div style="padding: 5px">
          <div class="button-box">
            <el-button type="text" size="mini" @click="addArea"><i class="el-icon-plus"/>添加区域</el-button>
          </div>
          <el-row type="flex" :offset="2" justify="space-between">
            <el-col :span="24"><el-input v-model="keyword" placeholder="请输入关键字">
              <!--<el-button slot="append" icon="el-icon-search" ></el-button>-->
            </el-input></el-col>
          </el-row>

          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(item, index) in codeByGroup" :key="index" :title="item.groupName" :name="item.groupName">
              <draggable style="cursor: move" :class="item.groupName" v-model="item.codeList" :options="dragOptions">
                <el-row :class="{unDraggable: code.unDraggable}" v-for="(code, index) in item.codeList"
                        :key="index" v-show="code.cmdbCode.cmdbCode.controlType.controlCode !== 'groupLine'">
                  {{code.cmdbCode.cmdbCode.filedName}}
                </el-row>
              </draggable>
            </el-collapse-item>
          </el-collapse>
        </div>

      </el-aside>
      <div class="boder-line"></div>
      <el-main  style="overflow: hidden">
        <!--右边区域分组字段-->
        <el-container style="height: 100%">
          <el-aside  width="70%" style="overflow-y: auto;height: 100%">
            <!--<el-col :span="18">-->
            <el-form :model="form" ref="form">
              <el-form-item class="filed-box" :prop="'groupList.' + index + '.codeGroup.groupName'" v-for="(item, index) in form.groupList" :key="index"  :rules="[{required:true, message: '请输区域名', trigger: 'blur'}]">
                <el-form :model="form.groupList[index]">
                  <el-row class="box-header" type="flex" justify="space-between">
                    <el-col style="width: calc(100% - 20px)">
                      <el-form-item prop="codeGroup.groupName'">
                        <el-input v-model="item.codeGroup.groupName" placeholder="请输区域名"></el-input>
                      </el-form-item>
                    </el-col>
                    <!--<el-col :span="1">-->
                      <i style="color: #909399;line-height: 40px;margin-right: 10px" class="el-icon-close" @click="handleAreaDelete(index)"></i>
                    <!--</el-col>-->
                  </el-row>
                  <el-row class="box-body">
                    <draggable class="code-list" style="min-height: 40px;" v-model="item.codeList"
                               :options="dragOptions2" @add="onAdd">
                      <el-col class="code-box" v-for="(code, codeIndex) in item.codeList" :key="codeIndex" :span="code.colSpan ? 24/code.colSpan : 6">
                        <el-col style="width: calc(100% - 30px)">
                          <el-form :model="code"  label-width="80px"  @click.native="showCodeInfo(code)">
                            <el-form-item prop="cmdbCode.cmdbCode.defaultValue"  :label="code.cmdbCode.cmdbCode.filedName">
                              <el-select v-model="code.cmdbCode.cmdbCode.defaultValue" v-if="code.cmdbCode.cmdbCode.controlType.controlCode === 'listSel'
                                                                                            || code.cmdbCode.cmdbCode.controlType.controlCode === 'cascader'" @click.native="showCodeInfo(code)" disabled size="mini" placeholder="">
                                <!--<el-option v-for="(option, index) in codeOptions[code.cmdbCode.cmdbCode.bindSource]" :key="index" :label="option.name" :value="option.value">-->
                                <!--</el-option>-->
                              </el-select>
                              <el-date-picker v-else-if="code.cmdbCode.cmdbCode.controlType.controlCode === 'dateTime'" disabled></el-date-picker>
                              <el-input v-else disabled></el-input>
                            </el-form-item>
                          </el-form>
                        </el-col>
                        <!--<el-col :span="2">-->
                          <i style="color: #909399;line-height: 40px;float: right;margin-right: 10px" class="el-icon-close" v-if="code.cmdbCode.cmdbCode.isBuiltIn === '否'" @click="handleDelete(code, index, codeIndex)"></i>
                        <!--</el-col>-->
                      </el-col>
                    </draggable>
                  </el-row>
                </el-form>
              </el-form-item>
            </el-form>
            <!--</el-col>-->
          </el-aside>
          <div class="boder-line"></div>
          <el-main>
            <!--选择校验数据默认值-->
            <el-col class="info-box" style="float: right">
              <el-row class="info-title">
                字段信息
              </el-row>
              <div class="info-body">
                <el-form label-width="70px"  v-if="showInfo">
                  <el-form-item label="码表编码">
                    <el-input disabled v-model="currentCode.cmdbCode.cmdbCode.filedCode"></el-input>
                  </el-form-item>
                  <el-form-item label="码表名称">
                    <el-input disabled v-model="currentCode.cmdbCode.cmdbCode.filedName"></el-input>
                  </el-form-item>
                  <el-form-item label="码表类型">
                    <el-input disabled v-model="currentCode.cmdbCode.controlType.controlName"></el-input>
                  </el-form-item>
                  <el-form-item label="提示信息">
                    <el-input disabled v-model="currentCode.cmdbCode.cmdbCode.codeTip"></el-input>
                  </el-form-item>
                  <el-form-item label="级联码表" v-if="currentCode.cmdbCode.controlType.controlCode === 'cascader'">
                    <el-input disabled v-model="currentCode.cmdbCode.cmdbCode.refCode.filedName"></el-input>
                  </el-form-item>
                  <el-form-item label="默认值" prop="defaultValue">
                    <el-select filterable clearable v-if="currentCode.cmdbCode.controlType.controlCode === 'listSel' && currentCode.cmdbCode.cmdbCode.bindSource === null" v-model="currentCode.defaultValue">
                      <!--<el-option v-for="(option, index) in codeOptions[currentCode.cmdbCode.cmdbCode.filedCode]" :key="index" :label="option.name" :value="option.name">-->
                      <!--</el-option>-->
                    </el-select>
                    <el-select filterable clearable v-if="currentCode.cmdbCode.controlType.controlCode === 'listSel' && currentCode.cmdbCode.cmdbCode.bindSourceType === '数据字典'" v-model="currentCode.defaultValue">
                      <el-option v-for="(option, index) in codeOptions[currentCode.cmdbCode.cmdbCode.filedCode]" :key="index" :label="option.name" :value="option.name">
                      </el-option>
                    </el-select>
                    <el-select filterable clearable v-if="currentCode.cmdbCode.controlType.controlCode === 'listSel'
                                && currentCode.cmdbCode.cmdbCode.bindSourceType === '数据表'
                                 || currentCode.cmdbCode.controlType.controlCode === 'cascader'" v-model="currentCode.defaultValue">
                      <el-option v-for="(option, index) in codeOptions[currentCode.cmdbCode.cmdbCode.filedCode]" :key="index" :label="option.value" :value="option.id">
                      </el-option>
                    </el-select>
                    <el-date-picker v-if="currentCode.cmdbCode.controlType.controlCode === 'dateTime'" v-model="currentCode.defaultValue" :placeholder="'请选择'"></el-date-picker>
                    <el-input v-if="currentCode.cmdbCode.controlType.controlCode === 'singleRowText'" v-model="currentCode.defaultValue"></el-input>
                    <el-input v-if="currentCode.cmdbCode.controlType.controlCode === 'ip'" v-model="currentCode.defaultValue"></el-input>
                    <el-input-number v-if="currentCode.cmdbCode.controlType.controlCode === 'int'" :min="1" :max="computedLength" v-model="currentCode.defaultValue"></el-input-number>
                  </el-form-item>
                  <el-form-item label="宽度" prop="colSpan">
                    <div class="width-box">
                      <el-radio-group v-model="currentCode.colSpan" size="mini" @change="setColSpan" >
                        <el-radio-button label="1">整行</el-radio-button>
                        <el-radio-button label="2">1/2行</el-radio-button>
                        <el-radio-button label="3">1/3行</el-radio-button>
                        <el-radio-button label="4">1/4行</el-radio-button>
                      </el-radio-group>
                    </div>
                  </el-form-item>
                  <el-form-item label="验证方法" prop="cmdbCode.validateList">
                    <el-select v-model="currentCode.cmdbCode.validateList" value-key="validateId"  multiple collapse-tags>
                      <el-option v-for="(item, index) in valids"  :key="item.validateId" :label="item.validateName" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <div style="text-align: center;">
      <el-button @click="cancel">取消</el-button>
      <el-button  @click="resetForm('form')">重置</el-button>
      <el-button  type="primary" @click="onSubmit('form')">提交</el-button>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import cmdbCodeService from 'src/services/cmdb/rb-cmdb-code-services.factory'
  import rbCmdbModuleService from 'src/services/cmdb/rb-cmdb-module-service.factory.js'
  export default {
    name: 'other-fields',
    props: ['parentForm'],
    components: {draggable},
    data () {
      return {
        activeNames: [], // 默认打开区域名
        codeByGroup: [], // 分组码表数据
        form: {
          module: {},
          groupList: []   // 区域码表数据
        },
        keyword: '',
        copyForm: {},
        copyCodeByGroup: [],
        showInfo: false,
        valids: [],
        currentCode: {},
        codeOptions: {},
        defaultColSpan: '2',
        loading: function () {},
        dragOptions: {
          animation: 0,
          group: {
            name: 'code-list',
            pull: 'clone',
            put: false
          },
          sort: false,
          filter: '.unDraggable'
        },
        dragOptions2: {
          animation: 0,
          group: {
            name: 'code-list'
          }
        }
      }
    },
    watch: {
      keyword: function (val) {
        if (val.trim() !== '') {
          let temp = []
          this.copyCodeByGroup.forEach((item, index) => {
            temp.push({groupName: item.groupName, codeList: []})
            item.codeList.forEach(code => {
              let filedName = code.cmdbCode.cmdbCode.filedName.toLocaleLowerCase()
              if (filedName.indexOf(val.toLocaleLowerCase()) > -1) {
                temp[index].codeList.push(code)
              }
            })
          })
          this.codeByGroup = temp
        } else {
          this.codeByGroup = JSON.parse(JSON.stringify(this.copyCodeByGroup))
        }
      }
    },
    methods: {
      cancel () {
        this.$emit('setShow', false)
      },
      computedLength (length) {
        let res = ''
        for (let i = 0; i < length; i++) {
          res += '9'
        }
        return res
      },
      showFullScreenLoading (state) {
        this.loading = this.$loading({
          lock: true,
          text: state === 'loading' ? '正在拼命加载数据...' : '提交数据中请稍候...',
          spinner: 'el-icon-loading'
        })
      },
      resetForm (formName) {
        this.form = JSON.parse(JSON.stringify(this.copyForm))
        this.codeByGroup = JSON.parse(JSON.stringify(this.copyCodeByGroup))
      },
      setColSpan (val) {
      },
      addArea () {
        this.form.groupList.push({
          codeGroup: {
            groupName: ''
          },
          codeList: []
        })
      },
      showCodeInfo (code) {
        this.showInfo = true
        this.currentCode = code
        let cod = code.cmdbCode.cmdbCode
        let controlType = code.cmdbCode.controlType
        if (controlType.controlCode === 'listSel') {
          if (cod.bindSourceType === '数据字典') {
            if (!this.codeOptions[cod.filedCode]) {
              rbCmdbModuleService.getDictByColName(cod.bindSource).then((data) => {
                this.$set(this.codeOptions, cod.filedCode, data)
              })
            }
          }
          if (cod.bindSourceType === '数据表') {
            rbCmdbModuleService.queryTableData({sql: cod.bindSource}).then((data) => {
              this.$set(this.codeOptions, cod.filedCode, data)
            })
          }
        }
        if (controlType.controlCode === 'cascader') {
//          if (!this.codeOptions[cod.filedCode]) {
          let bindValue = ''
          if (cod.refCode !== null) {
            this.form.groupList.forEach((item) => {
              item.codeList.forEach(code => {
                if (code.cmdbCode.cmdbCode.filedCode === cod.refCode.filedCode) {
                  if (code.defaultValue !== null) {
                    bindValue = code.defaultValue
                  }
                }
              })
            })
          }
          if (bindValue !== '') {
            let sql = cod.bindSource.replace('?', bindValue)
            rbCmdbModuleService.queryTableData({sql: sql}).then((data) => {
              this.$set(this.codeOptions, cod.filedCode, data)
            })
          }
//          }
        }
      },
      getValid () {
        rbCmdbModuleService.listValid().then((data) => {
          this.valids = data
        })
      },
      getCode () {
        this.showFullScreenLoading('loading')
        cmdbCodeService.queryCodeListFormatByGroup().then((data) => {
          this.codeByGroup = data
          this.codeByGroup.forEach(item => {
            item.codeList.forEach((code, index) => {
              item.codeList[index] = {cmdbCode: code}
            })
          })
          this.codeByGroup.forEach(item => {
            this.activeNames.push(item.groupName)
            let list = []
            if (this.form.groupList.length === 0) {
              let codeList = []
              item.codeList.forEach(code => {
                if (code.cmdbCode.cmdbCode.isBuiltIn === '是') {
                  codeList.push(code)
                }
              })
              if (codeList.length > 0) {
                this.form.groupList.push({codeGroup: {groupName: item.groupName}, codeList: codeList})
              }
            } else {
              let flag = false // 是否存在相同的区域名
              this.form.groupList.forEach(group => {
                if (item.groupName === group.codeGroup.groupName) {
                  flag = true
                  let codeList = []
                  if (group.codeList.length === 0) {
                    item.codeList.forEach(code => {
                      if (code.cmdbCode.cmdbCode.isBuiltIn === '是') {
                        codeList.push(code)
                      }
                    })
                  } else {
                    group.codeList.forEach(c => {
                      let flag = false
                      item.codeList.forEach(code => {
                        if (code.cmdbCode.cmdbCode.id === c.cmdbCode.cmdbCode.id) {
                          flag = true
                        }
                      })
                      if (!flag && c.cmdbCode.cmdbCode.isBuiltIn === '是') {
                        codeList.push(c)
                      }
                    })
                  }
                  codeList.forEach(l => {
                    group.codeList.push(l)
                  })
                } else {
                }
              })
              if (!flag) {
                item.codeList.forEach(code => {
                  if (code.cmdbCode.cmdbCode.isBuiltIn === '是') {
                    list.push(code)
                  }
                })
                if (list.length > 0) {
                  this.form.groupList.push({codeGroup: {groupName: item.groupName}, codeList: list})
                }
              }
            }
          })
          // if (this.parentForm.state === 'edit') {
          this.codeByGroup.forEach(c => {
            c.codeList.forEach(l => {
              this.form.groupList.forEach(group => {
                group.codeList.forEach(code => {
                  if (c.groupName === code.cmdbCode.cmdbCode.codeGroup && l.cmdbCode.cmdbCode.codeId === code.cmdbCode.cmdbCode.codeId) {
                    this.$set(l, 'unDraggable', true)
                  }
                })
              })
            })
          })
          this.copyCodeByGroup = JSON.parse(JSON.stringify(this.codeByGroup))
          // }
          this.loading.close()
        }).catch(() => {
          this.loading.close()
          this.$notify({
            title: '提示',
            message: '加载模型字段失败',
            type: 'error',
            duration: 3000
          })
        })
      },
      onAdd (val) {
        this.codeByGroup.forEach(item => {
          if (item.groupName === val.from.className) {
            this.$set(item.codeList[val.oldIndex], 'unDraggable', true)
            let code = item.codeList[val.oldIndex].cmdbCode
            let controlType = code.cmdbCode.controlType
            if (controlType.controlCode === 'listSel') {
              rbCmdbModuleService.getDictByColName(code.cmdbCode.bindSource).then((data) => {
                this.$set(this.codeOptions, code.cmdbCode.cmdbCode.filedCode, data)
              })
            }
          }
        })
      },
      handleAreaDelete (index) {
        let flag = false
        this.form.groupList[index].codeList.forEach(item => {
          if (item.cmdbCode.cmdbCode.isBuiltIn === '是') {
            this.$message.info('包含内置字段，不能删除区域')
            flag = true
          }
        })
        if (flag) {
          return
        }
        this.$confirm('确认删除区域？').then(() => {
          this.form.groupList[index].codeList.forEach(item => {
            this.codeByGroup.forEach(group => {
              group.codeList.forEach(code => {
                if (item.cmdbCode.codeId === code.cmdbCode.codeId) {
                  item.unDraggable = false
                }
              })
            })
          })
          this.form.groupList.splice(index, 1)
        })
      },
      handleDelete (code, areaIndex, codeIndex) {
        this.form.groupList[areaIndex].codeList.splice(codeIndex, 1)
        this.codeByGroup.forEach(item => {
          if (item.groupName === code.cmdbCode.cmdbCode.codeGroup) {
            item.codeList.forEach(c => {
              if (c.cmdbCode.cmdbCode.codeId === code.cmdbCode.cmdbCode.codeId) {
                c.unDraggable = false
              }
            })
          }
        })
        if (this.currentCode.cmdbCode && code.cmdbCode.cmdbCode.codeId === this.currentCode.cmdbCode.cmdbCode.codeId) {
          this.showInfo = false
        }
      },
      validForm () {
        let flag = false
        this.$refs['form'].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      onSubmit (formName) {
        if (this.validForm()) {
          this.form.groupList.forEach(item => {
          })
          let data = {
            module: this.form.module,
            groupList: this.form.groupList
          }
          this.$confirm('确认提交？').then(() => {
            this.showFullScreenLoading('submit')
            rbCmdbModuleService.addModuleCode(data).then((data) => {
              this.loading.close()
              if (data.success) {
                this.$notify({
                  title: '提示',
                  message: '编辑模型字段成功',
                  type: 'success',
                  duration: 3000
                })
                this.$emit('setShow', false)
              } else {
                this.$notify({
                  title: '提示',
                  message: '编辑模型字段失败',
                  type: 'error',
                  duration: 3000
                })
              }
            }).catch(() => {
              this.loading.close()
              this.$notify({
                title: '提示',
                message: '编辑模型字段失败',
                type: 'error',
                duration: 3000
              })
            })
          })
        }
      }
    },
    mounted: function () {
      this.form = this.parentForm.otherFields
      this.form.module.id = this.parentForm.baseFields.id
      this.copyForm = JSON.parse(JSON.stringify(this.form))
      this.getCode()
      this.getValid()
    }
  }
  </script>

  <style lang="scss" scoped>
    .aside {
      .button-box {
        text-align: center;
        border: 1px solid #E4E7ED;
        line-height: 30px;
        margin-bottom: 10px;
      }
      /deep/ .el-collapse{
        border: 1px solid #E4E7ED;
        .el-collapse-item__header {
          padding: 0 5px;
          background-color: #F5F7FA;
          line-height: 30px;
          height: 30px;
        }
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        .el-row {
          line-height: 30px;
          padding: 0 5px;
          margin-bottom: 0;
          border-bottom: 1px solid #E4E7ED;
        }
        .unDraggable {
          color: #C0C4CC;
        }
      }
    }
   /*/deep/ label {*/
      /*text-align: left;*/
      /*text-overflow: ellipsis;*/
      /*overflow: hidden;*/
    /*}*/
    /deep/ .el-main {
      padding: 0 0 0 10px;
      .el-aside {
        .filed-box {
          .el-row {
            margin-bottom: 0;
          }
          .box-header{
            background-color: #F5F7FA;
            border-radius: 4px 4px 0 0;
            .el-form-item {
              margin-bottom: 0;
            }
            .el-input__inner {
              font-size: 14px;
              font-weight: 500;
              border: none;
              background-color: #F5F7FA;
            }
          }
          .box-body {
            min-height: 40px;
            /*border: 1px solid #E4E7ED;*/
            .code-box {
              .el-col {
                line-height: 30px;
                border-radius: 0;
                padding: 0 5px;
              }
              .el-form-item {
                margin-bottom: 0;
                .el-select {
                  width: 100%;
                }
                .el-date-editor.el-input, .el-date-editor.el-input__inner {
                  width: 100%;
                }
                .el-input--prefix .el-input__inner {
                  padding-left: 0;
                }
                .is-disabled .el-input__inner{
                  cursor: default !important;
                }
                .el-input.is-disabled .el-input__icon {
                  cursor: default !important;
                }
                .el-form-item__label {
                  text-align: left;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
      .el-main {
        .info-box {
          .el-row {
            margin-bottom: 0;
          }
          .info-title {
            padding-left: 10px;
            line-height: 40px;
            background-color: #F5F7FA;
            border-radius: 4px 4px 0 0;
            font-size: 14px;
            font-weight: 500;
          }
          .info-body {
            /*border: 1px solid #E4E7ED;*/
            min-height: 50vh;
            .el-form {
              padding: 0 10px;
            }
            .el-form-item {
              margin-bottom: 0;
              .el-form-item__label {
                text-align: left;
              }
            }
            .el-date-editor.el-input__inner {
              width: 100%;
            }
            .width-box {
              font-size: 14px;
              .el-radio-button__inner {
                padding: 6px 6px;
              }
            }
          }

        }
      }


    }
    .boder-line{
      width: 1px;
      height: 100%;
      margin-left: 10px;
      background-color: #E4E7ED;
    }



  </style>
