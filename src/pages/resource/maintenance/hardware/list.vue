<template>
  <div class="components-container yw-dashboard"
       v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="85px">
      <el-form-item label="所属业务">
        <el-select v-model="system_name"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="(item,index) in biz_systemList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input v-model="device_name"></el-input>
      </el-form-item>

      <el-form-item label="是否购买维保">
        <el-select v-model="search.buy_mainten"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="(item,index) in optionsTrueFalseList"
                     :key="index"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否原厂维保">
        <el-select v-model="search.origin_buy"
                   placeholder="请选择"
                   clearable>
          <el-option v-for="(item, index) in optionsTrueFalseList"
                     :key="index"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备序列号">
        <el-input v-model="device_serial_number"></el-input>
      </el-form-item>
      <el-form-item label="资产编号">
        <el-input v-model="assets_number"></el-input>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="resource_pool"
                   placeholder="请选择"
                   filterable
                   clearable>
          <el-option v-for="(item, index) in resource_poolList"
                     :key="index"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出保日期">
        <el-date-picker v-model="warranty_date_before"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker> -
        <el-date-picker v-model="warranty_date_after"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
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
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-plus"
                   @click="create()">新增</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="showUpdateCheck()">编辑</el-button>
        <el-button type="text"
                   icon="el-icon-edit"
                   @click="showBatchUpdateCheck()">批量更新</el-button>
        <el-button type="text"
                   icon="el-icon-download"
                   @click="importData()">导入</el-button>
        <el-button type="text"
                   icon="el-icon-upload2"
                   @click="exportExcelData()">导出</el-button>
        <section class="fr">
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="el-icon-d-caret"
                     v-popover:popover>选择列</el-button>
          <el-popover ref="popover"
                      placement="top"
                      trigger="click">
            <div id="popover"
                 style="max-height: 300px;overflow-y: auto;">
              <el-checkbox-group v-model="selectColumns"
                                 @change="handleCheckedColumnChange">
                <div v-for="column in checkColumns">
                  <el-checkbox :label="column.columnCode">{{ column.columnName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-popover>
        </section>
      </div>

      <div class="yw-el-table-wrap">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 360px)">
          <el-table-column type="selection"
                           fixed
                           width="55"> </el-table-column>
          <el-table-column label="id"
                           prop="id"
                           width="80"
                           v-if="false"></el-table-column>
          <div v-for="(item, index) in checkColumns">
            <el-table-column
              :key="Math.random()"
              :label="item.columnName"
              :prop="item.columnCode"
              :show-overflow-tooltip="true"
              :min-width="120"
              v-if="checkColumnShow(item.columnCode)">
              <template slot-scope="scope">
                <el-button v-if="item.columnCode === 'ip' || item.columnCode === 'deviceName' " type="text" @click="goToInsDetail(scope.row)">
                  {{scope.row[item.columnCode]}}
                </el-button>
                <span v-else>{{scope.row[item.columnCode]}}</span>
              </template>
            </el-table-column>
          </div>

          <!--<el-table-column label="设备序列号"-->
                           <!--prop="deviceSerialNumber"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="资源池"-->
                           <!--prop="resourcePool"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="一级部门"-->
                           <!--prop="department1"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="二级部门"-->
                           <!--prop="department2"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="业务系统"-->
                           <!--prop="systemName"-->
                           <!--width="150"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="设备分类"-->
                           <!--prop="deviceClassify"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="设备类型"-->
                           <!--prop="deviceType"-->
                           <!--width="150"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="设备型号"-->
                           <!--prop="deviceModel"-->
                           <!--width="150"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="设备名称"-->
                           <!--prop="deviceName"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="IP"-->
                           <!--prop="ip"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="资产编号"-->
                           <!--prop="assetsNumber"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="项目名称"-->
                           <!--prop="projectName"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="出保时间"-->
                           <!--prop="warranty_date"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="维保厂家"-->
                           <!--prop="produceName"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="维保厂家联系人"-->
                           <!--prop="produceConcat"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="维保厂家联系方式"-->
                           <!--prop="producePhone"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="是否购买维保"-->
                           <!--prop="buyMainten"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="是否需原厂维保"-->
                           <!--prop="originBuy"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="原厂维保购买必要性说明"-->
                           <!--prop="originBuyExplain"-->
                           <!--width="250"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
          <!--<el-table-column label="维保管理员"-->
                           <!--prop="admin"-->
                           <!--width="100"-->
                           <!--:show-overflow-tooltip="true"></el-table-column>-->
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
               :visible.sync="ifshowUpdateDialog"
               width="720px"
               :close-on-click-modal="false"
               title="修改硬件维保信息">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="update"
                 :rules="rules"
                 ref="updateForm"
                 :inline="true"
                 label-width="130px">
          <el-form-item label="项目名称"
                        prop="project_name">
            <el-input v-model="update.project_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备序列号"
                        prop="device_serial_number">
            <el-input v-model="update.device_serial_number"
                      :disabled="true" />
          </el-form-item>
          <el-form-item label="资源池"
                        prop="resource_pool">
            <el-input v-model="update.resource_pool"
                      :disabled="true" />
          </el-form-item>
          <el-form-item label="一级部门">
            <el-input v-model="update.department1"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="二级部门">
            <el-input v-model="update.department2"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务系统">
            <el-input v-model="update.system_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备分类"
                        prop="device_classify">
            <el-input v-model="update.device_classify"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备类型"
                        prop="device_type">
            <el-input v-model="update.device_type"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备型号"
                        prop="device_model">
            <el-input v-model="update.device_model"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="设备名称"
                        prop="device_name">
            <el-input v-model="update.device_name"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="IP"
                        prop="assets_number">
            <el-input v-model="update.ip"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="资产编号"
                        prop="assets_number">
            <el-input v-model="update.assets_number"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="出保时间"
                        prop="warranty_date">
            <el-input v-model="update.warranty_date"
                      :disabled="true"></el-input>

          </el-form-item>
          <el-form-item label="服务供应商"
                        prop="produceName">
            <el-input v-model="update.produceName"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务联系人"
                        prop="mainten_supply_contact">
            <el-input v-model="update.produce_concat"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务联系人电话"
                        prop="mainten_factory_contact">
            <el-input v-model="update.produce_phone"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="是否购买维保"
                        prop="buy_mainten">
            <el-select v-model="update.buy_mainten"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item, index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否原厂维保">
            <el-select v-model="update.origin_buy"
                       placeholder="请选择"
                       class="list-sel"
                       @change="originBuyChange"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item,index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原厂维保购买必要性"
                        prop="origin_buy_explain">
            <el-select v-model="update.origin_buy_explain"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option key="1"
                         label="一旦发生故障容易影响多个业务线"
                         value="一旦发生故障容易影响多个业务线"></el-option>
              <el-option key="2"
                         label="承载业务的重要数据"
                         value="承载业务的重要数据"></el-option>
              <el-option key="3"
                         label="关键且无冗余"
                         value="关键且无冗余"></el-option>
              <el-option key="4"
                         label="小众且缺乏第三方维保支持"
                         value="小众且缺乏第三方维保支持"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维保管理员"
                        prop="admin">
            <el-input v-model="update.admin"></el-input>
          </el-form-item>
          <el-form-item label="税前(万)"
                        prop="pre_tax">
            <el-input v-model="update.pre_tax"></el-input>
          </el-form-item>
          <el-form-item label="税后(万)"
                        prop="after_tax">
            <el-input v-model="update.after_tax"></el-input>
          </el-form-item>
          <el-form-item label="单价(万)"
                        prop="unit_price">
            <el-input v-model="update.unit_price"></el-input>
          </el-form-item>
          <el-form-item label="总价(万)"
                        prop="total_price">
            <el-input v-model="update.total_price"></el-input>
          </el-form-item>
          <el-form-item label="结算方式"
                        prop="pay_method">
            <el-select v-model="update.pay_method"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option v-for="(item, index) in payMethodList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="折扣后金额(万)"
                        prop="discount_amount">
            <el-input v-model="update.discount_amount"></el-input>
          </el-form-item>
          <el-form-item label="折扣率(%)"
                        prop="discount_rate">
            <el-input v-model="update.discount_rate"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="updateMaintenanceValidate">确定</el-button>
        <el-button @click="closeUpdateDialog">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               :visible.sync="ifshowBatchUpdateDialog"
               width="500px"
               :close-on-click-modal="false"
               title="批量更新硬件维保信息">
      <section class="yw-dialog-main">
        <el-form class="yw-form is-required"
                 :model="update"
                 :rules="rules"
                 ref="updateForm"
                 :inline="true"
                 label-width="130px">
          <el-form-item label="是否购买维保"
                        prop="buy_mainten">
            <el-select v-model="update.buy_mainten"
                       placeholder="请选择"
                       clearable>
              <el-option v-for="(item,index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否原厂维保">
            <el-select v-model="update.origin_buy"
                       placeholder="请选择"
                       @change="originBuyChange"
                       clearable>
              <el-option v-for="(item,index) in optionsTrueFalseList"
                         :key="index"
                         :label="item.name"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原厂维保购买必要性"
                        prop="origin_buy_explain">
            <el-select v-model="update.origin_buy_explain"
                       placeholder="请选择"
                       class="list-sel"
                       style="width: 180px "
                       clearable>
              <el-option key="1"
                         label="一旦发生故障容易影响多个业务线"
                         value="一旦发生故障容易影响多个业务线"></el-option>
              <el-option key="2"
                         label="承载业务的重要数据"
                         value="承载业务的重要数据"></el-option>
              <el-option key="3"
                         label="关键且无冗余"
                         value="关键且无冗余"></el-option>
              <el-option key="4"
                         label="小众且缺乏第三方维保支持"
                         value="小众且缺乏第三方维保支持"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="维保管理员"
                        prop="admin">
            <el-input v-model="update.admin"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="batchUpdate">确定</el-button>
        <el-button @click="closeBatchUpdateDialog">取消</el-button>
      </section>
    </el-dialog>

    <!-- 导入弹窗 -->
    <YwImport v-if="display.isImport"
              :showImport="display.isImport"
              @setImportDisplay="closeParent"
              :importType="importType"></YwImport>
    <!-- 新增弹窗 -->
    <HardwareAdd v-if="hardwareDialogMsg.dialogVisible"
                      :dialogMsg="hardwareDialogMsg"></HardwareAdd>
  </div>

</template>

<script>
import configDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbmaintenanceServiceFactory from 'src/services/cmdb/rb-maintenhard-services.factory.js'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import { columnBase } from 'src/pages/resource/maintenance/hardware/options.js'

export default {
  components: {
    YwImport: () => import('src/components/common/yw-import.vue'),
    HardwareAdd: () => import('src/pages/resource/maintenance/hardware/add/add.vue')
  },
  data () {
    return {
      display: {
        isImport: false
      },
      hardwareDialogMsg: {
        dialogVisible: false,
        dialogTitle: '硬件维保查询新增'
      },
      importType: 'hardware',
      biz_systemList: [],
      checkColumns: [], // 初始列
      selectColumns: [], // 选择列
      updateColumn: {},
      resource_poolList: [],
      produceInfoList: [],
      produceConcatList: [],
      device_classifyList: [],
      device_typeList: [],
      device_modelList: [],
      optionsTrueFalseList: [],
      origin_buy_explainList: [],
      mainten_factoryList: [],
      real_maintenList: [],
      system_name: '',
      device_name: '',
      warranty_date_before: '',
      warranty_date_after: '',
      device_serial_number: '',
      assets_number: '',
      resource_pool: '',
      search: {
        mainten_begin_date_before: '',
        mainten_begin_date_after: '',
        mainten_end_date_before: '',
        mainten_end_date_after: '',
        device_classify: '',
        device_type: '',
        device_model: '',
        buy_mainten: '',
        origin_buy: '',
        mainten_factory: '',
        real_mainten_type: '',
        admin: ''
      },
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少条数据
      tableData: [],
      ifshowUpdateDialog: false,
      ifshowBatchUpdateDialog: false,
      ifshowImportDialog: false,
      tableMultipleSelect: [],
      maintenanceIdList: [],
      payMethodList: [], // 结算方式
      update: {
        id: '',
        project_instance_id: '',
        resource_pool: '',
        department1: '',
        department2: '',
        system_name: '',
        device_classify: '',
        device_type: '',
        device_model: '',
        device_name: '',
        ip: '',
        device_serial_number: '',
        assets_number: '',
        project_no: '',
        project_name: '',
        produce_name: '',
        produce_concat: '',
        produce_phone: '',
        warranty_date: '',
        buy_mainten: '',
        origin_buy: '',
        origin_buy_explain: '',
        admin: '',
        pre_tax: '',
        after_tax: '',
        unit_price: '',
        total_price: '',
        pay_method: '',
        discount_amount: '',
        discount_rate: ''
      },
      rules: {
        // resource_pool: [{required: true, message: '请输入资源池', trigger: 'change'}],
        // device_classify: [{ required: true, message: '请输入设备分类', trigger: 'change' }],
        // device_type: [{ required: true, message: '请输入设备类型', trigger: 'change' }],
        // device_model: [{required: true, message: '请输入设备型号', trigger: 'change'}],
        // device_name: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
        // device_serial_number: [{required: true, message: '请输入设备序列号', trigger: 'blur'}],
        // assets_number: [{required: true, message: '请输入资产编号', trigger: 'blur'}],
        // mainten_factory: [{required: true, message: '请输入维保厂家', trigger: 'change'}],
        // mainten_supply_contact: [/* { required: true, message: '请输入电话', trigger: 'blur' }, */
        //   { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '手机格式不正确', trigger: 'blur' }],
        // mainten_factory_contact: [/* { required: true, message: '请输入电话', trigger: 'blur' }, */
        //   { pattern: /^((13|14|15|17|18)[0-9]{1}\d{8})$/, message: '手机格式不正确', trigger: 'blur' }],
        // warranty_date: [{required: true, message: '请输入出保日期', trigger: 'blur'}]
        admin: [{ required: true, message: '请输入维保管理员', trigger: 'blur' }],
        buy_mainten: [{ required: true, message: '是否购买维保', trigger: 'change' }],
        origin_buy_explain: [{ required: false, message: '请输入原厂维保购买必要性说明', trigger: 'change' }],
        pre_tax: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
        after_tax: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
        unit_price: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
        total_price: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
        discount_amount: [{validator: (rule, value, callback) => this.validMoneyNumber(rule, value, callback), trigger: 'change'}],
        discount_rate: [{validator: (rule, value, callback) => this.validPercentage(rule, value, callback), trigger: 'change'}]
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
      },
      loading: false

    }
  },
  mounted () {
    this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    this.headers.head_orgAccount = sessionStorage.getItem('namespace')
    this.headers.head_userName = sessionStorage.getItem('username')
    this.headers.head_isAdmin = sessionStorage.getItem('isAdmin')
    this.initCheckColumns()
    this.getColumnsShow()
    this.getDeviceClassifyList()
    this.getDeviceTypeList()
    // this.getDeviceModelList()
    this.getoptionsTrueFalseList()
    this.getMaintenFactoryList()
    this.getRealMaintenList()
    this.getPayMethodList()
    this.reloadTable()

    this.getBizSysList()
    this.getIdcTypeList();
  },
  methods: {
    validPercentage(rule, value, callback) {
      if(value == null || value == '') {
        return callback()
      }
      const regex = /^([1-9]\d?|100)$/
      if (value && !regex.test(value)) {
        return callback(new Error('请输入[1,100]之间的整数'))
      }
      return callback()
    },
    validMoneyNumber (rule, value, callback) {
      if(value == null || value == '') {
        return callback()
      }
      // 特殊处理 0 和 0.00
      if(value == '0' || (value.indexOf('.') != -1 && value.charAt(value.length-1) == '0')) {
          return callback(new Error('请输入大于零的正数'))
      }
      const pattern = /^[\+]?(0|[1-9]\d*)(\.\d+)?$/
      if (value && !pattern.test(value)) {
        return callback(new Error('请输入大于零的正数'))
      }
      return callback()
    },
    getPayMethodList(){
      var option = [{
        name: '人/天',
        value: '人/天'
      }, {
        name: '月',
        value: '月'
      }, {
        name: '年',
        value: '年'
      }]
      this.payMethodList = option
    },
    // 新增
    create(){
      this.hardwareDialogMsg.dialogVisible = true
    },
    checkColumnShow(columnCode) {
      return this.selectColumns.indexOf(columnCode) > -1
    },
    goToInsDetail (row) {
      this.$router.push({path: '/resource/iframe/detail',query: {instanceId: row.instanceId,moduleCode: row.moduleCode, moduleId:  row.moduleId, state: 'detail'}})
    },
    // 如没有获取到列信息则初始化列
    initCheckColumns() {
      let that = this
      this.checkColumns = []
      for (let key in columnBase) {
        that.checkColumns.push({columnCode: key, columnName: columnBase[key]})
      }
    },
    // 有获取到列信息则初始化列信息
    getColumnsShow() {
      let that = this
      this.selectColumns = []
      this.updateColumn = {}
      let username = sessionStorage.getItem('username')
      rbCmdbServiceFactory.getColumnFilter({ menuType: 'CMDB_MAINTENANCE', moduleId: username}).then((res) => {
        that.updateColumn = res
        if (res.columnInfo !== null) {
          let info = JSON.parse(res.columnInfo)
          for(let key in info) {
            if (info[key]) {
              that.selectColumns.push(key)
            }
          }
        }
      })
    },
    handleCheckedColumnChange (val) {
      let that = this
      let columnFilter = {}
      for (let key in columnBase) {
        that.$set(columnFilter, key, false)
      }
      that.selectColumns.forEach(item => {
        columnFilter[item]= true
      })
      if (!this.updateColumn) {
        that.updateColumn = {}
      }
      let data = this.updateColumn
      data.columnInfo = JSON.stringify(columnFilter)
      data.columnMap = columnFilter
      rbCmdbServiceFactory.updateColumnFilter(data).then((res) => {
      })
    },
    // 获取业务系统
    getBizSysList () {
      let obj = {
        'type': 'bizSystem',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        if (res) {
          this.biz_systemList = res
        }
        return res
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
      this.rbHttp.sendRequest({
        method: 'GET',
        params: obj,
        url: `/v1/cmdb/configDict/getDictsByType`
      }).then((res) => {
        if (res) {
          this.resource_poolList = res
        }
        return res
      })
    },
    reloadTable (num) {
      // if (num !== 1) {
      //   // 搜索前将当前页置为1
      //   this.currentPage = 1
      // }
      this.getPageData()
    },
    getPageData () {
      this.loading = true
      var obj = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'system_name': this.system_name,
        'device_name': this.device_name,
        'warranty_date_before': this.warranty_date_before,
        'warranty_date_after': this.warranty_date_after,
        'device_serial_number': this.device_serial_number,
        'assets_number': this.assets_number,
        'resource_pool': this.resource_pool,
        'buy_mainten': this.search.buy_mainten,
        'origin_buy': this.search.origin_buy
      }
      rbmaintenanceServiceFactory.listMaintenanceByPage(obj).then((res) => {
        this.loading = false
        this.tableData = res.data
        this.total = res.count
      }).finally(() => {
        this.loading = false
      })
    },
    packData (arr) {
      // 列表数据封装
      if (arr.forEach) {
        arr.forEach((item) => {
          // item.allocate_sum = item.allocate_sum !== null ? item.allocate_sum : 0
        })
        return arr
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.reloadTable(1)
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      console.log(val)
      this.currentPage = val
      this.reloadTable(this.currentPage)
    },
    resetSearch () {
      this.system_name = ''
      this.device_name = ''
      this.warranty_date_before = ''
      this.warranty_date_after = ''
      this.device_serial_number = ''
      this.assets_number = ''
      this.resource_pool = ''
      this.search.buy_mainten = ''
      this.search.origin_buy = ''
      this.reloadTable()
    },
    resetAdvanceSearch () {
      this.search.mainten_begin_date_before = ''
      this.search.mainten_begin_date_after = ''
      this.search.mainten_end_date_before = ''
      this.search.mainten_end_date_after = ''
      this.search.device_classify = ''
      this.search.device_type = ''
      this.search.device_model = ''
      this.search.mainten_factory = ''
      this.search.buy_mainten = ''
      this.search.origin_buy = ''
      this.search.real_mainten_type = ''
      this.search.admin = ''
    },
    checkAddMaintenanceHardware () {
      var obj = {
        'mainten_factory': this.add.mainten_factory,
        'device_model': this.add.device_model,
        'warranty_date': this.add.warranty_date
      }
      rbmaintenanceServiceFactory.selectMaintenHardwareByDeviceModel(obj).then((res) => {
        if (res.mainten_factory !== null) {
          this.$message.error('相同厂商设备型号出保时间重复')
        } else {
          this.addMaintenanceHardware()
        }
      })
    },
    originBuyChange (value) {
      if (value === '是') {
        this.rules.origin_buy_explain = [{ required: true, message: '请输入原厂维保购买必要性说明', trigger: 'change' }]
      } else {
        this.rules.origin_buy_explain = [{ required: false, trigger: 'change' }]
      }
    },
    handleSelectionChange (val) {
      this.tableMultipleSelect = val
      this.maintenanceIdList = []
      val.forEach(item => {
        this.maintenanceIdList.push(item)
      })
    },
    resetUpdate () {
      this.update.id = '',
      this.update.project_instance_id = '',
      this.update.resource_pool = '',
      this.update.department1 = '',
      this.update.department2 = '',
      this.update.system_name = '',
      this.update.device_classify = '',
      this.update.device_type = '',
      this.update.device_model = '',
      this.update.device_name = '',
      this.update.ip = '',
      this.update.device_serial_number = '',
      this.update.assets_number = '',
      this.update.project_no = '',
      this.update.project_name = '',
      this.update.produce_name = '',
      this.update.produce_concat = '',
      this.update.produce_phone = '',
      this.update.warranty_date = '',
      this.update.buy_mainten = '',
      this.update.origin_buy = '',
      this.update.origin_buy_explain = '',
      this.update.admin = '',
      this.update.pre_tax = '',
      this.update.after_tax = '',
      this.update.unit_price = '',
      this.update.total_price = '',
      this.update.pay_method = '',
      this.update.discount_amount = '',
      this.update.discount_rate = ''
    },
    showUpdateCheck () {
      if (this.tableMultipleSelect.length !== 1) {
        this.$message.error('请选择一条数据进行修改')
      } else {
        this.showUpdateDialog()
      }
    },
    showUpdateDialog () {
      this.resetUpdate()

      this.ifshowUpdateDialog = true

      var str = this.maintenanceIdList[0]

      this.update.id = str.id

      this.update.project_instance_id = str.projectInstanceId
      this.update.resource_pool = str.resourcePool
      this.update.department1 = str.department1
      this.update.department2 = str.department2
      this.update.system_name = str.systemName
      this.update.device_classify = str.deviceClassify
      this.update.device_type = str.deviceType
      this.update.device_model = str.deviceModel
      this.update.device_name = str.deviceName
      this.update.ip = str.ip
      this.update.device_serial_number = str.deviceSerialNumber
      this.update.assets_number = str.assetsNumber
      this.update.project_no = str.projectNo
      this.update.project_name = str.projectName
      this.update.produce_name = str.produceName
      this.update.produce_concat = str.produceConcat
      this.update.produce_phone = str.producePhone
      this.update.warranty_date = str.warranty_date
      this.update.buy_mainten = str.buyMainten
      this.update.origin_buy = str.originBuy
      this.update.origin_buy_explain = str.originBuyExplain
      this.update.admin = str.admin
      this.update.pre_tax = str.preTax
      this.update.after_tax = str.afterTax
      this.update.unit_price = str.unitPrice
      this.update.total_price = str.totalPrice
      this.update.pay_method = str.payMethod
      this.update.discount_amount = str.discountAmount
      this.update.discount_rate = str.discountRate
    },
    updateMaintenanceValidate () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.updateMaintenanceHardware()
        } else {
          return false
        }
      })
    },
    checkUpdateMaintenanceHardware () {
      var obj = {
        'mainten_factory': this.update.mainten_factory,
        'device_model': this.update.device_model,
        'warranty_date': this.update.warranty_date
      }
      rbmaintenanceServiceFactory.selectMaintenHardwareByDeviceModel(obj).then((res) => {
        if (res.device_model !== null && this.update.id !== res.id) {
          this.$message.error('相同厂商设备型号出保时间重复')
        } else {
          this.updateMaintenanceHardware()
        }
      })
    },
    updateMaintenanceHardware () {
      var obj = {
        'id': this.update.id,
        'projectInstanceId': this.update.project_instance_id,
        'buyMainten': this.update.buy_mainten,
        'originBuy': this.update.origin_buy,
        'originBuyExplain': this.update.origin_buy_explain,
        'admin': this.update.admin,
        'preTax': this.update.pre_tax,
        'afterTax': this.update.after_tax,
        'unitPrice': this.update.unit_price,
        'totalPrice': this.update.total_price,
        'payMethod': this.update.pay_method,
        'discountAmount': this.update.discount_amount,
        'discountRate': this.update.discount_rate
      }
      rbmaintenanceServiceFactory.updateMaintenance(obj).then((res) => {
        this.ifshowUpdateDialog = false
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
      this.ifshowUpdateDialog = false
      this.$refs.updateForm.resetFields()
      this.clearUpdateDialog()

    },
    clearUpdateDialog () {
      console.log(this.update)
      this.update.buy_mainten = ''
      this.update.origin_buy = ''
      this.update.origin_buy_explain = ''
      this.update.admin = ''
    },
    showBatchUpdateCheck () {
      if (this.tableMultipleSelect.length === 0) {
        this.$message.error('请至少选择一条数据更新')
      } else {
        this.resetUpdate()
        this.ifshowBatchUpdateDialog = true
      }
    },
    batchUpdate () {

      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.batchUpdateMaintenanceHardware()
        } else {
          return false
        }
      })

    },
    batchUpdateMaintenanceHardware () {
      var str = ''
      var str2 = ''
      this.maintenanceIdList.forEach((item) => {
        if (item.id != undefined && item.id != null && item.id != '') {
          str += item.id + ','
        } else {
          str2 += item.projectInstanceId + ','
        }

      })
      str = str.slice(0, -1)
      str2 = str2.slice(0, -1)

      var obj = {
        'id': str,
        'projectInstanceId': str2,
        'buyMainten': this.update.buy_mainten,
        'originBuy': this.update.origin_buy,
        'originBuyExplain': this.update.origin_buy_explain,
        'admin': this.update.admin
      }
      rbmaintenanceServiceFactory.batchUpdateMaintenHardware(obj).then((res) => {
        if (res.success) {
          this.$message.success('批量更新成功')
          this.reloadTable()
        } else {
          this.$message.error('批量更新失败')
        }
        this.closeBatchUpdateDialog()
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
        'resource_pool': this.resource_pool,
        'buy_mainten': this.search.buy_mainten,
        'origin_buy': this.search.origin_buy,
        'type': ''
      }
      rbmaintenanceServiceFactory.downloadMaintenHardware(obj).then((res) => {
        this.loading = false
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '硬件维保信息.xlsx'
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
    getDeviceClassifyList () {
      var obj = {
        type: 'device_class'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_classifyList = res
      })
    },
    changeDeviceTypeList (name) {
      let obj01 = this.device_classifyList.find((item) => {
        return item.name === name
      })
      var obj = {
        type: 'device_type',
        pType: 'device_class',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_typeList = res
      })
    },
    getDeviceTypeList () {
      var obj = {
        type: 'device_type'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_typeList = res
      })
    },
    changeDeviceModelList (name) {
      let obj01 = this.device_typeList.find((item) => {
        return item.name === name
      })
      var obj = {
        type: 'device_model',
        pType: 'device_type',
        pid: obj01.id
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_modelList = res
      })
    },
    getDeviceModelList () {
      var obj = {
        type: 'device_model'
      }
      configDictServiceFactory.getDictsByType(obj).then((res) => {
        this.device_modelList = res
      })
    },
    getoptionsTrueFalseList () {
      var options = [{
        value: '是',
        name: '是'
      }, {
        value: '否',
        name: '否'
      }]
      this.optionsTrueFalseList = options
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
    getRealMaintenList () {
      var options = [{
        value: '原厂',
        name: '原厂'
      }, {
        value: '第三方',
        name: '第三方'
      }]
      this.real_maintenList = options
    }
  }
}
</script>

<style lang="scss" scoped>
  .hidden-column {
    display: none;
  }
</style>

