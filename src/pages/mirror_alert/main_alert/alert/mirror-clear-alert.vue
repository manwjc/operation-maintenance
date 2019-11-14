<template>
  <div class="components-container">
    <el-form class="components-condition yw-form"
             :inline="true">
      <el-form-item label="设备IP">
        <el-input v-model="device_value"></el-input>
      </el-form-item>
      <el-form-item label="设备分类">
        <el-select v-model="search.device_class"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in device_classs"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源池">
        <el-select v-model="search.resource_pool"
                   placeholder="请选择"
                   clearable
                   filterable
                   @change="changePool()"
                   @clear="cleanPool()">
          <el-option v-for="item in resourcePoors"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警级别">
        <el-select v-model="alert_level_value"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="item in alert_level"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警来源">
        <el-select class="yw-more-select"
                   v-model="search.alert_from"
                   placeholder="请选择"
                   multiple
                   collapse-tags
                   clearable
                   filterable>
          <el-option v-for="item in alert_froms"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务系统">
        <treeselect class="yw-treeselect"
                    v-model="bizSysDepChecked"
                    :multiple="true"
                    :limit="1"
                    :options="bizDepTreeSelOpts"
                    placeholder="请选择" />
      </el-form-item>

      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="search.searchDialog=true">高级检索</el-button>
        <el-button type="primary"
                   size="small"
                   @click="searchData">查询</el-button>
        <el-button size="small"
                   @click="reset">重置</el-button>
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <section class="fr">
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="fa fa-unlock-alt"
                     v-show="lockScgreen"
                     @click="lock">锁屏</el-button>
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="fa fa-lock"
                     v-show="goScgreen"
                     @click="go">刷屏</el-button>
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="el-icon-upload2"
                     @click="resourceExport"
                     :disabled="exportDisabled">导出</el-button>
          <el-button class="btn-icons-wrap"
                     type="text"
                     icon="el-icon-d-caret"
                     v-popover:popover>选择列</el-button>
          <el-popover ref="popover"
                      placement="top"
                      trigger="click">
            <div id="popover"
                 style="max-height: 300px;overflow-y: auto;">
              <el-checkbox-group v-model="test"
                                 @change="handleCheckedColumnChange">
                <div v-for="column in checkColumns">
                  <el-checkbox :label="column.keyCode">{{ column.keyName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-popover>
        </section>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  style="cursor:pointer"
                  :data="activityAlertData"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 355px)"
                  @selection-change="handleSelectionChange"
                  size="samll"
                  @row-dblclick="dblhandleCurrentChange($event)"
                  v-loading="loading">
          <el-table-column type="selection"
                           width="40px"></el-table-column>
          <el-table-column label="级别"
                           width="75px"
                           :sortable="true"
                           :sort-method="sortByAlertLevel">
            <template slot-scope="scope">
              <rb-mirror-alert-status :mode="'list'"
                                      :status="scope.row.alert_level"></rb-mirror-alert-status>
            </template>
          </el-table-column>
          <el-table-column prop="device_ip"
                           label="设备IP"
                           width="115px"
                           sortable></el-table-column>
          <el-table-column prop="idc_type"
                           label="资源池"
                           width="110px"
                           :show-overflow-tooltip="true"
                           sortable> </el-table-column>
          <el-table-column prop="pod_name"
                           label="pod池"
                           width="150px"
                           :show-overflow-tooltip="true"
                           sortable> </el-table-column>
          <el-table-column prop="biz_sys"
                           label="业务线"
                           width="85px"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="device_class"
                           label="设备分类"
                           width="100px"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="device_type"
                           label="设备类型"
                           width="100px"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="moni_index"
                           label="告警内容"
                           width="300px"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="alert_start_time"
                           label="告警开始时间"
                           width="150px"
                           sortable
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cur_moni_time"
                           label="当前告警时间"
                           width="150px"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column v-for="itemData in checkColumns"
                           :key="itemData.keyName"
                           v-if="itemData.keyIsSelected"
                           :label="itemData.keyName"
                           :prop="itemData.keyCode"
                           width="180px"
                           sortable
                           :show-overflow-tooltip="true"
                           :width="flexColumnWidth(itemData.keyCode)">
            <template slot-scope="scope">
              <el-button v-if="itemData.keyCode === 'order_id'"
                         @click="gotoBPM(scope.row.order_id)"
                         type="text"
                         size="small">{{scope.row[itemData.keyCode]}}</el-button>
              <span v-else="">{{scope.row[itemData.keyCode]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <YwPagination @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageSize"
                    :total="total"></YwPagination> -->
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

    <el-dialog class="yw-dialog"
               title="高级检索"
               :visible.sync="search.searchDialog"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="94px">
          <el-form-item label="主机名称">
            <el-input v-model="search.host_name"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="search.device_type"
                       placeholder="请选择"
                       clearable
                       filterable>
              <el-option v-for="item in device_typess"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警生效时间">
            <el-date-picker v-model="search.alert_date_from"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker> -
            <el-date-picker v-model="search.alert_date_to"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker>

          </el-form-item>
          <el-form-item label="告警分类">
            <el-select v-model="search.alert_type"
                       placeholder="请选择"
                       clearable
                       filterable>
              <el-option v-for="item in alert_types"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监控对象">
            <el-select v-model="monitor_value"
                       placeholder="请选择"
                       multiple
                       filterable
                       collapse-tags>
              <el-option v-for="item in monitor_values"
                         :key="item"
                         :label="item"
                         :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机房">
            <el-select v-model="search.device_room"
                       placeholder="请选择"
                       clearable
                       filterable>
              <el-option v-for="item in idc_locations"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警描述">
            <el-input v-model="search.alert_description"></el-input>
          </el-form-item>
          <el-form-item label="设备厂商">
            <el-select v-model="search.device_mfrs"
                       placeholder="请选择"
                       class="list-sel"
                       clearable
                       filterable>
              <el-option v-for="item in device_mfrss"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-input v-model="search.device_model"></el-input>
          </el-form-item>
          <el-form-item label="通知方式">
            <el-checkbox-group v-model="search.noticeType">
              <el-checkbox v-for="type in notice.noticeTypes"
                           :label="type.id"
                           :key="type.id">{{type.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="通知状态">
            <el-radio v-model="search.notice_status"
                      label="1">成功</el-radio>
            <el-radio v-model="search.notice_status"
                      label="0">失败</el-radio>
          </el-form-item>
          <el-form-item label="通知操作时间">
            <el-date-picker v-model="search.notice_date_from"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker> -
            <el-date-picker v-model="search.notice_date_to"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker>
          </el-form-item>

          <!--<el-form-item label="确认人员">-->
          <!--<div><el-input v-model="search.confirm_operator"></el-input></div>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="转派人员">-->
          <!--<div><el-input v-model="search.transfer_operator" style="width: 200px"></el-input></div>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="确认操作时间">-->
          <!--<el-date-picker v-model="search.confirm_date_from" type="date" placeholder="选择日期"-->
          <!--value-format="yyyy-MM-dd" size="mini"></el-date-picker>-->
          <!--<el-date-picker v-model="search.confirm_date_to" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"-->
          <!--size="mini"></el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="告警来源">
            <el-select v-model="search.alert_from"
                       placeholder="请选择"
                       class="list-sel"
                       multiple
                       collapse-tags
                       clearable
                       filterable>
              <el-option v-for="item in alert_froms"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="派单人员">
            <el-input v-model="search.work_operator"></el-input>
          </el-form-item>
          <el-form-item label="派单操作时间">
            <el-date-picker v-model="search.work_date_from"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker> -
            <el-date-picker v-model="search.work_date_to"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item label="转派操作时间">
            <el-date-picker v-model="search.transfer_date_from"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker> -
            <el-date-picker v-model="search.transfer_date_to"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker>
          </el-form-item>
          <el-form-item label="清除类型">
            <el-radio v-model="search.clean.isClean"
                      label="1">人工清除</el-radio>
            <el-radio v-model="search.clean.isClean"
                      label="2">自动解除</el-radio>
          </el-form-item>
          <el-form-item label="清除操作时间">
            <el-date-picker v-model="search.clean.clean_time_from"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker> -
            <el-date-picker v-model="search.clean.clean_time_to"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            size="mini"></el-date-picker>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="searchData">查询</el-button>
        <el-button size="small"
                   @click="cancel('search')">取消</el-button>
      </section>
    </el-dialog>

  </div>
</template>

<script>
import { alert_level, alert_type, relation, alert_from } from '../../alert_his/config/options.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
import rbMirrorAlertStatus from 'src/pages/mirror_alert/common/rb-mirror-alert-status.vue'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
import rbConfigDictServiceFactory from 'src/services/cmdb/rb-configDict-service.factory.js'
import rbAlertHomeServicesFactory from 'src/services/alert/rb-alert-home-services.factory.js'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: '/mirror_alert/alert_his/his_alert',
  components: {
    rbMirrorAlertStatus, Treeselect
  },
  props: [
    'clean'
  ],
  data () {
    return {
      bizSysTree: null,
      bizSysDepChecked: [],
      bizDepTreeSelOpts: [],
      test: [],
      checkColumns: [
        //   {
        //   'keyCode': 'device_ip',
        //   'keyName': '设备ip',
        //   'keyIsSelected': true
        // }, {'keyCode': 'idc_type',
        //   'keyName': '资源池',
        //   'keyIsSelected': true },
        { 'keyCode': 'source_room', 'keyName': '机房位置', 'keyIsSelected': true },
        { 'keyCode': 'device_mfrs', 'keyName': '设备厂商', 'keyIsSelected': false },
        { 'keyCode': 'device_model', 'keyName': '设备型号', 'keyIsSelected': false },
        //          {'keyCode': 'biz_sys', 'keyName': '业务线', 'keyIsSelected': true},
        { 'keyCode': 'moni_object', 'keyName': '监控对象', 'keyIsSelected': false },
        //   {'keyCode': 'cur_moni_value', 'keyName': '监控值', 'keyIsSelected': true},
        //   {'keyCode': 'moni_index', 'keyName': '告警内容', 'keyIsSelected': true},
        //   {'keyCode': 'alert_start_time', 'keyName': '告警开始时间', 'keyIsSelected': true},
        //   {'keyCode': 'cur_moni_time', 'keyName': '当前告警时间', 'keyIsSelected': true},
        { 'keyCode': 'object_type', 'keyName': '告警类型', 'keyIsSelected': false },
        { 'keyCode': 'alert_count', 'keyName': '告警数量', 'keyIsSelected': false },
        { 'keyCode': 'report_type', 'keyName': '通知方式', 'keyIsSelected': false },
        { 'keyCode': 'report_status', 'keyName': '通知状态', 'keyIsSelected': false },
        { 'keyCode': 'report_time', 'keyName': '通知时间', 'keyIsSelected': false },
        { 'keyCode': 'trans_status', 'keyName': '转派状态', 'keyIsSelected': false },
        { 'keyCode': 'trans_user', 'keyName': '转派人', 'keyIsSelected': false },
        { 'keyCode': 'trans_time', 'keyName': '转派时间', 'keyIsSelected': false },
        { 'keyCode': 'to_confirm_user', 'keyName': '待确认人', 'keyIsSelected': false },
        { 'keyCode': 'order_type', 'keyName': '派单类型', 'keyIsSelected': false },
        { 'keyCode': 'order_status', 'keyName': '派单状态', 'keyIsSelected': false },
        { 'keyCode': 'order_id', 'keyName': '工单号', 'keyIsSelected': false },
        { 'keyCode': 'deliver_time', 'keyName': '派单时间', 'keyIsSelected': false },
        { 'keyCode': 'confirmed_user', 'keyName': '确认人', 'keyIsSelected': false },
        { 'keyCode': 'confirmed_time', 'keyName': '确认时间', 'keyIsSelected': false },
        { 'keyCode': 'confirmed_content', 'keyName': '确认内容', 'keyIsSelected': false },
        { 'keyCode': 'clear_user', 'keyName': '清除人', 'keyIsSelected': false },
        //          {'keyCode': 'clear_time', 'keyName': '清除时间', 'keyIsSelected': false},
        { 'keyCode': 'clear_content', 'keyName': '清除描述', 'keyIsSelected': false }
      ],
      columnFilter: {
        // 'device_ip': false,
        // 'idc_type': false,
        'source_room': false,
        'device_mfrs': false,
        'device_model': false,
        'biz_sys': false,
        'moni_object': false,
        // 'cur_moni_value': false,
        // 'moni_index': false,
        // 'alert_start_time': false,
        // 'cur_moni_time': false,
        'object_type': false,
        'alert_count': false,
        'report_type': false,
        'report_status': false,
        'report_time': false,
        'trans_status': false,
        'trans_user': false,
        'trans_time': false,
        'to_confirm_user': false,
        'order_type': false,
        'order_status': false,
        'order_id': false,
        'deliver_time': false,
        'confirmed_user': false,
        'confirmed_time': false,
        'confirmed_content': false,
        'clear_user': false,
        //          'clear_time': false,
        'clear_content': false
      },
      classA: 'classA',
      classB: 'classB',
      alertList: [],
      // 选择列存放的值
      filterForm: {},
      columnInfo: '',
      checkedcolumns: [],
      moduleId: '12345678XYUEFKSLDDLDAL',
      column_data: {},
      columnList: [],
      detailObjId: '',
      detailOrderStatus: '',
      //
      alertObj: {},
      alertObjFlag: false,
      lockScgreen: true,
      goScgreen: false,
      multipleSelection: [], // 多选框模板存放的值
      activityAlertData: [], // 活动告警数据数组
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      alert_level: [], // 告警级别
      device_value: '', // 设备ip
      monitor_value: [], // 监控项
      monitor_values: [], // 监控项
      alert_level_value: '5', // 告警级别
      relation: [],
      alert_type: '',
      alert_types: [],
      // 业务系统
      bizSysList: [],
      // 资源池
      resourcePoors: [],
      // 机房
      idc_locations: [],
      // 设备类型
      device_typess: [],
      device_classs: [],
      alert_froms: [],
      device_mfrss: [],
      // 告警通知
      notice: {
        noticeTypes: [{
          id: '0',
          name: '短信'
        }, {
          id: '1',
          name: '邮件'
        }]
      },
      // 告警派单
      work: {
        workDialog: false,
        work_type: ''
      },
      // 高级检索
      search: {
        searchDialog: false,
        operate_status: '',
        alert_date_from: '', // 告警开始时间
        alert_date_to: '', // 告警结束时间
        alert_type: '', // 告警分类
        device_type: '', // 设备类型
        host_name: '',
        device_class: '', // 设备类型
        system: '', // 业务系统
        alert_description: '', // 告警描述
        resource_pool: '', // 资源池
        device_room: '', // 机房
        notice_date_from: '', // 通知开始时间
        notice_date_to: '', // 通知结束时间
        noticeType: [], // 通知方式
        notice_status: '', // 通知状态
        confirm_date_from: '', // 确认开始时间
        confirm_date_to: '', // 确认结束时间
        transfer_operator: '', // 转派操作人
        confirm_operator: '', // 待确认人
        work_operator: '', // 派单人员
        work_date_from: '', // 派单开始时间
        work_date_to: '', // 派单结束时间
        transfer_date_from: '', // 派单开始时间
        transfer_date_to: '', // 派单结束时间
        alert_from: [],
        device_mfrs: '', //设备厂商
        device_model: '', //设备型号
        // 是否清除
        clean: {
          isClean: '',
          clean_time_from: '',
          clean_time_to: ''
        },
        // 是否清除
        filter: {
          isFilter: '',
          filter_time_from: '',
          filter_time_to: ''
        },
        // 是否清除
        project: {
          isProject: '',
          project_time_from: '',
          project_time_to: ''
        },
        // 是否维护
        pattern: {
          isPattern: '',
          pattern_time_from: '',
          pattern_time_to: ''
        }
      },
      dicts: {},
      timer_frequency: 60000,
      loading: true,
      exportDisabled: false
    }
  },
  mounted () {
    this.getColumnFilter()
    this.startInit()
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    getBizSysTreeData () {
      let _this = this
      rbAlertKanBanServiceFactory.bizSysTreeOptions().then(res => {
        if (!_this.bizSysTree) {
          _this.bizSysTree = res
        }
        _this.bizDepTreeSelOpts = res
      })
    },
    getTimerFrequency () {
      let obj = {
        'type': 'timer_frequency'
      }
      rbConfigDictServiceFactory.getDictsByType(obj).then((res) => {
        if (res) {
          this.timer_frequency = res[0].value
        }
      })
    },
    startInit () {
      this.initDate()
      this.alert_level = alert_level
      this.alert_types = alert_type
      this.relation = relation
      this.getTableData(this.packInit())
      this.getTimerFrequency()
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.getTableData(this.packInit())
          this.getTimerFrequency()
        }, this.timer_frequency)
      }
      this.getMonitorValue()
      this.getDict()
      this.getBizSysList()
      this.getBizSysTreeData()
    },
    // 锁屏
    lock () {
      clearInterval(this.timer)
      this.timer = null
      this.goScgreen = true
      this.lockScgreen = false
    },
    // 刷屏
    go () {
      if (this.timer) {
        clearInterval(this.timer)
      } else {
        this.timer = setInterval(() => {
          this.getTableData(this.packInit())
        }, this.timer_frequency)
      }
      this.goScgreen = false
      this.lockScgreen = true
    },
    // 获取业务系统
    getBizSysList () {
      let obj = {
        'type': 'bizSystem',
        'pid': '',
        'pValue': '',
        'pType': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.bizSysList = res
        }
      })
    },
    changePool () {
      //        this.bizSysList = []
      //        let obj = {
      //          'type': 'bizSystem',
      //          'pid': '',
      //          'pValue': this.search.resource_pool ? this.search.resource_pool : '',
      //          'pType': 'idcType'
      //        }
      //        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
      //          if (res) {
      //            this.bizSysList = res
      //          }
      //        })
      let _this = this
      _this.bizDepTreeSelOpts = []
      rbAlertKanBanServiceFactory.bizSysTreeOptionByResourcePollSel(this.search.resource_pool || '').then(function (poolDeps) {
        let sysDepts = (
          _this.bizSysTree &&
          _this.bizSysTree.length > 0 &&
          _this.bizSysTree[0].children &&
          _this.bizSysTree[0].children.length > 0
        ) ? _this.bizSysTree[0].children : []
        _.forEach(poolDeps, poolDep => {
          if (poolDep) {
            _(sysDepts).filter(sysdep => {
              return poolDep === sysdep.id
            }).forEach(subdep => {
              _this.bizDepTreeSelOpts.push(subdep)
            })
          }
        })
      })
    },
    cleanPool () {
      this.bizSysList = []
      this.search.system = ''
      this.getBizSysList()
    },
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.searchData()
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.searchData()
    },
    // 封装请求数据的对象
    packInit () {
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
      let obj = {
        'queryType': '3',
        'order': 'DESC',
        'page_no': this.currentPage,
        'page_size': this.pageSize,
        'sort_name': '',
        // 普通检索
        'deviceIp': this.device_value ? this.device_value : '',
        'monitItems': this.monitor_value ? this.monitor_value.toString() : '',
        'alertLevel': this.alert_level_value ? this.alert_level_value : '',
        // 高级检索
        'alertCreateTimeRangeStart': this.search.alert_date_from ? this.search.alert_date_from : '',
        'alertCreateTimeRangeEnd': this.search.alert_date_to ? this.search.alert_date_to : '',
        'objectType': this.search.alert_type ? this.search.alert_type : '',
        'deviceType': this.search.device_type ? this.search.device_type : '',
        'hostName': this.search.host_name ? this.search.host_name : '',
        'deviceClass': this.search.device_class ? this.search.device_class : '',
        //          'bizSys': this.search.system ? this.search.system.toString() : '',
        'bizSys': (this.bizSysDepChecked && this.bizSysDepChecked.length > 0) ? getBizSysByChecked(this.bizSysDepChecked) : '',
        'monitDesc': this.search.alert_description ? this.search.alert_description : '',
        'idcType': this.search.resource_pool ? this.search.resource_pool : '',
        'sourceRoom': this.search.device_room ? this.search.device_room : '',
        'deviceMfrs': this.search.device_mfrs ? this.search.device_mfrs : '',
        'deviceModel': this.search.device_model ? this.search.device_model : '',
        'notifyType': this.search.noticeType ? this.search.noticeType.toString() : '',
        'notifyStatus': this.search.notice_status ? this.search.notice_status : '',
        'notifyTimeRangeStart': this.search.notice_date_from ? this.search.notice_date_from : '',
        'notifyTimeRangeEnd': this.search.notice_date_to ? this.search.notice_date_to : '',
        'confirmTimeRangeStart': this.search.confirm_date_from ? this.search.confirm_date_from : '',
        'confirmTimeRangeEnd': this.search.confirm_date_to ? this.search.confirm_date_to : '',
        'transferTimeRangeStart': this.search.transfer_date_from ? this.search.transfer_date_from : '',
        'transferTimeRangeEnd': this.search.transfer_date_to ? this.search.transfer_date_to : '',
        'deliverTimeRangeStart': this.search.work_date_from ? this.search.work_date_from : '',
        'deliverTimeRangeEnd': this.search.work_date_to ? this.search.work_date_to : '',
        'transferStaff': this.search.transfer_operator ? this.search.transfer_operator : '',
        'toConfirmStaff': this.search.confirm_operator ? this.search.confirm_operator : '',
        'deliver': this.search.work_operator ? this.search.work_operator : '',
        'isClear': this.search.clean.isClean ? this.search.clean.isClean : '',
        'clearTimeRangeStart': this.search.clean.clean_time_from ? this.search.clean.clean_time_from : '',
        'clearTimeRangeEnd': this.search.clean.clean_time_to ? this.search.clean.clean_time_to : '',
        'isFiltered': this.search.filter.isFilter ? this.search.filter.isFilter : '',
        'filterTimeRangeStart': this.search.filter.filter_time_from ? this.search.filter.filter_time_from : '',
        'filterTimeRangeEnd': this.search.filter.filter_time_to ? this.search.filter.filter_time_to : '',
        'isProject': this.search.project.isProject ? this.search.project.isProject : '',
        'projectTimeRangeStart': this.search.project.project_time_from ? this.search.project.project_time_from : '',
        'projectTimeRangeEnd': this.search.project.project_time_to ? this.search.project.project_time_to : '',
        'isMaintain': this.search.pattern.isPattern ? this.search.pattern.isPattern : '',
        'maintainTimeRangeStart': this.search.pattern.pattern_time_from ? this.search.pattern.pattern_time_from : '',
        'maintainTimeRangeEnd': this.search.pattern.pattern_time_to ? this.search.pattern.pattern_time_to : '',
        'source': this.search.alert_from ? this.search.alert_from.toString() : ''
      }
      return obj
    },
    // 获取列表数据相关方法
    getTableData (obj) {
      rbAlertHomeServicesFactory.getHomeAlertHisList(obj).then((res) => {
        this.activityAlertData = this.packData(res.result)
        this.total = res.count
      }).finally(() => {
        this.loading = false
      })
    },
    // 封装得到的数据
    packData (arr) {
      // 列表数据封装
      if (arr.forEach) {
        arr.forEach((item) => {
          //            item.order_type = item.order_status === '1' ? '' : '告警工单'
          item.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', item.order_status)
          item.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', item.object_type)
          item.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', item.report_status)
          item.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', item.trans_status)
          item.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', item.order_type)
          item.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', item.report_type)
          item.cur_moni_time = formatDate(item.cur_moni_time)
          item.alert_start_time = formatDate(item.alert_start_time)
          item.alert_end_time = formatDate(item.alert_end_time)
          item.deliver_time = formatDate(item.deliver_time)
          item.clear_time = formatDate(item.clear_time)
          item.confirmed_time = formatDate(item.confirmed_time)
          item.report_time = formatDate(item.report_time)
          item.trans_time = formatDate(item.trans_time)
        })
        return arr
      } else {
        // 详情数据封装
        //          arr.order_type = arr.order_status === '1' ? '' : '告警工单'
        arr.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', arr.order_status)
        arr.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', arr.object_type)
        arr.report_status = rbMirrorCommonService.common('REPORTSTATUS', '1', arr.report_status)
        arr.trans_status = rbMirrorCommonService.common('TRANSSTATUS', '1', arr.trans_status)
        arr.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', arr.order_type)
        arr.report_type = rbMirrorCommonService.common('REPORTTYPE', '1', arr.report_type)
        arr.cur_moni_time = formatDate(arr.cur_moni_time)
        arr.alert_start_time = formatDate(arr.alert_start_time)
        arr.deliver_time = formatDate(arr.deliver_time)
        arr.clear_time = formatDate(arr.clear_time)
        arr.confirmed_time = formatDate(arr.confirmed_time)
        arr.report_time = formatDate(arr.report_time)
        arr.trans_time = formatDate(arr.trans_time)
        return arr
      }
    },
    searchData () {
      if (!this.search.alert_date_from || !this.search.alert_date_to) {
        this.$alert('请先选择告警生效时间!', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.getTableData(this.packInit())
      if (this.search.searchDialog === true) {
        this.search.searchDialog = false
      }
    },
    cancel (obj) {
      if (obj === 'work') {
        this.work.workDialog = false
        this.work.work_type = ''
      } else if (obj === 'search') {
        this.cancelSearch()
      } else if (obj === 'searchHead') {
        this.device_value = ''
        this.search.device_class = ''
        this.alert_level_value = ''
        this.search.system = ''
        this.search.resource_pool = ''
        this.cancelSearch()
        //          this.searchData()
      }
    },
    cancelSearch () {
      this.search.searchDialog = false
      this.search.alert_date_from = ''
      this.search.alert_date_to = ''
      this.search.alert_type = ''
      this.monitor_value = ''
      this.search.alert_description = ''
      this.search.device_room = ''
      this.search.device_type = ''
      this.search.host_name = ''
      this.search.noticeType = []
      this.search.notice_status = ''
      this.search.notice_date_from = ''
      this.search.notice_date_to = ''
      this.search.transfer_operator = ''
      this.search.confirm_operator = ''
      this.search.confirm_date_from = ''
      this.search.confirm_date_to = ''
      this.search.work_operator = ''
      this.search.work_types = ''
      this.search.work_date_from = ''
      this.search.work_date_to = ''
      this.search.transfer_date_from = ''
      this.search.transfer_date_to = ''
      this.search.clean.isClean = ''
      this.search.clean.clean_date_from = ''
      this.search.clean.clean_date_to = ''
      this.search.filter.isFilter = ''
      this.search.filter.filter_date_from = ''
      this.search.filter.filter_date_to = ''
      this.search.project.isProject = ''
      this.search.project.project_date_from = ''
      this.search.project.project_date_to = ''
      this.search.pattern.isPattern = ''
      this.search.pattern.pattern_date_from = ''
      this.search.pattern.pattern_date_to = ''
      this.search.alert_from = []
      this.bizSysDepChecked = []
      this.bizDepTreeSelOpts = this.bizSysTree
    },
    // 开始派单
    startWork () {
      if (this.multipleSelection.length < 1) {
        this.$alert('请选择告警进行派单', '警告', {
          confirmButtonText: '确定'
        })
      } else {
        this.work.workDialog = true
      }
    },
    toWork (obj) {
      this.alertObjFlag = true
      this.alertObj = obj
      this.work.workDialog = true
    },
    submitWork () {
      let bool = true
      if (this.alertObjFlag === true) {
        this.multipleSelection.push(this.alertObj)
      }
      this.multipleSelection.forEach((item) => {
        if (item.order_status !== '未派单') {
          bool = false
        }
      })
      if (bool) {
        const namespace = sessionStorage.getItem('namespace')
        let str = ''
        this.multipleSelection.forEach((item) => {
          str += item.alert_id + ','
        })
        str = str.slice(0, -1)
        let obj = {
          'namespace': namespace,
          'alert_ids': str
        }
        rbAlertKanBanServiceFactory.alertHandle(obj).then(() => {
          this.$message({
            message: '派单成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message.error('派单失败')
        })
        this.getTableData(this.packInit())
      } else {
        this.$alert('只有未派单的告警才能派单', '警告', {
          confirmButtonText: '确定'
        })
      }
      this.alertObj = {}
      this.alertObjFlag = false
      this.multipleSelection = []
      this.work.workDialog = false
    },
    // 获取资源池
    getResourcePoor (type) {
      // if (this.dicts) {
      //  rbCmdbServiceFactory.getDictValue({
      //    formId: this.dicts[type]
      //  }).then((data) => {
      //    data.formOptions.forEach(item => {
      //      let obj = {
      //        'name': item.name,
      //        'id': item.value
      //      }
      //      this.resourcePoors.push(obj)
      //    })
      //  })
      // }
      let obj = {
        'type': 'idcType',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.resourcePoors = res
        }
      })
    },
    // 获取机房
    getIdcLocation (type) {
      /* if (this.dicts) {
        rbCmdbServiceFactory.getDictValue({
          formId: this.dicts[type]
        }).then((data) => {
          data.formOptions.forEach(item => {
            let obj = {
              'name': item.name,
              'id': item.value
            }
            this.idc_locations.push(obj)
          })
        })
      } */
      let obj = {
        'type': 'roomId',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          let value = []
          res.forEach((item) => {
            if (value.indexOf(item.value) === -1) {
              value.push(item.value)
              this.idc_locations.push(item)
            }
          })
        }
      })
    },
    // 获取设备厂商
    getDeviceMfrss () {
      let obj = {
        'type': 'device_mfrs',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.device_mfrss = res
        }
      })
    },
    // 获取设备类型
    getDeviceType (type) {
      let obj = {
        'type': type,
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.device_classs = res
        }
      })
    },
    // 获取设备类型
    getDeviceTypess () {
      let obj = {
        'type': 'device_type',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.device_typess = res
        }
      })
    },
    getDict () {
      this.getResourcePoor('idcType')
      this.getIdcLocation('roomId')
      this.getDeviceType('device_class')
      this.getDeviceMfrss()
      this.getDeviceTypess()
      this.getAlertFrom()
    },
    // 导出
    resourceExport () {
      this.loading = true
      this.exportDisabled = true
      rbAlertHomeServicesFactory.ExportHomeAlertHisData(this.packInit()).then((res) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        let objectUrl = URL.createObjectURL(blob)
        // window.location.href = objectUrl
        let downLoadElement = document.createElement('a')
        downLoadElement.href = objectUrl
        downLoadElement.download = '(工作台)解除告警数据列表.xlsx'
        document.body.appendChild(downLoadElement)
        downLoadElement.click()
        document.body.removeChild(downLoadElement)
        URL.revokeObjectURL(objectUrl)
      }).finally(() => {
        this.loading = false
        this.exportDisabled = false
      })
    },
    // 1.获取选择列表的初始值
    getColumnFilter () {
      rbCmdbServiceFactory.getColumnFilter({ menuType: 'alert', moduleId: this.moduleId }).then((data) => {
        this.filterForm = data
        if (data.columnInfo === null) {
          this.checkColumns.forEach(item => {
            this.columnFilter[item.keyCode] = false
          })
        } else {
          this.columnFilter = JSON.parse(data.columnInfo)
        }
        this.queryFields = []
        this.test = []
        this.checkColumns.forEach(item => {
          if (this.columnFilter[item.keyCode]) {
            item.keyIsSelected = true
            this.test.push(item.keyCode)
            this.queryFields.push(item)
          } else {
            item.keyIsSelected = false
          }
        })
        //          this.getTableData(this.packInit())
      })
    },
    // 2.更新选择的变化
    handleCheckedColumnChange (val) {
      this.checkColumns.forEach(item => {
        this.columnFilter[item.keyCode] = false
      })
      val.forEach(item => {
        this.columnFilter[item] = true
      })
      let data = this.filterForm
      data.columnInfo = JSON.stringify(this.columnFilter)
      data.columnMap = this.columnFilter
      rbCmdbServiceFactory.updateColumnFilter(data).then((data) => {
        this.getColumnFilter()
        this.getTableData(this.packInit())
      })
    },
    // 自定义表头列宽
    flexColumnWidth (str) {
      let flexWidth = 120
      if (str === 'moni_index') {
        flexWidth += 130
      } else if (str === 'alert_start_time') {
        flexWidth += 35
      } else if (str === 'alert_end_time') {
        flexWidth += 35
      }
      return flexWidth + 'px'
    },
    getMonitorValue () {
      rbAlertServicesFactory.getHisMonitorValue().then((res) => {
        for (let i = 0; i < res.length; i++) {
          this.monitor_values.push(res[i])
        }
      })
    },
    sortByAlertLevel (obj1, obj2) {
      let val1 = obj1.alert_level
      let val2 = obj2.alert_level
      return val1 - val2
    },
    dblhandleCurrentChange (column) {
      this.$router.push({
        path: '/mirror_alert/alert_his/his_detail',
        query: {
          alertId: column.alert_id,
          detailType: 'alertHis'
        }
      })
    },
    // 重置
    reset () {
      this.device_device = ''
      this.alert_level_value = ''
      this.search.device_class = ''
      this.search.system = ''
      this.search.resource_pool = ''
      this.search.alert_from = []
      this.cancelSearch()
    },
    // 获取告警来源
    getAlertFrom () {
      let obj = {
        'type': 'alert_from',
        'pid': ''
      }
      rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
        if (res) {
          this.alert_froms = res
        }
      })
    },
    initDate () {
      let now = new Date()
      let before = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
      this.search.alert_date_from = formatDate(before)
      this.search.alert_date_to = formatDate(now)
    },
  },
  watch: {
    clean: {
      handler: function () {
        if (!this.clean) {
          clearInterval(this.timer)
          this.timer = null
        }
      },
      immediate: true
    }
  }
}
</script>
`
<style lang="scss" scoped>
</style>

