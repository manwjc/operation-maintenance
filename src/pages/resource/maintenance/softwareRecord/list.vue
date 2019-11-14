<template>
  <div class="components-container yw-dashboard" v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">

      <el-form-item label="项目名称">
        <el-input v-model="queryData.project"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="软件名称">
        <el-input v-model="queryData.softwareName"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="设备厂商">
        <el-select v-model="queryData.company"
                   clearable>
          <el-option v-for="(comp, index) in companyList"
                     :key="index"
                     :label="comp.produce"
                     :value="comp.produce">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="queryData.serverTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <section class="btn-wrap">
        <el-button type="primary"
                   @click="reloadTable()">查询</el-button>
        <el-button @click="resetSearch()">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="setDialogMsg('add')">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="setDialogMsg('update')">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="deleteRecords">删除</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData.isImport=true">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportData">导出</el-button>

      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  border
                  stripe
                  class="yw-el-table"
                  tooltip-effect="dark"
                  height="calc(100vh - 300px)"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="50"> </el-table-column>
          <el-table-column label="id"
                           prop="id"
                           width="80"
                           v-if="false"></el-table-column>
          <el-table-column label="项目"
                           prop="project"
                           width="120"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="分类"
                           prop="classify"></el-table-column>
          <el-table-column label="软件名称"
                           prop="softwareName"
                           width="100"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="服务厂家"
                           prop="company"
                           width="100"></el-table-column>
          <el-table-column label="服务人员"
                           prop="serverPerson"
                           width="100"></el-table-column>
          <el-table-column label="服务级别"
                           prop="serverLevel"
                           width="100"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="开始时间"
                           prop="serverStartTime"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.serverStartTime | formatDate2}}
            </template>
          </el-table-column>
          <el-table-column label="结束时间"
                           prop="serverEndTime"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.serverEndTime | formatDate2}}
            </template>
          </el-table-column>
          <el-table-column label="处理时长(天)"
                           prop="handleLong"
                           width="100"></el-table-column>
          <el-table-column label="实际人天"
                           prop="realDays"
                           width="80"></el-table-column>
          <el-table-column label="移动审批人"
                           prop="yidongApprover"
                           width="90"></el-table-column>
          <el-table-column label="运维审批人"
                           prop="devopsApprover"
                           width="90"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="创建人"
                           prop="createUser"
                           show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="pageInfo.currentPage"
                    :page-sizes="pageInfo.pageSizes"
                    :page-size="pageInfo.pageSize"
                    :total="pageInfo.total"></YwPagination>
    </el-form>

    <!-- dialog -->
    <AddDialog v-if="dialogMsg.showDialog"
               :dialogMsg="dialogMsg"
               @refreshTable="refresh"></AddDialog>
    <YwImport ref="importInstances"
              v-if="importData.isImport"
              :showImport="importData.isImport"
              :dataStart="importData.dataStart"
              :SelectProps="SelectData"
              @setImportDisplay="setImportDisplay"
              :importType="importData.importType"></YwImport>
    <!-- dialog -->
  </div>
</template>

<script>
import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenance-services.factory.js'
export default {
  name: '/resource/maintenance/softwareRecord',
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    AddDialog: () => import('src/pages/resource/maintenance/softwareRecord/dialog/add.vue'),
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      tableData: [],
      loading: false,
      queryData: {},
      companyList: [],
      pageInfo: {
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [10, 20, 50, 100], // 每页多少行数组
        total: 0 // 总共多少条数据
      },
      dialogMsg: {
        showDialog: false,
        dialogTitle: '',
        data: null
      },
      selectData: [],
      maintenanceIdList: [],
      // 导入
      importData: {
        isImport: false,
        importType: 'maintensoftwarerecord'
      },
    }
  },
  mounted () {
    this.getBrandList()
    this.getPageData()
  },
  methods: {
    // 导入弹窗
    setImportDisplay (val) {
      this.importData.isImport = val
      this.reloadTable()
    },
    exportData () {
      this.loading = true
      let obj = {
        'pageNo': this.pageInfo.currentPage,
        'pageSize': this.pageInfo.pageSize,
        'project': this.queryData.project,
        'softwareName': this.queryData.softwareName,
        'serverStartTimeBegin': this.queryData.serverTime ? this.queryData.serverTime[0] : undefined,
        'serverStartTimeEnd': this.queryData.serverTime ? this.queryData.serverTime[1] : undefined,
        'company': this.queryData.company
      }
      rbmaintenanceServiceFactory.exportSoftwareRecordData(obj).then((res) => {
        this.loading = false
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '软件维保使用信息.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
      })
    },
    deleteRecords () {
      this.$confirm('此操作将删除维保使用信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let deleteIds = []
        this.maintenanceIdList.forEach(item => {
          deleteIds.push(item.id)
        })
        rbmaintenanceServiceFactory.deleteSoftwareRecord({ deleteIds: deleteIds }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.getPageData()
          } else {
            this.$message.error(res.message)
          }
        }).catch((e) => {
          this.$message.error('删除失败')
        })
      })
    },
    refresh (val) {
      if (val) {
        this.getPageData()
        this.selectData = []
      }
    },
    setDialogMsg (flag) {
      switch (flag) {
        case 'add': this.dialogMsg.dialogTitle = '添加软件维保使用记录'
          break
        case 'update': this.dialogMsg.dialogTitle = '更新软件维保使用记录'
          if (this.selectData.length !== 1) {
            this.$message.error('请先选择一条要编辑的数据')
            return
          }
          this.dialogMsg.data = this.selectData
          break
      }
      this.dialogMsg.showDialog = true
    },
    handleSelectionChange (val) {
      this.selectData = val
      this.maintenanceIdList = []
      val.forEach(item => {
        this.maintenanceIdList.push({ id: item.id })
      })
    },
    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      this.reloadTable(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      this.getPageData()
    },
    resetSearch () {
      this.queryData = {}
      this.reloadTable()
    },
    reloadTable () {
      this.pageInfo.currentPage = 1
      this.getPageData()
    },
    getPageData () {
      this.loading = true
      let obj = {
        'pageNo': this.pageInfo.currentPage,
        'pageSize': this.pageInfo.pageSize,
        'project': this.queryData.project,
        'softwareName': this.queryData.softwareName,
        'serverStartTimeBegin': this.queryData.serverTime ? this.queryData.serverTime[0] : undefined,
        'serverStartTimeEnd': this.queryData.serverTime ? this.queryData.serverTime[1] : undefined,
        'company': this.queryData.company
      }
      rbmaintenanceServiceFactory.listSoftwareRecordByPage(obj).then((res) => {
        this.loading = false
        this.tableData = res.result
        this.pageInfo.total = res.count
      })
    },
    getBrandList () {
      rbmaintenanceServiceFactory.listProduceByPage({ type: '维保供应商' }).then((res) => {
        this.companyList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
