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
                     :disabled="is_work">派单</el-button>
          <el-button icon="el-icon-arrow-left"
                     @click="goBack()">返回</el-button>
        </section>
        <el-form class="yw-form form-details"
                 :inline="true"
                 label-width="96px">
          <el-form-item label="告警级别">
            <rb-mirror-alert-status :mode="'detail'"
                                    :status="obj.alert_level"></rb-mirror-alert-status>
          </el-form-item>
          <br />
          <el-form-item label="告警时间">
            {{obj.alert_start_time}}
          </el-form-item>
          <el-form-item label="业务系统">
            {{obj.biz_sys}}
          </el-form-item>
          <el-form-item label="资源池">
            {{obj.idc_type_name}}
          </el-form-item>
          <el-form-item label="告警来源">
            {{obj.source}}
          </el-form-item>
          <el-form-item label="pod池">
            {{obj.pod_name}}
          </el-form-item>
          <el-form-item label="机房">
            {{obj.source_room}}
          </el-form-item>
          <el-form-item label="设备分类">
            {{obj.device_class}}
          </el-form-item>
          <el-form-item label="工单类型">
            {{obj.order_type}}
          </el-form-item>
          <el-form-item label="设备描述">
            {{obj.device_description}}
          </el-form-item>
          <el-form-item label="设备类型">
            {{obj.device_type}}
          </el-form-item>

          <el-form-item label="设备名称">
            <div>
              <span>{{obj.host_name &nbsp;}} {{obj.device_ip}}</span>
              <span><a style="text-decoration: none;cursor:pointer" @click="toDeviceDetail()">设备详情</a></span>
            </div>
          </el-form-item>
          <el-form-item label="告警类型">
            {{obj.object_type}}
          </el-form-item>
          <el-form-item label="告警内容">
            {{obj.moni_index}}
          </el-form-item>
          <el-form-item label="备注">
            {{obj.remark}}<a style="padding-left: 10px"
               @click="change.remarkChangeDialog=true">[修改]</a>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          记录
        </template>

        <el-tabs class="yw-tabs"
                 v-model="activeName">
          <el-tab-pane label="告警上报记录"
                       name="first">
            <rb-mirror-alert-gen-table :obj="obj"
                                       :type="'alert_his'"
                                       :isGen="isGen"></rb-mirror-alert-gen-table>
          </el-tab-pane>
          <el-tab-pane label="告警操作记录"
                       name="second">
            <rb-mirror-alert-record-table :obj="obj"
                                          :type="'alert_his'"
                                          :isRecord="isRecord"></rb-mirror-alert-record-table>
          </el-tab-pane>
          <el-tab-pane label="告警通知记录"
                       name="third">
            <rb-mirror-alert-notify-table :obj="obj"
                                          :type="'alert_his'"
                                          :isNotify="isNotify"></rb-mirror-alert-notify-table>
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
            <i class="el-icon-info"></i>告警数据派单到对应工单，进行工单处理
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
                 label-width="82px">
          <el-form-item label="告警清除">
            <i class="el-icon-info"></i>告警数据将移至历史告警看板
          </el-form-item>
          <el-form-item label="确认清除">
            直接清除该告警
          </el-form-item>
          <el-form-item label="清除原因">
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
import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'

export default {
  name: '/mirror_alert/alert_his/his_detail',
  components: {
    rbMirrorAlertStatus, rbMirrorAlertNotifyTable, rbMirrorAlertGenTable, rbMirrorAlertRecordTable
  },
  data () {
    return {
      activeCollapseNames: ['1', '2'],
      obj: {},
      note_total_count: 0,
      is_work: false,
      is_clean: false,
      activeName: 'first',
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
      change: {
        remarkChangeDialog: false,
        remarkChangeContent: ''
      },
      isGen: true,
      isRecord: false,
      isNotify: false
    }
  },
  mounted () {
    this.alert_notice_types = alert_notice_types
    this.getDetail()
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.isGen = true
        this.isRecord = false
        this.isNotify = false
      } else if (tab.name === 'second') {
        this.isGen = false
        this.isRecord = true
        this.isNotify = false
      } else if (tab.name === 'third') {
        this.isGen = false
        this.isRecord = false
        this.isNotify = true
      }
    },
    getDetail () {
      let id = this.$route.query.alert_id ? this.$route.query.alert_id : this.obj.alert_id
      rbAlertServiceFactory.getHisAlertDetail(id).then((res) => {
        this.note_total_count = parseInt(res['note_success_count']) + parseInt(res['note_fall_count'])
        this.obj = res
        this.alert_gen_list = this.obj.alert_gen_list
        this.alert_record_list = this.obj.alert_record_list
        this.alert_notify_list = this.obj.alert_notify_list
        this.alert_notify_list_remaek = this.obj.alert_notify_list
        if (this.obj.order_status !== '1') this.is_work = true
        if (this.obj.order_status === '2') this.is_clean = true
        this.obj.order_status = rbMirrorCommonService.common('ORDERSTATUS', '1', this.obj.order_status)
        this.obj.object_type = rbMirrorCommonService.common('OBJECTTYPE', '1', this.obj.object_type)
        this.obj.order_type = rbMirrorCommonService.common('ORDERTYPE', '1', this.obj.order_type)
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
          'alert_ids': this.obj.alert_id
        }
        rbAlertKanBanServiceFactory.alertHandle(obj).then(() => {
          this.$message({
            message: '派单成功',
            type: 'success'
          })
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
      this.$confirm('确认清除？').then(() => {
        const namespace = sessionStorage.getItem('namespace')
        let obj = {
          'namespace': namespace,
          'alert_ids': this.obj.alert_id,
          'content': this.clean.cleanDialogTextArea
        }
        rbAlertKanBanServiceFactory.deleteAlert(obj).then((res) => {
          if (res) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$router.push({ path: '/mirror_alert/alert_his/his_alert' })
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
      this.cancel('clean')
    },
    submitChange () {
      rbAlertServiceFactory.changeHisAlertRemarkContent(this.obj.alert_id, this.change.remarkChangeContent).then((res) => {
        if (res === 'success') {
          this.cancel('change')
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.getDetail()
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
      let path = this.$route.query.type === 'his_detail' ? '/mirror_alert/alert_his/his_alert' : '/mirror_alert/alert/detail'
      let alertType = this.$route.query.type === 'his_detail' ? 'his_detail' : 'alert_detail'
      this.$router.push({
        path: path,
        query: {
          alertType: alertType,
          alert_id: this.$route.query.alert_detail_id,
          requestData: this.$route.query.requestData
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .form-details {
  .el-form-item {
    width: 40%;
  }
}
</style>
