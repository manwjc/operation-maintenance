<template>
  <div class="components-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="归属部门">
        <el-select v-model="search_department1"
                   clearable
                   filterable
                   placeholder="请选择一级部门"
                   value-key="id"
                   @change="selectFirstDep($event);getBizSysList($event)">
          <el-option v-for="(item, index) in departmentList1"
                     :key="item.id"
                     :label="item.orgName"
                     :value="item"></el-option>
        </el-select>
        <el-select v-model="search_department2"
                   clearable
                   filterable
                   placeholder="请选择二级部门"
                   value-key="id"
                   @change="getBizSysList($event)">
          <el-option v-for="(item, index) in departmentList2"
                     :key="item.id"
                     :label="item.orgName"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker v-model="startDate"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        placeholder="选择月"
                        :picker-options="startMonthOption">
        </el-date-picker> -
        <el-date-picker v-model="endDate"
                        type="month"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        placeholder="选择月"
                        :picker-options="endMonthOption">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="search_idcType"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item,index) in idcTypeList"
                     :key="index"
                     :label="item.name"
                     :value="item.name">
          </el-option>
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
        <!--<el-button type="text"-->
                   <!--icon="el-icon-download"-->
                   <!--@click="importData">导入</el-button>-->
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData">导出</el-button>

      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  show-summary
                  :summary-method="getSummaries"
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 300px)">
          <el-table-column prop="bizSystem"
                           label="业务系统名称"
                           width="150px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="department1"
                           label="归属一级部门"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="department2"
                           label="归属二级部门"
                           width="150px"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="idcType"
                           label="所属资源池"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="podName"
                           label="POD名称"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allocatedPhysical"
                           label="已分配物理计算资源(台)"
                           width="180px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="allocatedVM"
                           label="已分配虚拟计算资源（台）"
                           width="180px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deliveryCycle"
                           label="交付周期（天）"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deliveryRatio"
                           label="交付比例（%）"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="createTime"
                           label="日期"
                           width="150px"
                           :show-overflow-tooltip="true"></el-table-column>
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
import bizResReportService from 'src/services/cmdb/rb-bizResReport-service.factory.js'
import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'
export default {
  components: {
  },
  data () {
    return {
      display: {
        isImport: false
      },
      importType: 'bizResource',
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      search_bizSystem: '',
      search_idcType: '',
      search_department1: '',
      search_department2: '',
      startDate: this.formatter(new Date(), 'yyyy-MM'),
      endDate: '',
      tableData: [],
      bizSysList: [],
      idcTypeList: [],
      departmentList1: [],
      departmentList2: [],
      startMonthOption: {
        disabledDate: time => {
          let dateVal = this.endDate
          if (dateVal) {
            return time.getTime() > new Date(dateVal).getTime()
          }
        }
      },
      loading: false,
      loading_text: '正在查询数据,请稍等...',
      endMonthOption: {
        disabledDate: time => {
          let dateVal = this.startDate
          if (dateVal) {
            return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      }
    }
  },
  mounted () {
    this.getDepartment()
    // this.getBizSysList()
    this.getIdcTypeList()
    this.search()
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.some(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
    search () {
      this.loading = true
      let param = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'bizSystem': this.search_bizSystem,
        'idcType': this.search_idcType,
        'deviceType': '',
        'department1': this.search_department1.orgName,
        'department2': this.search_department2.orgName,
        'createTime1': this.startDate,
        'createTime2': this.endDate
      }
      bizResReportService.listByPage(param).then((res) => {
        this.total = res.count
        this.tableData = res.data
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    cancel () {
      this.search_bizSystem = ''
      this.search_idcType = ''
      this.search_department1 = ''
      this.search_department2 = ''
      this.startDate = ''
      this.endDate = ''
      this.search()
    },
    exportData () {
      let param = {
        'bizSystem': this.search_bizSystem,
        'idcType': this.search_idcType,
        'department1': this.search_department1.orgName,
        'department2': this.search_department2.orgName,
        'deviceType': '',
        'createTime1': this.startDate,
        'createTime2': this.endDate
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      bizResReportService.exportGridData(param).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '业务资源分配分析报表.xls'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    // 获取一级部门
    getDepartment () {
      demandServiceFactory.getDepartment({ 'pid': '0' }).then((res) => {
        if (res) {
          this.departmentList1 = res
        }
      })
    },
    // 级联获取二级部门
    selectFirstDep ($event) {
      this.search_department2 = ''
      let pid = $event.id
      demandServiceFactory.getDepartment({ 'pid': pid }).then((res) => {
        if (res) {
          this.departmentList2 = res
        }
      })
    },
    // 获取业务系统
    getBizSysList ($event) {
      let pid = $event.id
      let obj = {
        'type': 'bizSystem',
        'pid': pid,
        'pValue': '',
        'pType': ''
      }
      demandServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.bizSysList = []
          this.bizSysList = res
        }
      })
    },
    // 获取资源池
    getIdcTypeList () {
      let obj = {
        'type': 'idcType',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      demandServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.idcTypeList = res
        }
      })
    },
    formatter (thistime, fmt) {
      let $this = thistime
      let o = {
        'M+': $this.getMonth() + 1,
        'd+': $this.getDate(),
        'h+': $this.getHours(),
        'm+': $this.getMinutes(),
        's+': $this.getSeconds(),
        'q+': Math.floor(($this.getMonth() + 3) / 3),
        'S': $this.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    importData () {
      let _this = this
      _this.display.isImport = true
    },
    closeParent () {
      let _this = this
      _this.display.isImport = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
