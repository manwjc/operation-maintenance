<!--suppress ALL -->
<template>
  <el-dialog :title="title" :visible.sync="showImportDialog"  width="500px" @close="closeImportDialog()">
    <el-form ref="importPanel" label-position="top" class="demo-ruleForm" label-width="100px" style="padding-right:30px;" v-if="showImportPanel">
      <el-form-item align="center">
        <el-upload
          class="upload-demo"
          :headers="headers"
          drag
          :action="actionUrl"
          :data="actionParams"
          :on-success="handleSuccess"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary"  @click="downloadTemplete">还没有Excel模版?请下载模版</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="processPanel" label-position="top" class="demo-ruleForm" label-width="100px" style="padding-right:30px;" v-if="showProcessPanel">
      <div style="width: 100%; padding-bottom: 50px;" v-loading="true" v-if="showCancel"></div>
      <div style="font: 14px Small" v-if="showCancel">
          正在导入Excel数据, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
          已处理<span style="color: #409EFF; font-weight: bold;"> {{processCount}} </span>条,
          成功<span style="color: #67C23A; font-weight: bold;"> {{successCount}} </span>条,
          失败<span style="color: #F56C6C; font-weight: bold;"> {{failCount}} </span>条.
          预计剩余处理时长<span style="color: #E6A23C; font-weight: bold;"> {{leaveTime}} </span>秒, 请稍等...
          <div style="font: 14px small;">
            <el-button style="text-decoration:none; color: #F56C6C; font-weight: bold;" type="text" align="left" @click="stopProcess">
              中止上传
            </el-button>
          </div>
      </div>
      <div style="font: 14px Small" v-if="showFinish">
        导入Excel数据结束, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
        已处理<span style="color: #409EFF; font-weight: bold;"> {{processCount}} </span>条,
        成功<span style="color: #67C23A; font-weight: bold;"> {{successCount}} </span>条,
        失败<span style="color: #F56C6C; font-weight: bold;"> {{failCount}} </span>条.
        处理时长<span style="color: #E6A23C; font-weight: bold;"> {{leaveTime}} </span>秒。
      </div>
      <div style="font: 14px small;" v-if="showErrorDown">
        <el-button style="text-decoration:none; color: #F56C6C; font-weight: bold;" type="text" align="left" @click="downImportErrorRecord">
          下载失败列表
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
  import $ from 'jquery'
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
  export default {
    props: ['showImport', 'importType'],
    data () {
      return {
        showImportDialog: this.showImport,
        showImportPanel: this.showImport,
        showProcessPanel: false,
        moduleId: '',
        selectData: [],
        isShowItem: false,
        fileList: [],
        headers: {
          'head_isAdmin': true,
          'head_orgAccount': 'alauda',
          'head_userName': 'alauda'
        },
        title: '导入Excel新增或更新数据',
        processId: '',
        totalCount: 0,
        processCount: 0,
        successCount: 0,
        failCount: 0,
        leaveTime: 0,
        timeSetter: null,
        showCancel: true,
        showFinish: false,
        showErrorDown: false,
        actionUrl: '',
        actionParams: {}
      }
    },
    mounted: function () {
      $(document).find('input[type=file]:eq(0)').hide()
      this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
      this.actionUrl = '/v1/cmdb/process/import'
      this.actionParams.importType = this.importType
    },
    beforeDestroy: function () {
      clearInterval(this.timeSetter)
      this.timeSetter = null
      this.closeImportDialog()
    },
    methods: {
      closeImportDialog () {
        if (this.processId !== '') {
          let _t = this
          rbCmdbServiceFactory.removeImportProcess(this.processId).then((item) => {
            if (item.flag === 'false') {
              _t.$message.error('移除导入进程' + _t.processId + '失败')
            } else {
              clearInterval(_t.timeSetter)
            }
          }).catch((item) => {
            _t.$message.error('移除导入进程' + _t.processId + '失败')
          })
        }
        this.$emit('closeParent', true)
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      downloadTemplete () {
        demandServiceFactory.exportDemandTemplate().then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '需求收集导入模板.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      // 提交表单
      onSubmit () {
        rbCmdbServiceFactory.downloadExcel(this.moduleId).then((data) => {
          let blob = new Blob([data], {type: 'application/msword'})
          // 创建下载链接
          let objectUrl = URL.createObjectURL(blob)
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '配置模板.xls'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      initData () {
        rbCmdbServiceFactory.getModuleTree('').then((data) => {
          this.selectData = data
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      handleSuccess (response, file, fileList) {
        if (response.flag === 'true') {
          this.title = '文件导入进度'
          this.showImportPanel = false
          this.showProcessPanel = true
          let _t = this
          _t.processId = response.processId
          this.timeSetter = setInterval(() => {
            _t.getImportProcess(_t.processId)
          }, 2000)
        } else {
          _t.$message.error(response.message)
        }
      },
      getImportProcess (proccessId) {
        let _t = this
        rbCmdbServiceFactory.getImportProcess(proccessId).then((data) => {
          if (data.flag === 'true') {
            _t.totalCount = data.data.totalRecord
            _t.processCount = data.data.processCount
            _t.successCount = data.data.successCount
            _t.failCount = data.data.errorCount
            _t.leaveTime = data.data.leaveTime
            if (data.data.endTime) {
              clearInterval(_t.timeSetter)
              _t.timeSetter = null
              _t.showCancel = false
              _t.showFinish = true
              _t.leaveTime = (data.data.endTime - data.data.startTime) / 1000
              _t.showErrorDown = data.data.errorCount > 0
            }
          }
        })
      },
      stopProcess () {
        this.$confirm('确认要中止文件导入?').then(() => {
          if (this.processId !== '') {
            let _t = this
            rbCmdbServiceFactory.removeImportProcess(this.processId).then((item) => {
              if (item.flag === 'false') {
                _t.$message.error('中止失败')
              } else {
                _t.$message.success('中止成功')
                clearInterval(_t.timeSetter)
                _t.closeImportDialog()
              }
            }).catch((item) => {
              _t.$message.error('移除导入进程' + _t.processId + '失败')
            })
          }
        })
      },
      downImportErrorRecord () {
        rbCmdbServiceFactory.downloadProcessErrorRecord(this.processId).then((data) => {
          let blob = new Blob([data], {type: 'application/vnd.ms-excel'})
          // 创建下载链接
          let objectUrl = URL.createObjectURL(blob)
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '导入失败记录.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-dialog__body {
    padding-left: 30px !important;
    padding-bottom: 0px !important;
    padding-right: 30px !important;
    padding-top: 0px !important;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
