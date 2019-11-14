<template>
    <el-dialog class="update-dailog" width="70%" :visible.sync="show" @close="resetShow">
      <el-container>
        <el-aside class="update-left" width="25%">
          <el-input v-model="keyword" placeholder="当前模型实例名称" prefix-icon="el-icon-search"></el-input>
          <el-row class="button-row">
            <el-col :span="8">
              <el-button @click="download()" type="text" size="mini">下载模板</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="text" size="mini" style="width: 100%" @click="showImport = true">实例导入</el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="removeIps" type="text" size="mini" style="width: 100%">批量删除</el-button>
            </el-col>
          </el-row>
          <el-row class="tree-row">
            <el-tree :data="treeData" ref="tree"  default-expand-all show-checkbox></el-tree>
          </el-row>
        </el-aside>
        <el-main class="update-right">
          <el-row style="font-size: 14px;color:#303133; font-weight: 500; line-height: 30px">
            批量更新
            <span style="color: #409EFF">
              <i class="el-icon-d-arrow-right"></i>
            </span>
          </el-row>
          <el-row>
            <el-row style="border-bottom: 1px solid #F2F6FC; padding-bottom: 20px">
              <el-col :span="10">
                <el-col :span="5" style="line-height: 30px">模型名称</el-col>
                <el-col :span="15">
                  <!--<el-form-item prop="moduleId">-->
                  <el-select v-model="moduleId">
                    <el-option :label="moduleInfo.moduleName" :value="moduleInfo.moduleId"></el-option>
                  </el-select>
                  <!--</el-form-item>-->
                </el-col>
              </el-col>
              <el-col :span="10">
                <el-col :span="5" style="line-height: 30px">
                  模型字段
                </el-col>
                <el-col :span="15">
                  <!--<el-form-item prop="formId">-->
                  <el-select v-loading="loading" v-model="selectFiled" value-key="id" style="width: 100%">
                    <el-option
                      v-for="item in columns"
                      v-if="item.code !== 'ip' && item.code !== 'Y_name'"
                      :key="item.id"
                      :label="item.name"
                      :value="item">
                    </el-option>
                  </el-select>
                  <!--</el-form-item>-->
                </el-col>
                <el-col :span="4">
                    <span @click="addFromItem()" style="font-size: 26px;color: #66b1ff;line-height: 30px">
                      &nbsp;<i class="el-icon-circle-plus"></i>
                    </span>
                </el-col>
              </el-col>
              <el-col :span="4">
                <el-button @click="batchUpdate" type="primary" size="mini" style="float: right">更新</el-button>
              </el-col>
            </el-row>
            <el-row style="height: 40vh">
              <el-scrollbar style="height: 100%;">
                <el-form :model="updateForm" ref="updateForm">
                  <!--选择字段-->

                  <!--已添加字段-->
                  <el-row class="form-panel">
                    <el-row v-for="item in formItems" :key="item.id">
                      <el-col :span="3" style="line-height: 30px">{{item.name}}</el-col>
                      <el-col :span="15">
                        <el-form-item :prop="item.code">
                          <el-select v-if="item.type === 'listSel'" style="width: 100%" v-model="updateForm[item.code]" clearable>
                            <el-option
                              v-for="option in item.formOptions"
                              :key="option.id"
                              :label="option.name"
                              :value="option.value">
                            </el-option>
                          </el-select>
                          <el-input v-if="item.type === 'singleRowText'" style="width: 100%" v-model="updateForm[item.code]"></el-input>
                          <el-date-picker style="width: 100%" v-model="updateForm[item.code]" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" v-if="item.type === 'dateTime'">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" @mouseover.native = "showOrDelete(item, true)" @mouseleave.native="showOrDelete(item, false)">
                        <div style="width: 100%;height: 30px" v-show="!item.del"></div>
                        <span  v-show="item.del" @click="removeFormItem(item)" style="font-size: 20px;color:#E0E0E0;line-height: 30px">
                    &nbsp;<i class="el-icon-circle-close"></i>
                  </span>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-form>
              </el-scrollbar>
            </el-row>
          </el-row>
        </el-main>
      </el-container>
      <el-dialog
        title="导入excel"
        :visible.sync="showImport"
        width="50%"
        @close="closeDialog"
        class="dialog2" append-to-body>
        <el-upload
          ref="upload"
          name="myFile"
          class="upload-demo"
          drag
          :action="'/cmdb/repertryInstance/getExcelData?moduleId=' + moduleInfo.moduleId"
          align="center"
          :multiple='false'
          :limit="1"
          :on-success="resolveExcel"
          :headers="myHeaders"
          >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="uploadData" class="tem-search1">确认</el-button>
          <el-button type="primary" @click="showImport = false" class="tem-search1">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  const token = sessionStorage.getItem('token')
  export default {
    name: 'batchUpdate',
    props: ['hideBatchUpdate', 'moduleInfo', 'selectData'],
    data () {
      return {
        myHeaders: {Authorization: 'Bearer ' + token},
        show: this.hideBatchUpdate,
        moduleId: this.moduleInfo.moduleId,
        treeData: [{  // 列表树数据
          id: 1,
          label: '更新列表',
          children: []
        }],
        loading: false,
        sourceData: [],
        filtedData: [],
        ipData: [], // ip数据
        updateForm: {},
        formItems: [],    // 添加的所有字段
        sourceColumns: [],
        columns: [],      // 所有字段
        selectFiled: {}, // 当前选中的字段
        keyword: '',
        showImport: false
      }
    },
    watch: {
      hideBatchUpdate (val) {
        this.show = val
        this.ipData = []
        let map = new Map()
        this.selectData.forEach((item, index) => {
          item.forEach(ip => {
            if (!map.hasOwnProperty(ip.name)) {
              map.set(ip.name, ip.name)
            }
          })
        })
        this.ipData.push(...map.values())
        // this.moduleId = this.moduleInfo.moduleId
        // this.getFormData()
        this.initData()
      },
      // allColumns (val) {
      //   console.log(val)
      //   this.baseColumns = val
      //   // this.initColumns()
      // },
      'moduleInfo.moduleId' (val) {
        this.moduleId = val
        this.getFormData()
      },
      keyword (val) {
        this.keyword = val
        this.filteData()
      }
    },
    methods: {
      getFormData () {
        this.loading = true
        this.columns = []
        this.sourceColumns = []
        rbCmdbServiceFactory.getForms({'id': this.moduleId}).then((data) => {
          this.loading = false
          if (data.formData) {
            data.formData.forEach(item => {
              if (item.type !== 'groupLine') {
                this.columns.push(item)
              }
            })
          }
          this.sourceColumns = JSON.parse(JSON.stringify(this.columns))
        })
      },
      closeDialog () {
        this.$refs.upload.clearFiles()
      },
      uploadData () {
        this.treeData[0].children = JSON.parse(JSON.stringify(this.sourceData))
        this.showImport = false
      },
      resolveExcel (response) {
        let result = response.result
        if (result) {
          let exist = [...new Set(response.existInstance)]
          let unexist = [...new Set(response.unExistInstance)]
          exist.forEach(res => {
            let flag = false
            this.sourceData.forEach(item => {
              if (item.label === res) {
                flag = true
              }
            })
            if (!flag) {
              this.sourceData.push({id: 1, label: res})
            }
          })
          this.$message.success({
            dangerouslyUseHTMLString: true,
            message: '<h6>成功导入实例(' + exist.length + ')---不存在实例（' + unexist.length + '）：</h6>'
          })
        } else {
          let msg = response.message
          this.$message.error(msg)
        }
        // response.forEach(res => {
        //   this.sourceData.push({id: 1, label: res})
        // })
      },
      download () {
        rbCmdbServiceFactory.exportExcel({title: '实例名称模板'}).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '实例名称模板.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      batchUpdate () {
        let instanceNames = []
        let formValues = {}
        this.sourceData.forEach(item => {
          instanceNames.push(item.label)
        })
        if (instanceNames.length <= 0) {
          this.$message('请至少选择一个实例')
          return
        }
        if (this.formItems.length <= 0) {
          this.$message('未选择要修改的字段')
          return
        }
        this.formItems.forEach(item => {
          formValues[item.code] = {formId: item.id, formValue: this.updateForm[item.code] ? this.updateForm[item.code] : '', fromCode: item.code}
        })
        // for (let i in this.updateForm) {
        //   formValues[i] = {formId: this.updateForm[i].relformid, formValue: this.updateForm[i].value, fromCode: i}
        // }
        let data = {
          moduleId: this.moduleInfo.moduleId,
          formValues: formValues,
          instanceNames: Array.from(new Set(instanceNames))
        }
        rbCmdbServiceFactory.updateByBatch(data).then((data) => {
          this.$message.success('更新成功')
        }).catch((e) => {
          this.$message.error('更新失败')
        })
      },
      resetShow () {
        this.columns = JSON.parse(JSON.stringify(this.sourceColumns))
        this.$emit('setShow', 'batchPanel')
      },
      removeIps () {
        let selectNodes = this.$refs.tree.getCheckedNodes()
        selectNodes.forEach((item, index) => {
          let ipIndex = this.sourceData.indexOf(item.label)
          this.sourceData.splice(ipIndex, 1)
          let i = this.treeData[0].children.indexOf(item)
          if (i > -1) {
            this.treeData[0].children.splice(i, 1)
          }
        })
      },
      initColumns () {
        this.loading = true
        this.columns = []
        this.baseColumns.forEach((item) => {
          this.columns.push(item)
        })
        if (this.baseColumns.length > 0) {
          this.loading = false
        }
      },
      initData () {
        // this.getFormData()
        this.treeData[0].children = []
        this.sourceData = []
        this.filtedData = []
        this.updateForm = {}
        this.formItems = []
        // this.selectFiled = this.columns[0]
        this.ipData.forEach(item => {
          this.sourceData.push({id: 1, label: item})
          this.treeData[0].children = JSON.parse(JSON.stringify(this.sourceData))
        })
      },
      filteData () {
        this.filtedData = []
        this.treeData[0].children = []
        this.sourceData.forEach(item => {
          if (item.label.indexOf(this.keyword) > -1) {
            this.filtedData.push(item)
          }
        })
        this.treeData[0].children = JSON.parse(JSON.stringify(this.filtedData))
      },
      addFromItem () {
        if (this.selectFiled.code) {
          let selected = JSON.parse(JSON.stringify(this.selectFiled))
          selected['del'] = false
          this.formItems.push(selected)
          let index = this.columns.indexOf(this.selectFiled)
          this.columns.splice(index, 1)
          // this.updateForm[this.selectFiled.code] = null
          this.selectFiled = {}
        }
      },
      removeFormItem (item) {
        let index = this.formItems.indexOf(item)
        if (index !== -1) {
          this.formItems.splice(index, 1)
          this.columns.push(item)
          delete this.updateForm[item.code]
        }
      },
      showOrDelete (item, flag) {
        if (flag) {
          this.$set(item, 'del', true)
        } else {
          this.$set(item, 'del', false)
        }
      }
    },
    mounted: function () {
    }
  }
</script>

<style lang="scss" scoped>
  .update-dailog {
    overflow: hidden;
    border-radius: 10px;
    /deep/ .el-dialog {
      height: 420px;
      border-radius: 10px;
      overflow: hidden;
    }
    /deep/ .el-form-item__content{
      line-height: 30px;
    }
    /deep/ .el-dialog__header {
      padding: 0;
    }
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .update-left{
      border-right: 1px solid #F2F6FC;
      overflow: hidden;
      height: 60vh;
      padding-right: 20px;
      /deep/ .el-input__inner {
        border-radius: 15px;
      }
      .button-row {
        margin-top: 10px;
        line-height: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid #F2F6FC;
        .el-button {
          width: 100%;
          overflow: hidden
        }
      }
      .tree-row {
        max-height: 40vh;
        overflow-y: auto;
        label {
          margin-bottom: 0;
        }
      }
    }
    .update-right {
      padding-top: 0;
      overflow: hidden;
    }

    .form-panel {
      /deep/ .el-row{
        margin-bottom: 0;
      }
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
  }

  .upload-demo {
    /deep/ .el-upload__input{
      display: none !important;
    }
  }

</style>
