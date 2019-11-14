<template>
  <div class="components-container yw-dashboard" v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="85px">
      <el-form-item label="项目名称">
        <el-input v-model="queryData.project"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="维保结束时间">
        <el-date-picker v-model="queryData.maintenanceTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="软件名称">
        <el-input v-model="queryData.softwareName"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="厂商">
        <el-select v-model="queryData.company"
                   clearable>
          <el-option v-for="(comp, index) in companyList"
                     :key="index"
                     :label="comp.produce"
                     :value="comp.produce">
          </el-option>
        </el-select>
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
                   @click="showdeleteDialog">删除</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData.isImport=true">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcelData">导出</el-button>

      </div>
      <div class="yw-el-table-wrap">

        <el-table :data="tableData"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
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
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="分类"
                           prop="classify"
                           sortable></el-table-column>
          <el-table-column label="软件名称"
                           prop="softwareName"
                           width="100"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="单位"
                           prop="unit"
                           sortable></el-table-column>
          <el-table-column label="数量"
                           prop="number"
                           sortable></el-table-column>
          <el-table-column label="服务供应商"
                           prop="company"
                           sortable
                           width="120"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="服务联系人"
                           prop="userName"
                           width="120"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="服务联系人电话"
                           prop="telephone"
                           width="120"
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="本期维保起始时间"
                           prop="maintenBeginDate"
                           width="150"
                           sortable>
            <template slot-scope="scope">
              {{scope.row.maintenBeginDate | formatDate2}}
            </template>
          </el-table-column>
          <el-table-column label="本期维保结束时间"
                           prop="maintenEndDate"
                           width="150"
                           sortable>
            <template slot-scope="scope">
              {{scope.row.maintenEndDate | formatDate2}}
            </template>
          </el-table-column>
          <el-table-column label="维保管理员"
                           prop="admin"
                           width="90"></el-table-column>
          <el-table-column label="备注"
                           prop="remark"
                           show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination>
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
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenance-services.factory.js'
export default {
  name: '/resource/maintenance/software',
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
    AddDialog: () => import('src/pages/resource/maintenance/software/dialog/add.vue'),
    YwImport: () => import('src/components/common/yw-import.vue')

  },
  data () {
    return {
      queryData: {},
      companyList: [],
      unitList: [],
      loading: false,
      selectData: [],
      // 导入
      importData: {
        isImport: false,
        importType: 'maintensoftware'
      },
      // project: '',
      // software_name: '',
      // mainten_end_date_before: '',
      // mainten_end_date_after: '',
      // company: '',
      // classify: '',
      // search: {
      //   mainten_begin_date_before: '',
      //   mainten_begin_date_after: '',
      //   user_name: '',
      //   telephone: '',
      //   admin: ''
      // },
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少条数据
      tableData: [],
      dialogMsg: {
        showDialog: false,
        dialogTitle: '',
        data: null
      },
      tableMultipleSelect: [],
      maintenanceIdList: [],
      add: {
        project: '',
        classify: '',
        software_name: '',
        unit: '',
        number: '',
        company: '',
        user_name: '',
        telephone: '',
        mainten_begin_date: '',
        mainten_end_date: '',
        admin: '',
        remark: ''
      },
      update: {
        id: '',
        project: '',
        classify: '',
        software_name: '',
        unit: '',
        number: '',
        company: '',
        user_name: '',
        telephone: '',
        mainten_begin_date: '',
        mainten_end_date: '',
        admin: '',
        remark: ''
      },
      rules: {
        project: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        software_name: [{ required: true, message: '请输入软件名称', trigger: 'blur' }],
        company: [{ required: true, message: '请输入厂商', trigger: 'change' }],
        number: [ /* { required: false, message: '请输入数量', trigger: 'blur' }, */
          { pattern: /^[1-9][0-9]*$/, message: '请输入数字', trigger: 'blur' }],
        telephone: [/* { required: true, message: '请输入电话', trigger: 'blur' }, */
          { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '手机格式不正确', trigger: 'blur' }],
        mainten_end_date: [{ required: true, message: '请输入维保结束时间', trigger: 'change' }]
      },
      fileList: [],
      ifShowAlert: false,
      alertMsg: '',
      alertType: '',
      ifShowErrorButton: false,
      currentErrorFile: '',
      currentError: '',
      headers: {
        // 'Content-Type': 'multipart/form-data;charset=utf-8'
      }

    }
  },
  mounted () {
    this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    this.headers.head_orgAccount = sessionStorage.getItem('namespace')
    this.headers.head_userName = sessionStorage.getItem('username')
    this.headers.head_isAdmin = sessionStorage.getItem('isAdmin')
    this.getBrandList()
    this.getunitList()
    this.reloadTable()
  },
  methods: {
    refresh (val) {
      if (val) {
        this.getPageData()
        this.selectData = []
      }
    },
    setDialogMsg (flag) {
      this.dialogMsg.data = null
      if (flag === 'update') {
        if (this.selectData.length === 0 || this.selectData.length > 1) {
          this.$message.error('请先选择一条要编辑的数据')
          return
        }
        this.dialogMsg.dialogTitle = '编辑软件维保'
        this.dialogMsg.data = this.selectData
      } else {
        this.dialogMsg.dialogTitle = '新增软件维保'
      }
      this.dialogMsg.showDialog = true
    },
    reloadTable () {
      this.currentPage = 1
      this.getPageData()
    },
    getPageData () {
      this.loading = true
      let obj = {
        'pageNo': this.currentPage,
        'pageSize': this.pageSize,
        'project': this.queryData.project,
        'softwareName': this.queryData.softwareName,
        'maintenEndDateBefore': this.queryData.maintenanceTime ? this.queryData.maintenanceTime[0] : undefined,
        'maintenEndDateAfter': this.queryData.maintenanceTime ? this.queryData.maintenanceTime[1] : undefined,
        'company': this.queryData.company
      }
      rbmaintenanceServiceFactory.listMaintenanceByPage(obj).then((res) => {
        this.loading = false
        this.tableData = res.result
        this.total = res.count
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.reloadTable(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getPageData()
    },
    resetSearch () {
      this.queryData = {}
      this.reloadTable()
    },
    showSearchDialog () {
      this.ifshowSearchDialog = true
    },
    cancelAdvanceSearch () {
      this.resetAdvanceSearch()
      this.ifshowSearchDialog = false
    },
    advanceSearch () {
      this.reloadTable()
      this.resetAdvanceSearch()
      this.ifshowSearchDialog = false
    },
    resetAdvanceSearch () {
      this.search.mainten_begin_date_before = ''
      this.search.mainten_begin_date_after = ''
      this.search.user_name = ''
      this.search.telephone = ''
      this.search.admin = ''
    },
    showAddDialog () {
      this.ifshowAddDialog = true
    },
    addMaintenanceValidate () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.checkAddMaintenanceSoftware()
        } else {
          return false
        }
      })
    },
    checkAddMaintenanceSoftware () {
      var obj = {
        'company': this.form.company,
        'project': this.form.project,
        'softwareName': this.form.softwareName
      }
      rbmaintenanceServiceFactory.selectMaintenSoftwareBySoftNmae(obj).then((res) => {
        if (res.software_name !== null) {
          this.$message.error('相同厂商项目软件名称重复')
        } else {
          this.addMaintenanceSoftware()
        }
      })
    },
    addMaintenanceSoftware () {
      var obj = {
        'project': this.add.project,
        'classify': this.add.classify,
        'software_name': this.add.software_name,
        'unit': this.add.unit,
        'number': this.add.number,
        'company': this.add.company,
        'user_name': this.add.user_name,
        'telephone': this.add.telephone,
        'mainten_begin_date': this.add.mainten_begin_date,
        'mainten_end_date': this.add.mainten_end_date,
        'admin': this.add.admin,
        'remark': this.add.remark
      }
      rbmaintenanceServiceFactory.insertMaintenance(obj).then((res) => {
        if (res === 'success') {
          this.$message.success('新增成功')
        } else {
          this.$message.error('新增失败')
        }
        this.closeAddDialog()
        this.reloadTable(1)
      }).catch((res) => {
        this.$message.error('新增失败')
      })
    },
    closeAddDialog () {
      this.$refs.addForm.resetFields()
      this.clearAddDialog()
      this.ifshowAddDialog = false
    },
    clearAddDialog () {
      this.add.project = ''
      this.add.classify = ''
      this.add.software_name = ''
      this.add.unit = ''
      this.add.number = ''
      this.add.company = ''
      this.add.user_name = ''
      this.add.telephone = ''
      this.add.mainten_begin_date = ''
      this.add.mainten_end_date = ''
      this.add.admin = ''
      this.add.remark = ''
    },
    handleSelectionChange (val) {
      this.selectData = val
      this.tableMultipleSelect = val
      this.maintenanceIdList = []
      val.forEach(item => {
        this.maintenanceIdList.push({ id: item.id })
      })
    },
    showdeleteDialog () {
      if (this.tableMultipleSelect.length !== 1) {
        this.$message.error('请选择一条维保信息进行删除，不支持批量删除操作.')
        return false
      }
      this.deleteMaintenHardware()
    },
    deleteMaintenHardware () {
      this.$confirm('此操作将删除维保信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then((res) => {
        var str = ''
        this.maintenanceIdList.forEach((item) => {
          str += item.id + ','
        })
        str = str.slice(0, -1)
        var obj = {
          ids: str
        }
        rbmaintenanceServiceFactory.deleteMaintenanceById(obj).then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.reloadTable()
          } else {
            this.$message.error(res.message)
          }
        }).catch((res) => {
          this.$message.error('删除失败')
        })
      })
    },
    showUpdateCheck () {
      if (this.tableMultipleSelect.length !== 1) {
        this.$alert('请选择一条数据进行修改', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        this.showUpdateDialog()
      }
    },
    // 导入弹窗
    setImportDisplay (val) {
      this.importData.isImport = val
      this.reloadTable()
    },
    showUpdateDialog () {
      // var str = this.maintenanceIdList[0]
      // var obj = {
      //   id: str.id
      // }
      // rbmaintenanceServiceFactory.selectMaintenanceById(obj).then((res) => {
      //   // console.log(res)
      //   var obj01 = res
      //   this.update.id = obj01.id
      //   this.update.project = obj01.project
      //   this.update.classify = obj01.classify
      //   this.update.software_name = obj01.software_name
      //   this.update.unit = obj01.unit
      //   this.update.number = obj01.number
      //   this.update.company = obj01.company
      //   this.update.user_name = obj01.user_name
      //   this.update.telephone = obj01.telephone
      //   this.update.mainten_begin_date = obj01.mainten_begin_date
      //   this.update.mainten_end_date = obj01.mainten_end_date
      //   this.update.admin = obj01.admin
      //   this.update.remark = obj01.remark
      // })
      // this.ifshowUpdateDialog = true
    },
    updateMaintenanceValidate () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.checkUpdateMaintenanceSoftware()
        } else {
          return false
        }
      })
    },
    checkUpdateMaintenanceSoftware () {
      var obj = {
        'company': this.update.company,
        'project': this.update.project,
        'software_name': this.update.software_name
      }
      rbmaintenanceServiceFactory.selectMaintenSoftwareBySoftNmae(obj).then((res) => {
        if (res.software_name !== null && this.update.id !== res.id) {
          this.$message.error('相同厂商项目软件名称重复')
        } else {
          this.updateMaintenanceSoftware()
        }
      })
    },
    updateMaintenanceSoftware () {
      var obj = {
        'id': this.update.id,
        'project': this.update.project,
        'classify': this.update.classify,
        'software_name': this.update.software_name,
        'unit': this.update.unit,
        'number': this.update.number,
        'company': this.update.company,
        'user_name': this.update.user_name,
        'telephone': this.update.telephone,
        'mainten_begin_date': this.update.mainten_begin_date,
        'mainten_end_date': this.update.mainten_end_date,
        'admin': this.update.admin,
        'remark': this.update.remark
      }
      rbmaintenanceServiceFactory.updateMaintenance(obj).then((res) => {
        if (res === 'success') {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
        this.closeUpdateDialog()
        this.reloadTable(1)
      }).catch((res) => {
        this.$message.error('修改失败')
      })
    },
    closeUpdateDialog () {
      this.$refs.updateForm.resetFields()
      this.clearUpdateDialog()
      this.ifshowUpdateDialog = false
    },
    clearUpdateDialog () {
      this.update.id = ''
      this.update.project = ''
      this.update.classify = ''
      this.update.software_name = ''
      this.update.unit = ''
      this.update.number = ''
      this.update.company = ''
      this.update.user_name = ''
      this.update.telephone = ''
      this.update.mainten_begin_date = ''
      this.update.mainten_end_date = ''
      this.update.admin = ''
      this.update.remark = ''
    },
    showBatchUpdateCheck () {
      if (this.tableMultipleSelect.length === 0) {
        this.$alert('请至少选择一条数据更新', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        this.ifshowBatchUpdateDialog = true
      }
    },
    batchUpdate () {
      var str = ''
      this.maintenanceIdList.forEach((item) => {
        str += item.id + ','
      })
      str = str.slice(0, -1)
      var obj = {
        'id': str,
        'classify': this.update.classify,
        'unit': this.update.unit,
        'number': this.update.number,
        'user_name': this.update.user_name,
        'telephone': this.update.telephone,
        'mainten_begin_date': this.update.mainten_begin_date,
        'mainten_end_date': this.update.mainten_end_date,
        'admin': this.update.admin,
        'remark': this.update.remark
      }
      rbmaintenanceServiceFactory.batchUpdateMaintenSoftware(obj).then((res) => {
        this.$message.success('批量更新成功')
        this.closeBatchUpdateDialog()
        this.reloadTable()
      }).catch((res) => {
        this.$message.error('批量更新失败')
      })
    },
    closeBatchUpdateDialog () {
      this.$refs.updateForm.resetFields()
      this.clearUpdateDialog()
      this.ifshowBatchUpdateDialog = false
    },
    exportExcelData () {
      this.loading = true
      let obj = {
        'project': this.queryData.project,
        'softwareName': this.queryData.softwareName,
        'maintenEndDateBefore': this.queryData.maintenanceTime ? this.queryData.maintenanceTime[0] : undefined,
        'maintenEndDateAfter': this.queryData.maintenanceTime ? this.queryData.maintenanceTime[1] : undefined,
        'company': this.queryData.company
      }
      //  console.log(obj)
      rbmaintenanceServiceFactory.downloadMaintenSoftware(obj).then((res) => {
        this.loading = false
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '软件维保信息.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
      })
    },
    showImportDialog () {
      this.ifshowImportDialog = true
    },
    handleSuccess (response, file, fileList) {
      // const self = this
      for (var i = 0; i < fileList.length; i++) {
        if (response.success === true) {
          if (file.uid === fileList[i].uid) {
            fileList[i].url = response.url
          }

          this.ifShowAlert = true
          this.alertMsg = file.name.substring(0, file.name.lastIndexOf('.')) + '成功导入数据'
          this.alertType = 'success'
          this.ifShowErrorButton = false
          this.reloadTable()
        } else {
          if (file.uid === fileList[i].uid) {
            fileList[i].status = false
            file.status = false
          }
          this.ifShowAlert = true
          this.alertMsg = file.name.substring(0, file.name.lastIndexOf('.')) + '导入失败'
          this.alertType = 'warning'
          this.ifShowErrorButton = true
          this.currentErrorFile = file.name.substring(0, file.name.lastIndexOf('.')) + '-error.txt'
          this.currentError = response.message
        }
      }
    },
    downLoadErrorfile () {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a')
      eleLink.download = this.currentErrorFile
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      var blob = new Blob([this.currentError])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    },
    closeAlert: function () {
      this.ifShowAlert = false
    },
    handleClose () {
      this.fileList = []
      this.ifShowAlert = false
      this.ifShowErrorButton = false
      this.ifshowImportDialog = false
    },
    getBrandList () {
      // var obj = {
      //   type: 'device_mfrs'
      // }
      rbmaintenanceServiceFactory.listProduceByPage({ type: '维保供应商' }).then((res) => {
        this.companyList = res.data
      })
      // rbmaintenanceServiceFactory.getDictsByType(obj).then((res) => {
      //   res.forEach((item) => {
      //     let obj = {
      //       'name': item.name,
      //       'value': item.value
      //     }
      //     this.companyList.push(obj)
      //   })
      // })
    },
    getunitList () {
      var options = [{
        value: '套',
        name: '套'
      }, {
        value: '人天',
        name: '人天'
      }]
      this.unitList = options
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
