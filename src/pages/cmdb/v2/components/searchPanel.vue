<template>
  <el-dialog v-loading="loading" class="search-panel" :close-on-click-modal="false" :visible.sync="show" :show-close="false" @close="">
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-row>
          <el-col :span="21">
            <el-col style="line-height: 30px" :span="6">已存条件：</el-col>
            <el-col :span="18">
              <el-select v-loading="loading" v-model="selectQuery" value-key="id" style="width: 100%" clearable>
                <!--<el-option style="color: #C0C4CC" value=""-->
                           <!--label="">-->
                <!--</el-option>-->
                <el-option v-for="item in queryConditions"
                           :key="item.id"
                           :value="item"
                           :label="item.queryName">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-col style="line-height: 30px" :span="6">模型名称：</el-col>
            <el-col :span="18">
              <el-select v-model="currentModuleId" value-key="name" style="width: 100%">
                <el-option :key="currentModuleInfo.moduleId" :value="currentModuleInfo.moduleId" :label="currentModuleInfo.moduleName">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row style="padding-bottom: 30px;border-bottom: 1px solid #F0F0F0">
          <el-col :span="21">
            <el-col style="line-height: 30px" :span="6">添加字段：</el-col>
            <el-col :span="18">
              <el-select v-loading="loading" v-model="selectedField" value-key="code" style="width: 100%">
                <el-option v-for="item in data"
                           v-if="item.code !== 'Y_name'"
                           :key="item.code"
                           :value="item"
                           :label="item.name">
                </el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="2">
            <span @click="addFromItem()" style="font-size: 26px;color: #66b1ff;line-height: 30px">
            <i class="el-icon-circle-plus"></i>
          </span>
          </el-col>
        </el-row>
        <el-row style="height: 200px">
          <el-scrollbar style="height: 100%">
            <el-form :data="formData" ref="formData">
              <el-row v-for="item in formItems" :key="item.id"  >
                <el-col :span="21">
                  <el-row type="flex">
                    <el-tooltip :content="item.name">
                      <el-col style="line-height: 30px;text-overflow: ellipsis;overflow:hidden;white-space: nowrap; " :span="6">{{item.name}}</el-col>
                    </el-tooltip>
                    <el-col :span="18">
                      <el-form-item  :prop="item.code">
                        <el-input style="width: 100%" v-model="formData[item.code]" v-if="item.type === 'singleRowText'"></el-input>
                        <el-select clearable style="width: 100%" value-key="name"  v-model="formData[item.code]" v-if="item.type === 'listSel'">
                          <el-option v-for="option in optionData.get(item.id)"
                                     :key="option.value"
                                     :label="option.name"
                                     :value="option">
                          </el-option>
                        </el-select>
                        <!--<el-date-picker  v-model="formData[item.code]" type="date" placeholder="选择日期" v-if="item.type === 'dateTime'"></el-date-picker>-->
                        <el-date-picker style="width: 100%" v-model="formData[item.code]" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" v-if="item.type === 'dateTime'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-col>
                <el-col :span="2" @mouseover.native = "showDelete(item)" @mouseleave.native="hidDelete(item)">
                  <div style="width: 100%;height: 30px" v-show="!item.del"></div>
                  <span  v-show="item.del" @click="removeFormItem(item)" style="font-size: 20px;color:#E0E0E0;line-height: 30px">
                    &nbsp;<i class="el-icon-circle-close"></i>
                  </span>
                </el-col>
              </el-row>
            </el-form>
          </el-scrollbar>
        </el-row>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer" >
      <el-button type="primary" @click="query()">查询并保存</el-button>
      <el-button @click="resetDialog()">取 消</el-button>
      <el-button v-show="selectQuery && selectQuery.id" @click="deleteQueryCondition()">删 除</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'

  export default {
    name: 'searchPanel',
    props: ['showSearchPanel', 'reset', 'moduleInfo', 'menuType'],
    data () {
      return {
        show: this.showSearchPanel,
        currentModuleId: this.moduleInfo.moduleId,
        currentModuleInfo: this.moduleInfo,
        currentMenuType: this.menuType,
        columnData: [],
        data: [],
        optionData: new Map(),
        selectedField: {},
        searchFileds: [],
        formItems: [],
        formData: {},
        selectQuery: {}, // 当前选中查询条件
        queryConditions: [], // 查询条件列表
        loading: false
      }
    },
    watch: {
      showSearchPanel (val) {
        this.show = val
        this.getAllQueryConditions()
      },
      reset (val) {
        if (val) {
          this.init()
          let formDataLength = Object.keys(this.formData).length
          if (formDataLength > 0) {
            this.$refs['formData'].resetFields()
          }
        }
      },
      selectQuery (val) {
        this.formItems = []
        this.formData = {}
        if (val === '') {
          this.initPorperty()
        } else {
          this.initPorperty()
          this.queryConditions.forEach((item) => {
            if (item.id === val.id) {
              this.formItems = JSON.parse(item.queryInfo)
              this.formItems.forEach(form => {
                if (form.recordValue) {
                  // this.formData[form.code] = form.recordValue
                  this.$set(this.formData, form.code, form.recordValue)
                }
              })
            }
          })
          this.formItems.forEach(item => {
            this.data.forEach((da, index) => {
              if (da.code === item.code) {
                this.data.splice(index, 1)
              }
            })
          })
        }
      },
      menuType (val) {
        this.currentMenuType = val
      },
      'moduleInfo.moduleId' (val) {
        this.currentModuleInfo.moduleId = val
        this.currentModuleId = this.currentModuleInfo.moduleId
        this.getForms()
        this.getAllQueryConditions()
      },
      'moduleInfo.moduleName' (val) {
        this.currentModuleInfo.moduleName = val
      }
    },
    methods: {
      getForms () {
        this.loading = true
        rbCmdbServiceFactory.getModulePropertys({moduleId: this.currentModuleId}).then((data) => {
          this.loading = false
          this.columnData = data
          this.init()
        })
      },
      showDelete (item) {
        this.$set(item, 'del', true)
      },
      hidDelete (item) {
        this.$set(item, 'del', false)
      },
      removeFormItem (item) {
        let index = this.formItems.indexOf(item)
        if (index !== -1) {
          this.formItems.splice(index, 1)
          this.data.push(item)
          delete this.formData[item.code]
        }
      },
      init () {
        this.data = []
        this.formItems = []
        this.selectedField = {}
        this.selectQuery = {}
        this.formData = {}
        this.currentModuleId = this.currentModuleInfo.moduleId
        this.initPorperty()
      },
      initPorperty () {
        this.data = []
        this.columnData.forEach(column => {
          if (column.type !== 'groupLine') {
            this.data.push({id: column.id, name: column.name, code: column.code, type: column.type})
            this.optionData.set(column.id, column.formOptions)
          }
        })
      },
      addFromItem () {
        if (this.selectedField.code) {
          let selected = JSON.parse(JSON.stringify(this.selectedField))
          selected['del'] = false
          this.formItems.push(selected)
          let index = this.data.indexOf(this.selectedField)
          this.data.splice(index, 1)
          this.selectedField = {}
        }
      },
      resetDialog () {
        this.$emit('setShow', 'searchPanel')
      },
      emitData () {
        this.searchFileds = []
        this.formItems.forEach(item => {
          // this.searchFileds.push({id: item.id, code: item.code, name: item.name, type: item.type, value: item.type === 'singleRowText' ? this.formData[item.code] ? this.formData[item.code] : '' : this.formData[item.code] ? this.formData[item.code].value : '', valueName: this.formData[item.code] ? this.formData[item.code].name : ''})
          this.searchFileds.push({id: item.id, code: item.code, name: item.name, type: item.type, value: this.formData[item.code] ? this.formData[item.code] : ''})
        })
        this.$emit('setSearchFileds', this.searchFileds)
        this.$emit('setShow', 'searchPanel')
      },
      query () {
        this.addOrUpdateQueryCondition()
      },
      getAllQueryConditions () {
        this.loading = true
        this.queryConditions = []
        let params = {
          moduleId: this.currentModuleId,
          menuType: this.currentMenuType
        }
        rbCmdbServiceFactory.getAllQueryConditions(params).then((data) => {
          this.loading = false
          if (data.length > 0) {
            data.forEach(item => {
              this.queryConditions.push(item)
            })
            if (!this.selectQuery.id && this.selectQuery.queryName) {
              this.queryConditions.forEach(item => {
                if (item.queryName === this.selectQuery.queryName) {
                  this.selectQuery = item
                }
              })
            }
            // if (this.queryConditions.length > 0) {
            //   this.selectQuery = this.queryConditions[0]
            // } else {
            //   this.selectQuery = {}
            // }
            // this.formItems = JSON.parse(this.queryConditions[0].queryInfo)
            // this.formData[this.formItems[0].code] = this.formItems[0].recordValue
            // this.formItems.forEach(form => {
            //   if (form.recordValue) {
            //     this.formData[form.code] = form.recordValue
            //   }
            // })
          }
        })
      },
      toDoAddOrUpdate () {
        for (let i in this.formData) {
          this.formItems.forEach(item => {
            if (i === item.code) {
              item.recordValue = this.formData[i]
            }
          })
        }
        let data = {
          id: this.selectQuery.id,
          queryName: this.selectQuery.queryName,
          menuType: this.currentMenuType,
          moduleId: this.currentModuleId,
          queryInfo: JSON.stringify(this.formItems)
        }
        this.emitData()
        rbCmdbServiceFactory.updateQueryConditions(data).then((data) => {
        }).catch(() => {
          this.$message.error('保存/更新条件失败')
        })
      },
      addOrUpdateQueryCondition () {
        if (!this.selectQuery.id) {
          this.$prompt('请输入条件名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: this.validName
          }).then(({ value }) => {
            this.selectQuery = {}
            this.selectQuery.queryName = value
            this.toDoAddOrUpdate()
          }).catch((e) => {
          })
        } else {
          this.toDoAddOrUpdate()
        }
      },
      validName (value) {
        let msg = null
        if (value.trim() === '') {
          msg = '名称不能为空'
        }
        this.queryConditions.forEach(item => {
          if (item.queryName === value) {
            msg = '名称已存在'
            return false
          }
        })
        return msg
      },
      deleteQueryCondition () {
        this.$confirm('确认是否删除当前查询条件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbCmdbServiceFactory.deleteQueryConditions(this.selectQuery.id).then((data) => {
            this.$message.success('删除成功')
            this.selectQuery = {}
            this.loading = true
            this.getAllQueryConditions()
          }).catch(() => {
            this.$message.success('删除失败')
          })
        })
      }
    },
    mounted: function () {
    }
  }
</script>

<style lang="scss" scoped>

  /*/deep/ .el-form-item__content {*/
    /*line-height: 30px !important;*/
  /*}*/
  .search-panel {
    /deep/ .el-dialog {
      width: 580px;
      border-radius: 20px;
    }
    /deep/ .el-input__inner{
      border-radius: 8px;
     }
    /deep/ .el-form-item__content{
      line-height: 30px;
    }
    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    /deep/ .el-date-editor .el-range__icon {
      line-height: 22px;
    }

    /deep/ .el-date-editor .el-range-separator {
      line-height: 22px;
    }
    /deep/ .el-date-editor .el-range__close-icon {
      line-height: 22px;
    }

    /deep/ .el-date-editor .el-range-input {
      width: 100%;
    }
  }
</style>
