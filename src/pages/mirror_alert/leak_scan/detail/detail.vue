<template>
  <div class="components-container">
    <!-- 查询条件开始 -->
    <el-form class="components-section yw-form"
             :inline="true"
             :model="formData">
      <el-form-item label="归属业务:">
        <span>{{ bizLine }}</span>
      </el-form-item>
      <el-form-item label="最新扫描时间:">
        <span>{{ scanDate }}</span>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->
    <!-- 结果开始 -->
    <section class="components-section">
      <el-table
        :data="reportData"
        style="width: 100%;margin-top:15px"
        border
      >
        <el-table-column
          prop="ip"
          label="IP地址"
          align="center"
        >
          <template slot-scope="scope">
            <a href="#"
               @click="gotoReport(scope.row.ip)">{{scope.row.ip}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="highLeaks"
          label="高危漏洞数量"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mediumLeaks"
          label="中危漏洞数量"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lowLeaks"
          label="低微漏洞"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="riskVal"
          label="风险值"
          align="center"
        >
        </el-table-column>
      </el-table>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
    </section>
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
      gotoReport: function (ip) {
        let page_url = 'http://192.168.183.131/20190712/4A%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0/host/'+ ip +'.html'
        console.log(page_url)
        this.$router.push({
          path: '/mirror_alert/leak_scan/ip',
          query: {
            page: page_url
          }
        })
      },
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.search()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      search: function () {
        rbAlertServiceFactory.getSecurityLeakScanReport({
          scan_id: this.scanId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }).then(res => {
          if (res.count > 0) {
            this.total = res.count
            this.reportData = res.result
          }
        })
      }
    },
    mounted () {
      let scan_id = this.$route.query.scan_id
      this.scanId = scan_id
      rbAlertServiceFactory.getSecurityLeakScanById(scan_id).then(res => {
        this.bizLine = res.bizLine
        this.scanDate = moment(res.scanDate).format('YYYY-MM-DD')
      })
      this.search()
    }
  }
</script>
