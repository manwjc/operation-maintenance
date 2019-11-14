<template>
  <div class="components-container">

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <div class="fr"><span class="fr-num">上报总数：{{count}}</span></div>
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
          <el-table-column v-for="item in detail_gen"
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
import { detail_gen } from 'src/pages/mirror_alert/alert/config/options.js'
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
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
      detailData: [],
      detail_gen: [],
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
    getAlertGenerateList (req) {
      rbAlertServicesFactory.alertGenerateList(req).then((res) => {
        if (res.count > 0) {
          this.total = res.count
          this.count = res.count
          this.detailData = res.result
        }
      })
    },
    getAlertHisGenerateList (req) {
      rbAlertServicesFactory.alertHisGenerateList(req).then((res) => {
        if (res.count > 0) {
          this.total = res.count
          this.count = res.count
          this.detailData = res.result
        }
      })
    },
    init_ () {
      if (this.type === 'alert') {
        this.getAlertGenerateList(this.getRequest())
      } else if (this.type === 'alertHis') {
        this.getAlertHisGenerateList(this.getRequest())
      }
    },
    resourceExport () {
      let excelName = '告警上报数据列表.xls'
      let url = ''
      if (this.type === 'alert') {
        url = '/v1/alerts/alertGenerateDownload?alertId=' + this.alert_id
      } else if (this.type === 'alertHis') {
        url = '/v1/alerts_his/alertGenerateDownload?alertId=' + this.alert_id
      }
      rbAlertKanBanServiceFactory.alertGenerateDownload(url).then((res) => {
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
        this.detail_gen = detail_gen
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
