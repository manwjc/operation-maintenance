<template>
  <div class="components-container yw-dashboard">

    <!-- tab -->
    <section class="yw-tab-section">
      <el-tabs class="yw-tabs">
        <el-tab-pane label="安全扫描报告管理">
        </el-tab-pane>
      </el-tabs>
      <el-form class="yw-tab-right yw-form"
               label-width="86px">
        <el-form-item label="最新扫描时间">
          {{ scanDate }}
        </el-form-item>
      </el-form>
    </section>
    <!-- tab -->

    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="业务线">
        <treeselect class="yw-treeselect"
                    v-model="bizSysDepChecked"
                    :multiple="true"
                    :limit="1"
                    :options="bizDepTreeSelOpts"
                    placeholder="请选择" />
      </el-form-item>
      <el-form-item label="IP查询">
        <el-input v-model="ip"
                  placeholder="请输入内容"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="漏洞等级">
        <el-select v-model="level"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option label="高危漏洞"
                     value="high"></el-option>
          <el-option label="中危漏洞"
                     value="medium"></el-option>
          <el-option label="低危漏洞"
                     value="low"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修复状态">
        <el-select v-model="repair"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option label="已修复"
                     value="1"></el-option>
          <el-option label="未修复"
                     value="0"></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="reset()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcel">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="scanSumData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 320px)">
          <el-table-column label="一级部门"
                           prop="department1"
                           width="150"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="二级部门"
                           prop="department2"
                           width="150"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="bizLine"
                           label="归属业务线">
          </el-table-column>
          <el-table-column prop="highLeaks"
                           label="高危漏洞数量">
          </el-table-column>
          <el-table-column prop="mediumLeaks"
                           label="中危漏洞数量">
          </el-table-column>
          <el-table-column prop="lowLeaks"
                           label="低危漏洞数量">
          </el-table-column>
          <el-table-column prop="reportFileName"
                           label="报告地址">
            <template slot-scope="scope">
              <a href="#"
                 @click="downloadZipFile(scope.row.reportFileUrl)">{{scope.row.reportFileName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="id"
                           label="报告详情">
            <template slot-scope="scope">
              <a href="#"
                 @click="gotoDetail(scope.row.id)">详情</a>
            </template>
          </el-table-column>
          <el-table-column prop="id"
                           label="流程处理">
            <template slot-scope="scope">
              <a href="#"
                 @click="gotoBPM(scope.row.bpmId)">{{scope.row.bpmId}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="repairStat"
                           label="修复状态">
            <template slot-scope="scope">
              <span>{{ scope.row.repairStat == 0 ? '未修复' : '已修复' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total">
      </YwPagination>
    </el-form>

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="leakScanReport.dialog"
               width="800px"
               title="业务报告信息"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <section class="yw-dialog-main">
        <dialog-report-details ref="DialogReportDetails"
                               v-if="leakScanReport.dialog"
                               :scan_id="leakScanReport.current_row_scan_id"
                               :type="'alert'" />
      </section>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import moment from 'moment'
export default {
  name: '/mirror_alert/leak_scan/list',
  components: {
    DialogReportDetails: () => import('../detail/dialog-report-details.vue'),
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    Treeselect
  },
  data () {
    return {
      leakScanReport: {
        dialog: false,
        current_row_scan_id: ''
      },
      bizSysTree: null,
      bizSysDepChecked: [],
      bizDepTreeSelOpts: [],
      scanSumData: null,
      ip: null,
      level: null,
      repair: null,
      scanDate: '',
      currentPage: 1, // 当前页
      pageSize: 20, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0 // 总共多少行数据
    }
  },
  methods: {
    downloadZipFile: function (url) {
      window.location.href = url
    },
    gotoBPM: function (bpm_id) {
      console.log(bpm_id)

      const url = `${sessionStorage.getItem('X7_SERVER_URL')}/front/inst/${bpm_id}?mirrorToken=${sessionStorage.getItem('mirror')}`
      console.log(url)
      window.open(url, '_blank')
      //        let downLoadElement = document.createElement('a')
      //        downLoadElement.href = url
      //        document.body.appendChild(downLoadElement)
      //        downLoadElement.click()
      //        document.body.removeChild(downLoadElement)
    },
    gotoDetail: function (scan_id) {
      //              console.log(scan_id)
      this.leakScanReport.current_row_scan_id = scan_id
      this.leakScanReport.dialog = true
      //        this.$router.push({
      //          path: '/mirror_alert/leak_scan/detail',
      //          query: {
      //            scan_id: scan_id
      //          }
      //        })
    },
    getBizSysTreeData: function () {
      let _this = this
      rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
        if (!_this.bizSysTree) {
          _this.bizSysTree = res
        }
        _this.bizDepTreeSelOpts = res
      })
    },
    getParams: function () {
      let _this = this
      let getBizSysByChecked = function (sysDepChecked) {
        if (sysDepChecked && sysDepChecked.length === 1 && !sysDepChecked[0]) {
          return ''
        }
        let target = []
        let list = _this.bizSysTree[0].children
        let addEle = function (eles) {
          if (!eles.children || eles.children.length === 0) {
            target.push(eles.id)
          } else {
            _.forEach(eles.children, ele => {
              addEle(ele)
            })
          }
        }
        let findEle = function (_array, _origin) {
          _.forEach(_array, child => {
            if (child.id === _origin) {
              addEle(child)
            } else if (child.children && child.children.length > 0) {
              findEle(child.children, _origin)
            }
          })
        }
        _(sysDepChecked).forEach(ele => {
          findEle(list, ele)
        })
        return _(target).uniq().join(',')
      }
      return {
        ip: this.ip,
        level: this.level,
        repairStat: this.repair,
        bizSys: (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? getBizSysByChecked(this.bizSysDepChecked) : '',
        page_no: this.currentPage,
        page_size: this.pageSize
      }
    },
    //重置
    reset () {
      this.ip = null
      this.level = null
      this.repair = null
      this.bizSysDepChecked = []
    },
    search: function () {
      let params = this.getParams()
      rbAlertServiceFactory.getSecurityLeakScan(params).then(res => {
        if (res.count > 0) {
          this.total = res.count
          this.scanDate = moment(_(res.result).first().scanDate).format('YYYY-MM-DD')
        }
        this.scanSumData = res.result

      })
    },
    exportExcel: function () {
      let params = this.getParams()
      rbAlertServiceFactory.exportSecurityLeakScanRecords(params).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '安全漏洞扫描_' + this.scanDate + '.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
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
    closeDialog (val) {
      this.leakScanReport.dialog = false;
    }
  },
  mounted: function () {
    this.getBizSysTreeData()
    this.search()
  }
}
</script>

<style lang="scss" scoped>
</style>
