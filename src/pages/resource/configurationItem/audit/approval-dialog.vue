<template>
  <el-dialog class="yw-dialog" :visible.sync="processInfo.showProcess" width="500px" title="配置项审核进度">
    <el-form ref="processPanel" label-position="top" class="demo-ruleForm" label-width="100px" style="padding-right:30px;">
      <div style="width: 100%; padding-bottom: 50px;" v-loading="true" v-if="showCancel"></div>
      <div style="font: 14px Small" v-if="showCancel">
        正在审核配置项数据, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
        已处理<span style="color: #409EFF; font-weight: bold;"> {{processCount}} </span>条,
        成功<span style="color: #67C23A; font-weight: bold;"> {{successCount}} </span>条,
        失败<span style="color: #F56C6C; font-weight: bold;"> {{failCount}} </span>条.
        预计剩余处理时长<span style="color: #E6A23C; font-weight: bold;"> {{leaveTime}} </span>秒, 请稍等...
        <div style="font: 14px small;">
          <el-button style="text-decoration:none; color: #F56C6C; font-weight: bold;" type="text" align="left" @click="stopProcess">
            中止审核
          </el-button>
        </div>
      </div>
      <div style="font: 14px Small" v-if="showFinish">
        审核配置项数据结束, 共<span style="color: #409EFF; font-weight: bold;"> {{totalCount}} </span>条记录,
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

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'

  export default {
  // name: 'approval-dialog'
  components: {

  },
  props:['processInfo'],
  data () {
    return {
      timeSetter: null,
      showFinish: false,
      totalCount: 0,
      processCount: 0,
      successCount: 0,
      failCount: 0,
      leaveTime: 0,
      showErrorDown: false,
      showCancel: true,
      processId: this.processInfo.processId
    }
  },
  mounted () {
    this.timeSetter = setInterval(() => {
      this.getImportProcess(this.processId)
    }, 2000)
  },
    beforeDestroy: function () {
      clearInterval(this.timeSetter)
      this.closeImportDialog()
      this.timeSetter = null
      this.$emit("refresh")
    },
  methods: {
    closeImportDialog () {
      this.$emit('setImportDisplay', false)
      if (this.processId !== '') {
        let _t = this
        rbCmdbServiceFactory.stopApprovalProcess(this.processId).then((item) => {
          clearInterval(this.timeSetter)
          _t.timeSetter = null
        }).catch((item) => {
          _t.$message.error('移除配置审核进程' + _t.processId + '失败')
        })
      }
    },
    stopProcess () {
      this.$confirm('确认要中止配置项审批审核操作?').then(() => {
        if (this.processId !== '') {
          let _t = this
          rbCmdbServiceFactory.stopApprovalProcess(this.processId).then((item) => {
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
            _t.$message.error('移除配置审核进程' + _t.processId + '失败')
          })
        }
      })
    },
    getImportProcess (proccessId) {
      let _t = this
      rbCmdbServiceFactory.getApprovalProcess(proccessId).then((data) => {
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
    downImportErrorRecord () {
      rbCmdbServiceFactory.downloadApprovalErrorRecord(this.processId).then((data) => {
        let blob = new Blob([data], { type: 'application/msword' })
        // 创建下载链接
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '审核失败记录.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    }
  }
}
</script>

<style scoped>

</style>
