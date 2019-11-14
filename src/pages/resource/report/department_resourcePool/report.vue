<template>
  <div class="components-container yw-dashboard" v-loading="loading" :element-loading-text="loading_text">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="一级部门">
        <el-select v-model="search_department1"
                   clearable
                   filterable
                   placeholder="请选择一级部门"
                   value-key="id"
                   @change="selectFirstDep">
          <el-option v-for="(item, index) in departmentList1"
                     :key="index"
                     :label="item.orgName"
                     :value="item">
          </el-option>
        </el-select>
        <el-select v-model="search_department2"
                   clearable
                   filterable
                   placeholder="请选择二级部门">
          <el-option v-for="(item, index) in departmentList2"
                     :key="index"
                     :label="item.orgName"
                     :value="item.orgName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="search_idcType"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item,index) in idcTypeLIst"
                     :key="index"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <el-button @click="cancel()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData">导出</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  class="yw-el-table"
                  show-summary
                  :summary-method="getSummaries"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 230px)">
          <el-table-column prop="department1"
                           label="所属租户（一级）"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="department2"
                           label="归属部门（二级）"
                           :show-overflow-tooltip="true"> </el-table-column>
          <el-table-column prop="idcType"
                           label="所属资源池名称"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="podName"
                           label="POD名称"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="totalNum"
                           label="设备数量"
                           width="100px"
                           fixed="right"></el-table-column>
          <el-table-column prop="serverNum"
                           label="服务器数量"
                           width="100px"
                           fixed="right"></el-table-column>
          <el-table-column prop="vmNum"
                           label="虚拟机数量"
                           width="100px"
                           fixed="right"></el-table-column>
          <el-table-column prop="storageNum"
                           label="存储数量"
                           width="100px"
                           fixed="right"></el-table-column>
          <el-table-column prop="networkNum"
                           label="网络数量"
                           width="100px"
                           fixed="right"></el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import reportService from 'src/services/cmdb/rb-report-service.factory.js'
import demandServiceFactory from 'src/services/cmdb/rb-demand-service.factory.js'

export default {
  data () {
    return {
      search_department1: '',
      search_department2: '',
      search_idcType: '',
      tableData: [],
      departmentList1: [],
      departmentList2: [],
      idcTypeLIst: [],
      loading: false,
      loading_text: '正在查询数据,请稍等...'
    }
  },
  mounted () {
    this.getDepartment()
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
        'idcType': this.search_idcType,
        'department1': this.search_department1.orgName,
        'department2': this.search_department2
      }
      reportService.listReportByDepartment(param).then((res) => {
        this.tableData = res
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    cancel () {
      this.search_idcType = ''
      this.search_department1 = ''
      this.search_department2 = ''
      this.search()
    },
    exportData () {
      let param = {
        'idcType': this.search_idcType,
        'department1': this.search_department1.orgName,
        'department2': this.search_department2
      }
      this.loading = true
      this.loading_text = '正在导出数据,请稍等...'
      reportService.exportReportByDepartment(param).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '各一级部门资源统计报表.xls'
        if (this.search_idcType !== undefined && this.search_idcType !== null && this.search_idcType !== '') {
          downLoadElement.download = '各一级部门各资源池配置信息统计报表.xls'
        }
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.loading_text = '正在查询数据,请稍等...'
      })
    },
    // 获取部门
    getDepartment () {
      demandServiceFactory.getDepartment({ 'pid': '0' }).then((res) => {
        if (res) {
          this.departmentList1 = res
        }
      })
    },
    selectFirstDep ($event) {
      let pid = $event.id
      demandServiceFactory.getDepartment({ 'pid': pid }).then((res) => {
        if (res) {
          this.departmentList2 = res
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
          this.idcTypeLIst = res
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
