<template>
  <div class="components-container">
    <!-- <el-form class="components-condition yw-form"
             :inline="true"
             label-width="70px">
      <el-form-item label="上报总数:">
        {{count}}
      </el-form-item>
    </el-form> -->

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="resourceExport()">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="detailData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="300px">
          <el-table-column v-for="item in detail_record"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"></el-table-column>
        </el-table>
      </div>
      <div class="yw-page-wrap">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-form>
  </div>
</template>

<script>
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import { detail_record } from 'src/pages/mirror_alert/alert/config/options.js'
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
export default {
  components: {
  },
  props: [
    'obj', 'type'
  ],
  data () {
    return {
      alert_id: '',
      detailData: [],
      detail_record: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0 // 总共多少行数据
    }
  },
  mounted: function () {
    this.start()
  },
  methods: {
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.init_()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.init_()
    },
    getRequest () {
      let req = {
        'alert_id': this.alert_id,
        'page_no': this.currentPage,
        'page_size': this.pageSize
      }
      return req
    },
    getAlertRecordList (req) {
      rbAlertServicesFactory.alertRecordList(req).then((res) => {
        if (res.count > 0) {
          this.total = res.count
          this.detailData = res.result
          this.detailData.forEach(item => {
            item.operation_status = rbMirrorCommonService.common('TRANSSTATUS', '1', item.operation_status)
            item.operation_type = rbMirrorCommonService.common('OPERATION_TYPE', '1', item.operation_type)
          })
        }
      })
    },
    init_ () {
      this.getAlertRecordList(this.getRequest())
    },
    resourceExport () {
      let excelName = '告警操作数据列表.xls'
      let url = '/v1/alerts/alertRecordDownload?alertId=' + this.alert_id
      rbAlertKanBanServiceFactory.alertRecordDownload(url).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = excelName
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      })
    },
    start () {
      if (this.obj.alert_id) {
        this.alert_id = this.obj.alert_id
        this.detail_record = detail_record
        this.init_()
      }
    }
  },
  watch: {
    obj: {
      handler: function () {
        this.start()
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>

