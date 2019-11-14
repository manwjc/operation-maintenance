<template>
  <div class="components-container">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="72px">
      <el-form-item label="通知方式：">
        <el-select v-model="alert_notice_type"
                   placeholder="请选择"
                   @change="init_()">
          <el-option v-for="item in alert_notice_types"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-form class="yw-form"
             >
      <div class="table-operate-wrap clearfix">
        <div class="fr">
          <span class="fr-num">通知总数：<span class="num">{{count}}</span></span>
          <span class="fr-num success">成功：<span class="num">{{success_count}}</span></span>
          <span class="fr-num fail">失败：<span class="num">{{fall_count}}</span></span>
        </div>
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
          <el-table-column v-for="item in detail_notify"
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
import { alert_notice_types, detail_notify } from 'src/pages/mirror_alert/alert/config/options.js'
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
      count: 0,
      success_count: 0,
      fall_count: 0,
      detailData: [],
      alert_notice_type: '',
      alert_notice_types: [],
      detail_notify: [],
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
    resourceExport () {
      let excelName = '告警通知数据列表.xls'
      let url = '/v1/alerts/alertNotifyDownload?alertId=' + this.alert_id
      rbAlertKanBanServiceFactory.alertNotifyDownload(url).then((res) => {
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
        'page_size': this.pageSize,
        'report_type': this.alert_notice_type === '2' ? '' : this.alert_notice_type
      }
      return req
    },
    getAlertNotifyList (req) {
      rbAlertServicesFactory.alertNotifyList(req).then((res) => {
        this.total = res.count
        this.count = res.count
        this.success_count = res.success_count
        this.fall_count = res.fall_count
        this.detailData = res.result
        this.detailData.forEach(item => {
          item.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', item.report_type)
          item.status = rbMirrorCommonService.common('REPORTSTATUS', '1', item.status)
        })
      })
    },
    init_ () {
      this.getAlertNotifyList(this.getRequest())
    },
    start () {
      if (this.obj.alert_id) {
        this.alert_id = this.obj.alert_id
        this.alert_notice_types = alert_notice_types
        this.detail_notify = detail_notify
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

