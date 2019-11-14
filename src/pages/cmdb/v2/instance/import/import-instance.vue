<!--suppress ALL -->
<template>
  <el-dialog class="yw-dialog"
             :title="title"
             :visible.sync="showImportDialog"
             width="500px"
             @close="closeImportDialog()">
    <el-form ref="importPanel"
             class="demo-ruleForm"
             v-if="showImportPanel">
      <el-form-item align="center">
        <el-upload ref="import-upload"
                   class="upload-demo"
                   :headers="headers"
                   drag
                   :action="'/v1/cmdb/process/import?importType=' + importType"
                   :on-success="handleSuccess"
                   :before-upload="validFile">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary"
                   @click="isShowItem=!isShowItem">还没有Excel模版?请下载模版</el-button>
      </el-form-item>
      <el-form-item v-if="isShowItem" align="center">
        设备分类
        <el-select placeholder="请选择设备分类" filterable v-model="deviceClass" @change="changeDeivceType">
          <el-option v-for="item in selectData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowItem" align="center">
        设备类型
        <el-select placeholder="请选择设备类型" v-model="moduleId" filterable>
          <el-option v-for="item in childData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item align="center"
                    v-if="isShowItem"
                    style="margin-top:15px;">
        <form id="frmHostInfo"
              name="frmHostInfo"
              method="post"
              fit="true"></form>
        <el-button type="primary"
                   @click="onSubmit">下载模板</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="processPanel"
             label-position="top"
             class="demo-ruleForm"
             label-width="100px"
             style="padding-right:30px;"
             v-if="showProcessPanel">
      <div style="width: 100%; padding-bottom: 50px;"
           v-loading="true"
           v-if="showCancel"></div>
      <div style="font: 14px Small"
           v-if="showCancel">
        正在导入Excel数据, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
        已处理<span style="color: #409EFF; font-weight: bold;"> {{processCount}} </span>条,
        成功<span style="color: #67C23A; font-weight: bold;"> {{successCount}} </span>条,
        失败<span style="color: #F56C6C; font-weight: bold;"> {{failCount}} </span>条.
        预计剩余处理时长<span style="color: #E6A23C; font-weight: bold;"> {{leaveTime}} </span>秒, 请稍等...
        <div style="font: 14px small;">
          <el-button style="text-decoration:none; color: #F56C6C; font-weight: bold;"
                     type="text"
                     align="left"
                     @click="stopProcess">
            中止上传
          </el-button>
        </div>
      </div>
      <div style="font: 14px Small"
           v-if="showFinish">
        导入Excel数据结束, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
        已处理<span style="color: #409EFF; font-weight: bold;"> {{processCount}} </span>条,
        成功<span style="color: #67C23A; font-weight: bold;"> {{successCount}} </span>条,
        失败<span style="color: #F56C6C; font-weight: bold;"> {{failCount}} </span>条.
        处理时长<span style="color: #E6A23C; font-weight: bold;"> {{leaveTime}} </span>秒。
      </div>
      <div style="font: 14px small;"
           v-if="showErrorDown">
        <el-button style="text-decoration:none; color: #F56C6C; font-weight: bold;"
                   type="text"
                   align="left"
                   @click="downImportErrorRecord">
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
export default {
  props: ['showImport', 'importType'],
  data () {
    return {
      showImportDialog: this.showImport,
      showImportPanel: this.showImport,
      showProcessPanel: false,
      deviceClass: '',
      moduleId: '',
      selectData: [],
      childData: [],
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
      showErrorDown: false
    }
  },
  mounted: function () {
    $(document).find('input[type=file]:eq(0)').hide()
    this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    this.initData()
  },
  beforeDestroy: function () {
    clearInterval(this.timeSetter)
    this.timeSetter = null
    this.closeImportDialog()
  },
  methods: {
    closeImportDialog () {
      this.$emit('setImportDisplay', false)
      if (this.processId !== '') {
        let _t = this
        rbCmdbServiceFactory.removeImportProcess(this.processId).then((item) => {
          clearInterval(this.timeSetter)
          _t.timeSetter = null
        }).catch((item) => {
          _t.$message.error('移除导入进程' + _t.processId + '失败')
        })
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 提交表单
    onSubmit () {
      rbCmdbServiceFactory.downloadExcel(this.moduleId).then((data) => {
        let blob = new Blob([data], { type: 'application/msword' })
        // 创建下载链接
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '配置模板.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    initData () {
      this.selectData = []
      rbCmdbServiceFactory.getModuleTree('').then((data) => {
        if (data) {
          data.forEach((item) => {
            this.selectData.push(item)
          })
        }
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
        this.$message.error(response.message)
        this.$refs['import-upload'].clearFiles()
      }
    },
    validFile (file) {
      console.log(file)
      const fileType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const maxSize = file.size / 1024 / 1024 < 1
      if (!fileType) {
        this.$message.error('上传文件格式不正确, 请选择[xlsx、xls]格式文件.')
        return false
      }
      if (!maxSize) {
        this.$message.error('上传文件大小不能超过1MB.')
        return false
      }
      return true
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
              _t.timeSetter = null
              _t.processId = ''
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
        let blob = new Blob([data], { type: 'application/msword' })
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
    },
    changeDeivceType (pid) {
      this.moduleId = ''
      if (pid && this.selectData) {
        this.selectData.forEach((item) => {
          if (item.id === pid) {
            this.childData = item.childModules
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
