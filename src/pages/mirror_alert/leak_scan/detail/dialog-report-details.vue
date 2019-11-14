<template>
  <div class="components-container">
    <el-form class="yw-form"
             label-width="90px">
      <el-form-item label="归属业务"
                    class="text-left">
        {{bizLine}}
      </el-form-item>
      <el-form-item label="最新扫描时间"
                    class="text-left">
        {{scanDate}}
      </el-form-item>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">

      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="reportData"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border>
          <el-table-column prop="ip"
                           label="IP地址">
            <template slot-scope="scope">
<!--              <a href="#"-->
<!--                 @click="gotoReport(scope.row.ip)">{{scope.row.ip}}</a>-->
              <a :href="scope.row.reportPath" target="_blank"
              >{{scope.row.ip}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="highLeaks"
                           label="高危漏洞数量">
          </el-table-column>
          <el-table-column prop="mediumLeaks"
                           label="中危漏洞数量">
          </el-table-column>
          <el-table-column prop="lowLeaks"
                           label="低微漏洞">
          </el-table-column>
          <el-table-column prop="riskVal"
                           label="风险值">
          </el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
export default {
  props: ['scan_id'],
  name: '/mirror_alert/leak_scan/detail',
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue')
  },
  data () {
    return {
      scanId: '',
      bizLine: '',
      scanDate: '',
      currentPage: 1, // 当前页
      pageSize: 20, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      reportData: null
    }
  },
  methods: {
    gotoReport (report_file_path) {
      this.$emit('closeDialog');
      this.$router.push({
        path: '/mirror_alert/leak_scan/ip',
        query: {
          page: report_file_path
        }
      })
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    handleSelectionChange () {

    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.search()
    },
    search: function () {
      rbAlertServiceFactory.getSecurityLeakScanReport({
        scan_id: this.scanId,
        page_no: this.currentPage,
        page_size: this.pageSize
      }).then(res => {
        if (res.count > 0) {
          this.total = res.count
          this.reportData = res.result
        }
      })
    },
    load: function (scan_id) {
      this.scanId = scan_id
      rbAlertServiceFactory.getSecurityLeakScanById(scan_id).then(res => {
        this.bizLine = res.bizLine
        this.scanDate = moment(res.scanDate).format('YYYY-MM-DD')
      })
      this.search()
    }
  },
  mounted () {

    this.load(this.scan_id)
  },
  watch: {
  }
}
</script>
