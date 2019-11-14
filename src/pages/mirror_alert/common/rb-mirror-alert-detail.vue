<template>
  <div class="components-container yw-dashboard">
    <el-collapse class="yw-dashboard-section"
                 v-model="activeCollapseNames">
      <el-collapse-item name="1">
        <template slot="title">
          详情
        </template>
        <section class="operator-wrap">
          <el-button icon="fa fa-location-arrow"
                     @click="work.workDialog=true"
                     v-if="detailType === 'alert'"
                     :disabled="is_work">派单</el-button>
          <el-button icon="el-icon-delete"
                     v-if="detailType === 'alert'"
                     @click="clean.cleanDialog=true">清除</el-button>
          <el-button icon="el-icon-refresh"
                     @click="refresh()">刷新</el-button>
        </section>
        <el-form class="yw-form form-details"
                 :inline="true" >
          <el-form-item label="告警级别">
            <rb-mirror-alert-status :mode="'detail'"
                                    :status="obj.alert_level"></rb-mirror-alert-status>
          </el-form-item>
          <el-form-item label="告警时间">
            {{obj.alert_start_time}}
          </el-form-item>
          <el-form-item label="告警来源">
            {{obj.source}}
          </el-form-item>
          <el-form-item label="告警类型">
            {{obj.object_type}}
          </el-form-item>
          <br />
          <el-form-item label="资源池">
            {{obj.idc_type_name}}
          </el-form-item>
          <el-form-item label="工程期数">
            {{obj.project_name}}
          </el-form-item>
          <el-form-item label="pod池">
            {{obj.pod_name}}
          </el-form-item>
          <el-form-item label="机房">
            {{obj.source_room}}
          </el-form-item>
          <br />
          <el-form-item label="机柜">
            {{obj.idc_cabinet}}
          </el-form-item>
          <el-form-item label="U位">
            {{instanceDetail.u_num}}
          </el-form-item>
          <el-form-item label="业务系统">
            {{obj.biz_sys}}
          </el-form-item>
          <br />
          <el-form-item label="设备分类">
            {{obj.device_class}}
          </el-form-item>
          <el-form-item label="设备类型">
            {{obj.device_type}}
          </el-form-item>
          <el-form-item label="设备名称">
            <div>
              <span>{{obj.host_name}}</span>
              <span v-if="isDeviceDetailShow"><a style="text-decoration: none;cursor:pointer" @click="toDeviceDetail()">设备详情</a></span>
            </div>
          </el-form-item>
          <el-form-item label="设备描述">
            {{obj.device_description}}
          </el-form-item>
          <br/>
          <el-form-item label="告警IP">
            {{obj.device_ip}}
          </el-form-item>
          <el-form-item label="业务IP">
          </el-form-item>
          <el-form-item label="管理IP">
            {{obj.device_ip}}
          </el-form-item>
          <el-form-item label="IPMI IP">
            {{instanceDetail.ipmi_ip}}
          </el-form-item>
          <br/>
          <el-form-item label="告警内容">
            {{obj.moni_index}}
          </el-form-item>
          <el-form-item label="处理意见">
            {{obj.remark}}<a style="padding-left: 10px"
                             @click="change.remarkChangeDialog=true">[修改]</a>
          </el-form-item>
          <el-form-item label="清除时间">
            {{obj.clear_time | formatDate}}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          记录
        </template>

        <el-tabs class="yw-tabs"
                 v-model="activeName"
                 @tab-click="handleClick">
          <el-tab-pane label="告警上报记录"
                       name="first">
            <rb-mirror-alert-gen-table v-if="tableList.first.flag"
                                       ref="rbMirrorAlertGenTable"
                                       :obj="obj"
                                       :type="detailType"></rb-mirror-alert-gen-table>
          </el-tab-pane>
          <el-tab-pane label="告警操作记录"
                       name="second">
            <rb-mirror-alert-record-table v-if="tableList.second.flag"
                                          ref="rbMirrorAlertRecordTable"
                                          :obj="obj"></rb-mirror-alert-record-table>
          </el-tab-pane>
          <el-tab-pane label="告警通知记录"
                       name="third">
            <rb-mirror-alert-notify-table
                                          v-if="tableList.third.flag"
                                          ref="rbMirrorAlertNotifyTable"
                                          :obj="obj"></rb-mirror-alert-notify-table>
          </el-tab-pane>
          <el-tab-pane label="历史告警记录"
                        name="four"
                       v-if="detailType === 'alert'">
            <rb-mirror-alert-his-table
                        v-if="tableList.four.flag"
                        ref="rbMirrorAlertHisTable"
                        :obj="obj" ></rb-mirror-alert-his-table>
          </el-tab-pane>
          <el-tab-pane label="监控信息"
                       name="five"
                       v-if="obj.source === 'ZABBIX'">
            <rb-mirror-alert-trigger-table
                        v-if="tableList.five.flag"
                        ref="rbMirrorAlertTriggerTable"
                        :obj="obj"></rb-mirror-alert-trigger-table>
          </el-tab-pane>
          <el-tab-pane label="衍生告警"
                       name="six"
                       v-if="obj.source === '衍生告警'">
            <rb-mirror-alert-derive-table
              v-if="obj.source === '衍生告警' && tableList.six.flag"
              ref="rbMirrorAlertDeriveTable"
              :alertId="obj.alert_id"></rb-mirror-alert-derive-table>
          </el-tab-pane>
          <el-tab-pane label="sysLog"
                       name="seven"
                       v-if="obj.device_class === '网络设备'">
            <rb-mirror-sys-log-table v-if="obj.device_class === '网络设备' && tableList.seven.flag"
                                     :obj="obj"></rb-mirror-sys-log-table>
          </el-tab-pane>
          <el-tab-pane label="关联关系"
                       name="eight"
                       v-if="obj.object_type === '设备'">
            <portRelation v-if="tableList.eight.flag" :deviceId="obj.device_id"></portRelation>
          </el-tab-pane>
          <el-tab-pane label="设备配置及维保信息"
                       name="nine"
                       v-if="obj.object_type === '设备'">
            <rb-mirror-alert-device v-if="tableList.nine.flag"
                                    :instanceDetail="instanceDetail"></rb-mirror-alert-device>
          </el-tab-pane>
          <el-tab-pane label="次要告警"
                       name="ten"
                       v-if="obj.event_id && obj.event_id.indexOf('primary_') === 0">
            <rb-mirror-alert-secondary-table
              v-if="tableList.ten.flag"
              ref="rbMirrorAlertSecondaryTable"
              :alertId="obj.alert_id"></rb-mirror-alert-secondary-table>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               title="派单"
               :visible.sync="work.workDialog"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="82px">
          <el-form-item label="告警派单">
            <el-radio-group v-model="orderType">
              <el-radio :label="1">告警工单</el-radio>
              <el-radio :label="2">故障工单</el-radio>
              <el-radio :label="3">维保工单</el-radio>
              <el-radio :label="4">调优工单</el-radio>
            </el-radio-group>
            <!-- <i class="el-icon-info"></i>告警数据派单到对应工单，进行工单处理 -->
          </el-form-item>
          <el-form-item label="派单操作">
            直接后台派单(支持批量)
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submitWork()">确定</el-button>
        <el-button @click="cancel('work')">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog class="yw-dialog"
               title="清除"
               :visible.sync="clean.cleanDialog"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 :model="clean"
                 :rules="cleanRules"
                 ref="formClean"
                 label-width="82px">
          <el-form-item label="告警清除">
            <i class="el-icon-info"></i>告警数据将移至历史告警看板
          </el-form-item>
          <el-form-item label="确认清除">
            直接清除该告警
          </el-form-item>
          <el-form-item label="清除原因" prop="cleanDialogTextArea">
            <el-input type="textarea"
                      :rows="5"
                      v-model="clean.cleanDialogTextArea"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submitClean()">确定</el-button>
        <el-button @click="cancel('clean')">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog class="yw-dialog"
               title="修改"
               :visible.sync="change.remarkChangeDialog"
               width="500px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="82px">
          <el-form-item label="修改内容">
            <el-input type="textarea"
                      :rows="5"
                      v-model="change.remarkChangeContent"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submitChange()">确定</el-button>
        <el-button @click="cancel('change')">取消</el-button>
      </section>
    </el-dialog>
    <!--<el-dialog class="yw-dialog"-->
               <!--:visible.sync="monit.dialog"-->
               <!--width="800px"-->
               <!--title="监控信息"-->
               <!--:show-close="true"-->
               <!--:close-on-click-modal="false"-->
               <!--:close-on-press-escape="false">-->
      <!--<rb-mirror-alert-trigger-table ref="rbMirrorAlertTriggerTable"-->
                                     <!--:obj="obj"-->
                                     <!--:type="'alert'" />-->
    <!--</el-dialog>-->
    <!-- dialog -->
  </div>
</template>

<script>
import { alert_notice_types } from 'src/pages/mirror_alert/alert/config/options.js'
import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
import rbMirrorCommonService from 'src/services/mirror/rb-mirror-common-services.factory.js'
import rbMirrorAlertStatus from 'src/pages/mirror_alert/common/rb-mirror-alert-status.vue'
import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
import rbMirrorAlertNotifyTable from 'src/pages/mirror_alert/common/rb-mirror-alert-notify-table.vue'
import rbMirrorAlertGenTable from 'src/pages/mirror_alert/common/rb-mirror-alert-gen-table.vue'
import rbMirrorAlertRecordTable from 'src/pages/mirror_alert/common/rb-mirror-alert-record-table.vue'
import rbMirrorAlertTriggerTable from 'src/pages/mirror_alert/common/rb-mirror-alert-trigger-table.vue'
import ElDialog from '../../../../node_modules/element-ui/packages/dialog/src/component.vue'
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
import rbMirrorAlertHisTable from 'src/pages/mirror_alert/common/rb-mirror-alert-his-table.vue'
import rbMirrorAlertDeriveTable from 'src/pages/mirror_alert/common/rb-mirror-alert-derive-table.vue'
import rbMirrorSysLogTable from 'src/pages/mirror_alert/common/rb-mirror-sys-log-table.vue'
import portRelation from 'src/pages/resource/iframe/detail/portRelation.vue'
import rbMirrorAlertDevice from 'src/pages/mirror_alert/common/rb-mirror-alert-device.vue'
import rbMirrorAlertSecondaryTable from 'src/pages/mirror_alert/common/rb-mirror-alert-secondary-table'
import { formatDate } from 'src/assets/js/utility/rb-filters.js'
export default {
  components: {
    ElDialog,
    rbMirrorAlertStatus,
    rbMirrorAlertNotifyTable,
    rbMirrorAlertGenTable,
    rbMirrorAlertRecordTable,
    rbMirrorAlertTriggerTable,
    rbMirrorAlertHisTable,
    rbMirrorAlertDeriveTable,
    rbMirrorSysLogTable,
    portRelation,
    rbMirrorAlertDevice,
    rbMirrorAlertSecondaryTable
  },
  props: [
    'detailType','alertId'
  ],
  data () {
    return {
      activeCollapseNames: ['1', '2'],
      obj: {},
      note_total_count: 0,
      is_work: true,
      is_clean: false,
      activeName: 'first',
      module: '',
      alert_notice_type: '全部',
      alert_notice_types: [],
      alert_gen_list: [],
      alert_record_list: [],
      alert_notify_list: [],
      alert_notify_list_remaek: [],
      // 告警派单
      work: {
        workDialog: false,
        work_type: ''
      },
      // 告警清除
      clean: {
        cleanDialog: false,
        cleanDialogTextArea: ''
      },
      cleanRules: {
        cleanDialogTextArea: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      change: {
        remarkChangeDialog: false,
        remarkChangeContent: ''
      },
      monit: {
        dialog: false,
        device_ip: '', // 设备IP
        agent_ip: '', // 归属代理IP
        monit_obj: '', // 监控对象
        metric_name: '', // 监控指标名称
        metric_key: '', // 监控指标key
        monit_period: '', // 监控周期
        triggers: [], // 触发器信息
        metrics: [] // 监控项数据
      },
      isDeviceDetailShow: true,
      orderType: 1,
      instanceDetail: {},
      tableList: {
        first: {
          flag: true,
        },
        second: {
          flag: false,
        },
        third: {
          flag: false,
        },
        four: {
          flag: false,
        },
        five: {
          flag: false,
        },
        six: {
          flag: false,
        },
        seven: {
          flag: false,
        },
        eight: {
          flag: false,
        },
        nine: {
          flag: false,
        },
        ten: {
          flag: false,
        },
      },
    }
  },
  mounted () {
    this.alert_notice_types = alert_notice_types
//    this.alertDetailInit()
  },
  methods: {
    handleClick (tab) {
      this.tableList[tab.name].flag = true
      Object.keys(this.tableList).forEach((item) => {
        if (item !== tab.name) {
          this.tableList[item].flag = false
        }
      })
    },
    refresh () {
      this.refreshGen()
    },
    refreshGen () {
      this.tableList.first.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.first.flag = true // 重建组件
      })
      this.tableList.second.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.second.flag = true // 重建组件
      })
      this.tableList.third.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.third.flag = true // 重建组件
      })
      this.tableList.four.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.four.flag = true // 重建组件
      })
      this.tableList.five.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.five.flag = true // 重建组件
      })
      this.tableList.six.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.six.flag = true // 重建组件
      })
      this.tableList.seven.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.seven.flag = true // 重建组件
      })
      this.tableList.eight.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.eight.flag = true // 重建组件
      })
      this.tableList.nine.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.nine.flag = true // 重建组件
      })
      this.tableList.ten.flag = false // 销毁组件
      this.$nextTick(() => {
        this.tableList.ten.flag = true // 重建组件
      })
    },
    alertDetailInit () {
      if (this.detailType === 'alert') {
        this.getAlertDetail(this.alertId)
      } else if (this.detailType === 'alertHis') {
        this.getAlertHisDetail(this.alertId)
      }
    },
    getAlertDetail (id) {
      rbAlertServiceFactory.getAlertDetail(id).then((res) => {
        this.note_total_count = parseInt(res['note_success_count']) + parseInt(res['note_fall_count'])
        this.obj = res
        this.alert_gen_list = this.obj.alert_gen_list
        this.alert_record_list = this.obj.alert_record_list
        this.alert_notify_list = this.obj.alert_notify_list
        this.alert_notify_list_remaek = this.obj.alert_notify_list
        if (this.obj.order_status === '1' || !this.obj.order_status) this.is_work = false
        this.isDeviceDetailShow = this.obj.object_type === '1'
        this.obj.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', this.obj.order_status)
        this.obj.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', this.obj.object_type)
        this.obj.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', this.obj.order_type)
        if (res.device_id) this.getModuleByInstanceId(res.device_id)
      })
    },
    getAlertHisDetail (id) {
      rbAlertServiceFactory.getHisAlertDetail(id).then((res) => {
        this.note_total_count = parseInt(res['note_success_count']) + parseInt(res['note_fall_count'])
        this.obj = res
        this.alert_gen_list = this.obj.alert_gen_list
        this.alert_record_list = this.obj.alert_record_list
        this.alert_notify_list = this.obj.alert_notify_list
        this.alert_notify_list_remaek = this.obj.alert_notify_list
        if (this.obj.order_status === '1') this.is_work = false
        this.isDeviceDetailShow = this.obj.object_type === '1'
        this.obj.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', this.obj.order_status)
        this.obj.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', this.obj.object_type)
        this.obj.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', this.obj.order_type)
        if (res.device_id) this.getModuleByInstanceId(res.device_id)
        this.obj.clear_time = res.alert_end_time ? res.alert_end_time : res.clear_time
      })
    },
    selectChange () {
      let list = []
      if (this.alert_notice_type !== '2') {
        let val = rbMirrorCommonService.common('REPORTTYPE', '1', this.alert_notice_type)
        this.alert_notify_list_remaek.forEach(item => {
          if (item.report_type === val) {
            list.push(item)
          }
        })
        this.alert_notify_list = list
      } else if (this.alert_notice_type === '2') {
        this.alert_notify_list = []
        this.alert_notify_list = this.alert_notify_list_remaek
      }
    },
    startWork () {
      if (this.is_work === false) {
        this.work.workDialog = true
      }
    },
    submitWork () {
      this.$confirm('确认派单？').then(() => {
        const namespace = sessionStorage.getItem('namespace')
        let obj = {
          'namespace': namespace,
          'order_type': this.orderType,
          'alert_ids': this.obj.alert_id
        }
        rbAlertKanBanServiceFactory.alertHandle(obj).then((res) => {
          let successNum =  res.substring(8);
          let message = '';
          let type = '';
          if(successNum!==0){
            message = '派单成功: ' + successNum
            type = 'success';
          }else{
            message = '派单失败';
            type = 'error';
          }
          this.$message({
            message: message,
            type: type
          })
          if(type === 'success'){
            this.getDetail();
          }
        }).catch(() => {
          this.$message.error('派单失败')
        })
      })
      this.cancel('work')
    },
    // 开始清除
    startClean () {
      if (this.is_clean === false) {
        this.clean.cleanDialog = true
      }
    },
    submitClean () {
      this.$refs['formClean'].validate((valid) => {
        if (valid) {
          const namespace = sessionStorage.getItem('namespace')
          let obj = {
            'namespace': namespace,
            'alert_ids': this.obj.alert_id,
            'content': this.clean.cleanDialogTextArea,
            'auto_type':  -1,
            'start_time': '',
            'end_time': ''
          }
          rbAlertKanBanServiceFactory.deleteAlert(obj).then((res) => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.goBack()
            }
          }).catch(() => {
            this.$message.error('删除失败')
          })
        } else {

          return false;
        }
      });
      this.cancel('clean')
    },
    submitChange () {
      alert(this.detailType)
      if (this.detailType === 'alert') {
        this.changeAlert()
      } else if (this.detailType === 'alertHis') {
        this.changeAlertHis()
      }
    },
    changeAlert () {
      rbAlertServiceFactory.changeRemarkContent(this.obj.alert_id, this.change.remarkChangeContent).then((res) => {
        if (res === 'success') {
          this.cancel('change')
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.alertDetailInit()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    changeAlertHis () {
      rbAlertServiceFactory.changeHisAlertRemarkContent(this.obj.alert_id, this.change.remarkChangeContent).then((res) => {
        if (res === 'success') {
          this.cancel('change')
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.alertDetailInit()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    cancel (obj) {
      if (obj === 'work') {
        this.work.workDialog = false
        //          this.work.work_type = '0'
      } else if (obj === 'clean') {
        this.clean.cleanDialog = false
        this.clean.cleanDialogTextArea = ''
      } else if (obj === 'change') {
        this.change.remarkChangeDialog = false
        this.change.remarkChangeContent = ''
      }
    },
    // 导出
    resourceExport (module) {
      let excelName = ''
      if (module === 'gen') {
        excelName = '告警上报数据列表.xls'
      } else if (module === 'record') {
        excelName = '告警操作数据列表.xls'
      } else if (module === 'notify') {
        excelName = '告警通知数据列表.xls'
      }
      rbAlertKanBanServiceFactory.ExportCorfGridData(
        {
          'alert_id': this.obj.alert_id,
          'module': module
        }).then((res) => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = excelName
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
    },
    goBack () {
      this.$router.push({
        path: '/mirror_alert/alert/manage',
        query: {
          alertType: 'alert_detail',
        }
      })
    },
    toDeviceDetail () {
      let instanceId = this.obj.device_id
      let _t = this
      rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
        if (data) {
          _t.$router.push({ path: '/resource/iframe/detail',
                            query: { moduleId: data.module.id,name: data.module.name, instanceId: instanceId,state: 'detail' } })
        } else {
          _t.$message.error('获取模型数据失败')
        }
      })
    },
    getModuleByInstanceId (instanceId) {
      rbCmdbServiceFactory.getModuleByInstanceId(instanceId).then((data) => {
        this.getInstanceDetail(instanceId,data.module.code)
      })
    },
    getInstanceDetail (instanceId,code) {
      let params = {
        moduleCode: code
      }
      rbCmdbServiceFactory.getFullInstance(instanceId, params).then((data) => {
        this.instanceDetail = data
      })
    },
  },
  watch: {
    alertId: {
      handler: function () {
        if (this.detailType) {
          this.alertDetailInit()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .form-details {
  .el-form-item {
    width:24%;
  }
}
</style>

