<template>
  <div class="components-container yw-dashboard"  v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="75px">
      <el-form-item label="所属业务">
        <el-select v-model="system_name"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item,index) in system_nameList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="device_name"></el-input>
      </el-form-item>

      <el-form-item label="设备序列号">
        <el-input v-model="device_serial_number"></el-input>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="deviceType" clearable >
          <el-option
            v-for="(item, index ) in deviceTypeList"
            :key="index"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号">
        <el-input v-model="deviceModel"></el-input>
      </el-form-item>
      <el-form-item label="资产编号">
        <el-input v-model="assets_number"></el-input>
      </el-form-item>
      <el-form-item label="设备厂商">
        <el-select v-model="serverProduce"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="(item,index) in produceList"
                     :key="index"
                     :label="item.produce"
                     :value="item.produce"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="warranty_date_before"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="startMonthOption"
                        format="yyyy-MM-dd"></el-date-picker> -
        <el-date-picker v-model="warranty_date_after"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="endMonthOption"
                        format="yyyy-MM-dd"></el-date-picker>
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
                   @click="showAddDialog()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="showUpdateCheck()">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-delete"
                   @click="showdeleteDialog()">删除</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="showBatchUpdateCheck()">批量更新</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcelData()">导出</el-button>

      </div>
      <div class="yw-el-table-wrap">

        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 310px)">
          <el-table-column type="selection"
                           fixed
                           width="55"> </el-table-column>
          <el-table-column label="id"
                           prop="id"
                           width="80"
                           v-if="false"></el-table-column>
          <el-table-column label="项目"
                           prop="projectName"
                           width="100"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="出保时间"
                           prop="warranty_date"
                           width="100"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="设备序列号"
                           prop="deviceSerialNumber"
                           width="120"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="设备名称"
                           prop="deviceName"
                           width="100"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="资产编号"
                           prop="assetsNumber"
                           width="100"
                           sortable
                           show-overflow-tooltip></el-table-column>
          <el-table-column label="资源池"
                           prop="resourcePool"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="一级部门"
                           prop="department1"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="二级部门"
                           prop="department2"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="所属业务"
                           prop="systemName"
                           width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备分类"
                           prop="deviceClassify"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备类型"
                           prop="deviceType"
                           width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备型号"
                           prop="deviceModel"
                           width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="服务厂家"
                           prop="serverProduce"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="服务人员"
                           prop="serverPerson"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="服务级别"
                           prop="serverLevel"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="开始时间"
                           prop="start_date"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="结束时间"
                           prop="end_date"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="处理时长(小时)"
                           prop="processTime"
                           width="120"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="实际人天"
                           prop="actualManDay"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="移动审批人"
                           prop="mobileApprover"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="运维审批人"
                           prop="operateApprover"
                           width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="创建人"
                           prop="creater"
                           width="100"
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

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="ifshowAddDialog"
               width="720px"
               title="添加硬件维保使用"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form :model="add"
                 :rules="rules"
                 ref="addForm"
                 :inline="true"
                 label-width="130px"
                 class="yw-form is-required">
          <el-form-item label="设备序列号"
                        prop="hardware">
            <el-select v-model="add.hardware"
                       value-key="id"
                       filterable>
              <el-option v-for="(item,index) in deviceSerialNumberList"
                         :key="index"
                         :label="item.device_serial_number"
                         :value="item">
                <span style="float: left">{{ item.device_serial_number }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warranty_date }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务人员"
                        prop="server_person">
            <el-input v-model="add.server_person"
                      style="width: 180px " />
          </el-form-item>
          <el-form-item label="服务级别"
                        prop="server_level">
            <el-select v-model="add.server_level"
                       placeholder="请选择"
                       value-key="id"
                       class="list-sel"
                       filterable
                       clearable>
              <el-option v-for="(item,index) in server_level"
                         :key="index"
                         :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="start_date">
            <el-date-picker v-model="add.start_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_add"
                            :picker-options="add.startAddOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="end_date">
            <el-date-picker v-model="add.end_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_add"
                            :picker-options="add.endAddOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="处理时长"
                        prop="">
            <el-input v-model="add.process_time"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="实际人天"
                        prop="actual_man_day">
            <el-input v-model="add.actual_man_day"
                      type="number"
                      :min="1"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="移动审批人"
                        prop="">
            <el-input v-model="add.mobile_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="运维审批人"
                        prop="">
            <el-input v-model="add.operate_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="addValidate">确定</el-button>
        <el-button size="small"
                   @click="closeAddDialog">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
              :visible.sync="ifshowUpdateDialog"
               width="720px"
               title="编辑硬件维保使用"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form :model="update"
                 :rules="rules"
                 ref="updateForm"
                 :inline="true"
                 label-width="130px"
                 class="yw-form is-required">
          <el-form-item label="设备序列号">
            <el-input v-model="update.device_serial_number"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务人员"
                        prop="server_person">
            <el-input v-model="update.server_person"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="服务级别"
                        prop="server_level">
            <el-select v-model="update.server_level"
                       placeholder="请选择"
                       value-key="id"
                       class="list-sel"
                       filterable
                       clearable>
              <el-option v-for="(item,index) in server_level"
                         :key="index"
                         :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="start_date">
            <el-date-picker v-model="update.start_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_update"
                            :picker-options="update.startUpdateOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="end_date">
            <el-date-picker v-model="update.end_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_update"
                            :picker-options="update.endUpdateOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="处理时长">
            <el-input v-model="update.process_time"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="实际人天"
                        prop="actual_man_day">
            <el-input v-model="update.actual_man_day"
                      type="number"
                      :min="1"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="移动审批人">
            <el-input v-model="update.mobile_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="运维审批人">
            <el-input v-model="update.operate_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="updateMaintenanceValidate">确定</el-button>
        <el-button size="small"
                   @click="closeUpdateDialog">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               :visible.sync="ifshowBatchUpdateDialog"
               width="720px"
               title="批量更新硬件维保使用"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form :model="update"
                 :rules="rules"
                 ref="updateForm"
                 :inline="true"
                 label-width="130px"
                 class="yw-form is-required">
          <el-form-item label="服务人员"
                        prop="server_person">
            <el-input v-model="update.server_person"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="服务级别"
                        prop="server_level">
            <el-select v-model="update.server_level"
                       placeholder="请选择"
                       value-key="id"
                       class="list-sel"
                       filterable
                       clearable>
              <el-option v-for="(item,index) in server_level"
                         :key="index"
                         :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间"
                        prop="start_date">
            <el-date-picker v-model="update.start_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_update"
                            :picker-options="update.startUpdateOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间"
                        prop="end_date">
            <el-date-picker v-model="update.end_date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            @change="dateDiff_update"
                            :picker-options="update.endUpdateOption"
                            placeholder="选择日期"
                            style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="处理时长">
            <el-input v-model="update.process_time"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="实际人天"
                        prop="actual_man_day">
            <el-input v-model="update.actual_man_day"
                      type="number"
                      :min="1"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="移动审批人">
            <el-input v-model="update.mobile_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
          <el-form-item label="运维审批人">
            <el-input v-model="update.operate_approver"
                      style="width: 180px "></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="batchUpdateValidate">确定</el-button>
        <el-button size="small"
                   @click="closeBatchUpdateDialog">取消</el-button>
      </section>
    </el-dialog>
    <YwImport v-if="display.isImport"
              :showImport="display.isImport"
              @setImportDisplay="closeParent"
              :importType="importType"></YwImport>
    <!-- dialog -->
  </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbmaintenanceuseServiceFactory from 'src/services/cmdb/rb-maintenharduse-services.factory.js'
import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenance-services.factory.js'
export default {
  name: '/resource/maintenance/hardware/useManage',
  components: {
    YwImport: () => import('src/components/common/yw-import.vue')
  },
  data () {
    return {
      display: {
        isImport: false
      },
      importType: 'hardwareuse',
      loading: false,
      produceList: [],
      deviceSerialNumberList: [],
      system_nameList: [], // 业务系统列表
      server_level: [], // 服务级别列表
      system_name: '',
      device_name: '',
      deviceType: '',
      deviceModel: '',
      deviceTypeList: [],
      warranty_date_before: '',
      warranty_date_after: '',
      startMonthOption: {
        disabledDate: time => {
          let dateVal = this.warranty_date_after
          if (dateVal) {
            return time.getTime() > new Date(dateVal).getTime()
          }
        }
      },
      endMonthOption: {
        disabledDate: time => {
          let dateVal = this.warranty_date_before
          if (dateVal) {
            return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      device_serial_number: '',
      assets_number: '',
      resource_pool: '',
      serverProduce: '',
      search: {
        system_name: '',
        device_name: '',
        warranty_date_before: '',
        warranty_date_after: '',
        device_serial_number: '',
        assets_number: '',
        serverProduce: ''
      },
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少条数据
      tableData: [],
      ifshowAddDialog: false,
      ifshowUpdateDialog: false,
      ifshowBatchUpdateDialog: false,
      ifshowImportDialog: false,
      tableMultipleSelect: [],
      maintenanceIdList: [],
      add: {
        hardware: {},
        device_serial_number: '',
        server_person: '',
        server_level: '',
        start_date: '',
        end_date: '',
        startAddOption: {
          disabledDate: time => {
            let dateVal = this.add.end_date
            if (dateVal) {
              return time.getTime() > new Date(dateVal).getTime()
            }
          }
        },
        endAddOption: {
          disabledDate: time => {
            let dateVal = this.add.start_date
            if (dateVal) {
              return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        process_time: '',
        actual_man_day: '',
        mobile_approver: '',
        operate_approver: ''
      },
      update: {
        id: '',
        deviceSerialNumberList: [],
        device_serial_number: '',
        server_person: '',
        server_level: '',
        start_date: '',
        end_date: '',
        startUpdateOption: {
          disabledDate: time => {
            let dateVal = this.update.end_date
            if (dateVal) {
              return time.getTime() > new Date(dateVal).getTime()
            }
          }
        },
        endUpdateOption: {
          disabledDate: time => {
            let dateVal = this.update.start_date
            if (dateVal) {
              return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        process_time: '',
        actual_man_day: '',
        mobile_approver: '',
        operate_approver: ''
      },
      rules: {
        hardware: [{ required: true, message: '请选择设备序列号', trigger: 'change' }],
        server_person: [{ required: true, message: '请输入服务人员', trigger: 'blur' }],
        server_level: [{ required: true, message: '请输入服务级别', trigger: 'blur' }],
        start_date: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        end_date: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        actual_man_day: [{ required: true, message: '请输入实际人天', trigger: 'blur' },
        { pattern: /^[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]
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
    this.getDeviceType()
    this.getSystemNameList()
    this.getProduce()
    this.reloadTable()
    this.getServerLevel()
  },
  methods: {
    getDeviceType () {
      let _this = this
      let obj = {
        'type': 'device_type',
      }
      rbCmdbServiceFactory.getDictsByType(obj).then((res) => {
        if (res) {
          _this.deviceTypeList = res
        }
      })
    },
    reloadTable (num) {
      if (num !== 1) {
        // 搜索前将当前页置为1
        this.currentPage = 1
      }
      this.getPageData()
    },
    getPageData () {
      this.loading = true
      var obj = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'system_name': this.system_name,
        'deviceName': this.device_name,
        'deviceType': this.deviceType,
        'deviceModel': this.deviceModel,
        'warranty_date_before': this.warranty_date_before,
        'warranty_date_after': this.warranty_date_after,
        'deviceSerialNumber': this.device_serial_number,
        'assets_number': this.assets_number,
        'serverProduce': this.serverProduce
      }
      rbmaintenanceuseServiceFactory.listMaintenanceByPage(obj).then((res) => {
        this.loading = false
        this.tableData = res.data
        this.total = res.count
      })
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.reloadTable(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.reloadTable(1)
    },
    resetSearch () {
      this.system_name = ''
      this.device_name = ''
      this.warranty_date_before = ''
      this.warranty_date_after = ''
      this.device_serial_number = ''
      this.assets_number = ''
      this.serverProduce = ''
      this.deviceType=''
      this.deviceModel=''
      this.reloadTable()
    },
    showAddDialog () {
      this.ifshowAddDialog = true

      this.clearAddDialog()

      this.getHardwareTableList()

      if (this.server_level.length < 1) {
        this.server_level = []
        this.getServerLevel()
      }
    },
    // 查询硬件维保可选数据
    getHardwareTableList () {
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/mainten/hardwareuse/getHardwareTableList`
      }).then((res) => {
        this.deviceSerialNumberList = res
        return res
      })
    },
    addValidate () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addHardwareUse()
        } else {
          return false
        }
      })
    },
    addHardwareUse () {
      var obj = {
        'deviceSerialNumber': this.add.device_serial_number,
        'hardWareId': this.add.hardware.id,
        'projectInstanceId': this.add.hardware.project_instance_id,
        'serverPerson': this.add.server_person,
        'serverLevel': this.add.server_level,
        'start_date': this.add.start_date,
        'end_date': this.add.end_date,
        'processTime': this.add.process_time,
        'actualManDay': this.add.actual_man_day,
        'mobileApprover': this.add.mobile_approver,
        'operateApprover': this.add.operate_approver,
        'creater': sessionStorage.getItem('username')
      }
      rbmaintenanceuseServiceFactory.addMaintenanceuse(obj).then((res) => {
        if (res.success) {
          this.$message.success('新增成功')
        } else {
          this.$message.error('新增失败')
        }
        this.closeAddDialog()
        this.reloadTable(1)
        return res
      }).catch(() => {
        this.$message.error('新增失败')
      })
    },
    closeAddDialog () {
      this.$refs.addForm.resetFields()
      this.clearAddDialog()
      this.ifshowAddDialog = false
    },
    clearAddDialog () {
      this.add.device_serial_number = '',
        this.add.hardware = {},
        this.add.server_person = '',
        this.add.server_level = '',
        this.add.start_date = '',
        this.add.end_date = '',
        this.add.process_time = '',
        this.add.actual_man_day = '',
        this.add.mobile_approver = '',
        this.add.operate_approver = ''
    },
    handleSelectionChange (val) {
      this.tableMultipleSelect = val
      this.maintenanceIdList = []
      val.forEach(item => {
        this.maintenanceIdList.push(item)
      })
    },
    showdeleteDialog () {
      if (this.tableMultipleSelect.length < 1) {
        this.$message.error('请选择维保信息进行删除')
      } else {
        this.deleteHardwareUse()
      }
    },
    deleteHardwareUse () {
      this.$confirm('此操作将删除维保信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        var str = ''
        this.maintenanceIdList.forEach((item) => {
          str += item.id + ','
        })
        str = str.slice(0, -1)
        var obj = {
          id: str
        }
        rbmaintenanceuseServiceFactory.deleteMaintenanceById(obj).then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
          this.reloadTable()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    showUpdateCheck () {
      if (this.tableMultipleSelect.length !== 1) {
        this.$message.error('请选择一条数据进行修改')
      } else {
        this.showUpdateDialog()
      }
    },
    showUpdateDialog () {
      var str = this.maintenanceIdList[0]

      this.update.id = str.id
      this.update.device_serial_number = str.deviceSerialNumber
      this.update.server_person = str.serverPerson
      this.update.server_level = str.serverLevel
      this.update.start_date = str.start_date
      this.update.end_date = str.end_date
      this.update.process_time = str.processTime
      this.update.actual_man_day = str.actualManDay
      this.update.mobile_approver = str.mobileApprover
      this.update.operate_approver = str.operateApprover

      this.ifshowUpdateDialog = true

      if (this.server_level.length < 1) {
        this.server_level = []
        this.getServerLevel()
      }
    },
    updateMaintenanceValidate () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.updateHardwareUse()
        } else {
          return false
        }
      })
    },
    updateHardwareUse () {
      var obj = {
        'id': this.update.id,
        'serverPerson': this.update.server_person,
        'serverLevel': this.update.server_level,
        'start_date': this.update.start_date,
        'end_date': this.update.end_date,
        'processTime': this.update.process_time,
        'actualManDay': this.update.actual_man_day,
        'mobileApprover': this.update.mobile_approver,
        'operateApprover': this.update.operate_approver
      }
      rbmaintenanceuseServiceFactory.updateMaintenance(obj).then((res) => {
        if (res.success) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
        this.closeUpdateDialog()
        this.reloadTable(1)
      }).catch(() => {
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
      this.update.device_serial_number = ''
      this.update.server_person = '',
        this.update.server_level = ''
      this.update.start_date = ''
      this.update.end_date = ''
      this.update.process_time = ''
      this.update.actual_man_day = ''
      this.update.mobile_approver = ''
      this.update.operate_approver = ''
    },
    showBatchUpdateCheck () {
      if (this.tableMultipleSelect.length === 0) {
        this.$message.error('请至少选择一条数据更新')
      } else {
        this.ifshowBatchUpdateDialog = true

        if (this.server_level.length < 1) {
          this.server_level = []
          this.getServerLevel()
        }
      }
    },
    batchUpdateValidate () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.batchUpdate()
        } else {
          return false
        }
      })
    },
    batchUpdate () {
      var str = ''
      this.maintenanceIdList.forEach((item) => {
        str += item.id + ','
      })
      str = str.slice(0, -1)
      var obj = {
        'id': str,
        'serverPerson': this.update.server_person,
        'serverLevel': this.update.server_level,
        'start_date': this.update.start_date,
        'end_date': this.update.end_date,
        'processTime': this.update.process_time,
        'actualManDay': this.update.actual_man_day,
        'mobileApprover': this.update.mobile_approver,
        'operateApprover': this.update.operate_approver
      }
      rbmaintenanceuseServiceFactory.batchUpdateMaintenHardware(obj).then((res) => {
        if (res.success) {
          this.$message.success('批量更新成功')
        } else {
          this.$message.error('批量更新失败')
        }
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
      var obj = {
        'system_name': this.system_name,
        'device_name': this.device_name,
        'warranty_date_before': this.warranty_date_before,
        'warranty_date_after': this.warranty_date_after,
        'device_serial_number': this.device_serial_number,
        'assets_number': this.assets_number,
        'serverProduce': this.serverProduce
      }
      //  console.log(obj)
      rbmaintenanceuseServiceFactory.downloadMaintenHardware(obj).then((res) => {
        this.loading = false
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '硬件维保使用信息.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
      })
    },
    importData () {
      this.display.isImport = true
    },
    closeParent (val) {
      this.display.isImport = val
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
    getServerLevel () {
      var obj = {
        type: 'server_level'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.server_level = []
        res.forEach((item) => {
          let obj = {
            'name': item.name,
            'value': item.value
          }
          this.server_level.push(obj)
        })
      })
    },
    getProduce () {
      rbmaintenanceServiceFactory.listProduceByPage({ type: '维保供应商' }).then((res) => {
        this.produceList = res.data
      })
    },
    getresource_poolList () {
      var obj = {
        type: 'idcType'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        res.forEach((item) => {
          let obj = {
            'name': item.name,
            'value': item.value
          }
          this.resource_poolList.push(obj)
        })
      })
    },
    getSystemNameList () {
      var obj = {
        type: 'bizSystem'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        res.forEach((item) => {
          let obj = {
            'name': item.name,
            'value': item.value
          }
          this.system_nameList.push(obj)
        })
      })
    },
    getMaintenFactoryList () {
      var obj = {
        type: 'provider'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        res.forEach((item) => {
          let obj = {
            'name': item.name,
            'value': item.value
          }
          this.mainten_factoryList.push(obj)
        })
      })
    },
    dateDiff_add () {
      var startDate = this.add.start_date
      var endDate = this.add.end_date
      var firstDate = new Date(startDate)
      var secondDate = new Date(endDate)
      var diff = Math.abs(firstDate.getTime() - secondDate.getTime())
      var result = parseInt(diff / (1000 * 60 * 60 * 24)) + 1;
      if (startDate == null || startDate == '' || startDate == undefined
        || endDate == null || endDate == '' || endDate == undefined) {
        result = 0
      } else {
        this.add.process_time = result * 24
      }
    },
    dateDiff_add () {
      var startDate = this.add.start_date
      var endDate = this.add.end_date
      var firstDate = new Date(startDate)
      var secondDate = new Date(endDate)
      var diff = Math.abs(firstDate.getTime() - secondDate.getTime())
      var result = parseInt(diff / (1000 * 60 * 60 * 24)) + 1;
      if (startDate == null || startDate == '' || startDate == undefined
        || endDate == null || endDate == '' || endDate == undefined) {
        result = 0
      } else {
        this.add.process_time = result * 24
      }
    },
    dateDiff_update () {
      var startDate = this.update.start_date
      var endDate = this.update.end_date
      var firstDate = new Date(startDate)
      var secondDate = new Date(endDate)
      var diff = Math.abs(firstDate.getTime() - secondDate.getTime())
      var result = parseInt(diff / (1000 * 60 * 60 * 24)) + 1;
      if (startDate == null || startDate == '' || startDate == undefined
        || endDate == null || endDate == '' || endDate == undefined) {
        result = 0
      } else {
        this.update.process_time = result * 24
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
