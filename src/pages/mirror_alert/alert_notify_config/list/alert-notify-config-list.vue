<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="65px">
      <el-form-item label="规则名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select v-model="isOpen"
                   placeholder="请选择">
          <el-option value="-1"
                     label="全部"></el-option>
          <el-option value="0"
                     label="关闭"></el-option>
          <el-option value="1"
                     label="启用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-select v-model="notifyType"
                   placeholder="请选择">
          <el-option value="-1"
                     label="全部"></el-option>
          <el-option value="0"
                     label="邮件/短信"></el-option>
          <el-option value="1"
                     label="邮件"></el-option>
          <el-option value="2"
                     label="短信"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="筛选器">
        <el-select v-model="alertFilter"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option v-for="val in filterData"
                     :key="val.id"
                     :label="val.name"
                     :value="val.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知对象">
        <el-input v-model="notifyObj"></el-input>
      </el-form-item>
      <el-form-item label="重发状态">
        <el-select v-model="isRecurrenceInterval"
                   placeholder="请选择">
          <el-option value="-1"
                     label="全部"></el-option>
          <el-option value="0"
                     label="关闭"></el-option>
          <el-option value="1"
                     label="启用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker v-model="sendTimeStart"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker> -
        <el-date-picker v-model="sendTimeEnd"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
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
                   <!--icon="el-icon-alarm-clock"-->
                   <!--@click="openAlertNotifyConfigRule()"-->
                   <!--v-if="getOperationPermission('alert_notify_config','rule')">定时任务规则</el-button>-->
        <el-button type="text"
                   icon="el-icon-plus"
                   @click="addAlertNotifyConfig=true"
                   v-if="getOperationPermission('alert_notify_config','create')">新增</el-button>

        <el-button type="text"
                   icon="el-icon-delete"
                   @click="clear()"
                   v-if="getOperationPermission('alert_notify_config','delete')">清除</el-button>
        <el-button type="text"
                   icon="fa fa-clone"
                   @click="copy()"
                   v-if="getOperationPermission('alert_notify_config','copy')">拷贝</el-button>
        <el-button type="text"
                   icon="fa fa-unlock-alt"
                   @click="open()"
                   v-if="getOperationPermission('alert_notify_config','open')">启用</el-button>
        <el-button type="text"
                   icon="fa fa-lock"
                   @click="close()"
                   v-if="getOperationPermission('alert_notify_config','close')">关闭</el-button>
      </div>
      <div class="yw-el-table-wrap">

        <el-table :data="alertNotifyConfig"
                  class="yw-el-table"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 340px)"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblHandleCurrentChange($event)"
                  v-loading="loading">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="name"
                           label="规则名称"></el-table-column>
          <el-table-column prop="alertFilterName"
                           label="筛选器名称"></el-table-column>
          <el-table-column prop="notifyType"
                           label="通知配置"></el-table-column>
          <el-table-column prop="isOpen"
                           label="启用状态"></el-table-column>
          <el-table-column prop="curSendTime"
                           label="最近发送时间"></el-table-column>
          <el-table-column label="操作"
                           width="80">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           title="编辑"
                           icon="el-icon-edit"
                           @click="update(scope.row)"
                           :disabled="checkPermission(scope.row.creator)"></el-button>
              </div>

            </template>
          </el-table-column>
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
               title="新增告警通知配置"
               :visible.sync="addAlertNotifyConfig"
               width="700px">
      <section class="yw-dialog-main">
        <alert-notify-config-add ref="alertNotifyConfigAdd"
                                 v-if="addAlertNotifyConfig"
                                 :type="'add'">
        </alert-notify-config-add>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="addSubmit()">创建</el-button>
        <el-button @click="addCancel()">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               title="告警通知配置详情"
               :visible.sync="alertNotifyConfigDetailDialog"
               width="640px"
               :close-on-click-modal="false"
               :modal="false">
      <section class="yw-dialog-main">
        <alert-notify-config-add ref="alertNotifyConfigAdd"
                                 v-if="alertNotifyConfigDetailDialog"
                                 :alertNotifyConfigDetail=alertNotifyConfigDetail
                                 :type="'detail'"></alert-notify-config-add>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               title="更新告警通知配置"
               :visible.sync="updateAlertNotifyConfigDialog"
               width="700px"
               :close-on-click-modal="false"
               :modal="false">
      <section class="yw-dialog-main">
        <alert-notify-config-add ref="alertNotifyConfigAdd"
                                 v-if="updateAlertNotifyConfigDialog"
                                 :alertNotifyConfigDetail=alertNotifyConfigDetail
                                 :type="'update'"></alert-notify-config-add>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="updateSubmit()">更新</el-button>
        <el-button @click="updateAlertNotifyConfigDialog = false">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog class="yw-dialog"
               title="定时任务规则配置"
               :visible.sync="alertNotifyConfigRuleDialog"
               width="382px"
               :close-on-click-modal="false"
               :modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="90px"
                 :inline="true">
          <el-form-item label="定时发送规则">
            <el-input v-model="sendRule"></el-input>
          </el-form-item>

        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="ruleSubmit()">更新</el-button>
        <el-button @click="ruleCancel()">取消</el-button>
      </section>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import alertNotifyConfigAdd from 'src/pages/mirror_alert/alert_notify_config/add/alert-notify-config-add.vue'
import rbAlertNotifyConfigFactory from 'src/services/alert/rb-alert-notify-config.factory.js'
import rbAlertFilterServicesFactory from 'src/services/alert/rb-alertFilter-services.factory.js'
import rbRolePermissionServiceFactory from 'src/services/rbac_role/rb-role-permission-service.factory.js'
export default {
  name: '/mirror_alert/alert_notify_config/list',
  components: {
    alertNotifyConfigAdd
  },
  data () {
    return {
      alertNotifyConfig: [],
      loading: false,
      addAlertNotifyConfig: false,
      filterData: [],
      multipleSelection: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      name: '',
      isOpen: '-1',
      notifyType: '-1',
      alertFilter: '',
      notifyObj: '',
      isRecurrenceInterval: '-1',
      sendTimeStart: '',
      sendTimeEnd: '',
      alertNotifyConfigDetail: {},
      alertNotifyConfigDetailDialog: false,
      updateAlertNotifyConfigDialog: false,
      alertNotifyConfigRuleDialog: false,
      ruleData: {},
      sendRule: '',
      resendRule: '',
      resourceType: []
    }
  },
  methods: {
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
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
    initFilter () {
      rbAlertFilterServicesFactory.getAll().then((res) => {
        if (res) {
          this.filterData = res
        }
      })
    },
    dblHandleCurrentChange (obj) {
      let req = {
        'uuid': obj.uuid
      }
      rbAlertNotifyConfigFactory.getAlertNotifyConfigDetail(req).then((res) => {
        this.alertNotifyConfigDetail = res
        this.alertNotifyConfigDetailDialog = true
      })
    },
    getPermissions () {
      rbRolePermissionServiceFactory.getPermissions('alert_notify_config').then((res) => {
        if (res) {
          this.resourceType = res
        }
      })
    },
    getOperationPermission (resourceType, action) {
      //      return this.resourceType.includes(resourceType + ':' + action)
      return true
    },
    checkPermission (creator) {
      let userName = sessionStorage.getItem('username')
      let namespace = sessionStorage.getItem('namespace')
      if (userName === creator || userName === namespace) {
        return false
      }
      return true
    },
    getRequest () {
      let obj = {
        'name': this.name,
        'isOpen': this.isOpen,
        'notifyType': this.notifyType,
        'alertFilter': this.alertFilter,
        'notifyObj': this.notifyObj,
        'isRecurrenceInterval': this.isRecurrenceInterval,
        'sendTimeStart': this.sendTimeStart,
        'sendTimeEnd': this.sendTimeEnd,
        'pageNum': this.currentPage,
        'pageSize': this.pageSize
      }
      return obj
    },
    search () {
      let sendTimeStart = this.getRequest().sendTimeStart
      let sendTimeEnd = this.getRequest().sendTimeEnd
      let flag = true
      let msg = ''
      if ((sendTimeStart && !sendTimeEnd) || (!sendTimeStart && sendTimeEnd)) {
        flag = false
        msg = '发送时间内容不正确!'
      } else if (sendTimeStart && sendTimeEnd) {
        let oDate1 = new Date(sendTimeStart);
        let oDate2 = new Date(sendTimeEnd);
        if (oDate1.getTime() > oDate2.getTime()) {
          flag = false
          msg = '发送时间内容不合法!'
        }
      }
      if (!flag) {
        this.$alert(msg, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      rbAlertNotifyConfigFactory.getAlertNotifyConfigList(this.getRequest()).then((res) => {
        this.total = res.count
        this.alertNotifyConfig = res.result
      })
    },
    reset () {
      this.name = ''
      this.isOpen = '-1'
      this.notifyType = '-1'
      this.alertFilter = ''
      this.notifyObj = ''
      this.isRecurrenceInterval = '-1'
      this.sendTimeStart = ''
      this.sendTimeEnd = ''
    },
    validateAddRequest () {
      let addForm = this.$refs.alertNotifyConfigAdd.addForm
      let obj = {}
      obj.addForm = addForm
      obj.flag = true
      if (!addForm.name) {
        obj.flag = false
        obj.msg = '请输入告警通知配置名称!'
        return obj
      } else if (!addForm.alertFilter) {
        obj.flag = false
        obj.msg = '请先选择告警筛选器!'
        return obj
      } else if (!addForm.alertFilterScene) {
        obj.flag = false
        obj.msg = '请先选择告警场景!'
        return obj
      } else if (!addForm.notifyAlertType.length > 0) {
        obj.flag = false
        obj.msg = '请至少选择一个通知告警类型!'
        return obj
      } else if (!addForm.addTableData.length > 0) {
        obj.flag = false
        obj.msg = '请输入告警通知对象信息!'
        return obj
      } else if (addForm.startPeriod > addForm.endPeriod || addForm.startPeriod === addForm.endPeriod) {
        obj.flag = false
        obj.msg = '配置执行区间格式错误,请重新选择!'
        return obj
      } else {
        return obj
      }
    },
    getAddRequest (addForm) {
      let obj = {
        'uuid': addForm.uuid,
        'name': addForm.name,
        'isOpen': addForm.isOpen ? 1 : 0,
        'alertFilterId': parseInt(addForm.alertFilter),
        'alertFilterSceneId': parseInt(addForm.alertFilterScene),
        'notifyAlertType': addForm.notifyAlertType.toString(),
        'notifyObjInfo': addForm.addTableData,
        'isRecurrenceInterval': addForm.isRecurrenceInterval ? 1 : 0,
        'recurrenceInterval': addForm.isRecurrenceInterval ? addForm.recurrenceInterval : '',
        'recurrenceIntervalUtil': addForm.isRecurrenceInterval ? addForm.recurrenceIntervalUtil : '',
        'emailType': parseInt(addForm.emailType),
      }
      obj.period = addForm.period
      if (addForm.period === '1') {
        obj.startPeriod = addForm.startPeriod
        obj.endPeriod = addForm.endPeriod
      }
      return obj
    },
    addSubmit () {
      let obj = this.validateAddRequest()
      if (!obj.flag) {
        this.$alert(obj.msg, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      rbAlertNotifyConfigFactory.createAlertNotifyConfig(this.getAddRequest(obj.addForm)).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '创建成功!',
            type: 'success'
          })
          this.search()
          this.addAlertNotifyConfig = false
        } else {
          this.$message.error('创建失败!')
        }
      })
    },
    addCancel () {
      this.addAlertNotifyConfig = false
      this.$refs.alertNotifyConfigAdd.resetAddTableData()
    },
    update (obj) {
      let boolean = true
      let message = ''
      //      if (this.multipleSelection.length < 1) {
      //        boolean = false
      //        message = '请先选择告警通知配置!'
      //      } else if (this.multipleSelection.length > 1) {
      //        boolean = false
      //        message = '告警通知配置不能多选!'
      //      } else if (this.multipleSelection[0].isOpen === '启用') {
      //        boolean = false
      //        message = '告警通知配置处于启用状态,请先关闭!'
      //      }
      if (obj.isOpen === '启用') {
        boolean = false
        message = '告警通知配置处于启用状态,请先关闭!'
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let req = {
        'uuid': obj.uuid
      }
      rbAlertNotifyConfigFactory.getAlertNotifyConfigDetail(req).then((res) => {
        this.alertNotifyConfigDetail = res
        this.updateAlertNotifyConfigDialog = true
      })
    },
    updateSubmit () {
      let obj = this.validateAddRequest()
      if (!obj.flag) {
        this.$alert(obj.msg, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let req = this.getAddRequest(obj.addForm)
      rbAlertNotifyConfigFactory.updateAlertNotifyConfig(req).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
          this.search()
          this.updateAlertNotifyConfigDialog = false
        } else {
          this.$message.error('更新失败!')
        }
      })
    },
    clear () {
      let req = []
      let boolean = true
      let message = ''
      if (this.multipleSelection.length < 1) {
        boolean = false
        message = '请先重新选择告警通知配置!'
      } else {
        this.multipleSelection.forEach((item) => {
          if (item.isOpen === '启用') {
            boolean = false
            message = '告警通知配置没有全部关闭,请重新选择!'
          } else {
            req.push(item.uuid)
          }
        })
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认删除?').then(() => {
        rbAlertNotifyConfigFactory.deleteAlertNotifyConfig(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('删除失败!')
          }
        })
      })
    },
    open () {
      let req = []
      let boolean = true
      let message = ''
      let data = []
      if (this.multipleSelection.length < 1) {
        boolean = false
        message = '请先选择告警通知配置!'
      } else {
        this.multipleSelection.forEach((item) => {
          if (item.isOpen === '启用') {
            data.push(item)
          } else {
            req.push(item.uuid)
          }
        })
        if (data.length === this.multipleSelection.length) {
          boolean = false
          message = '选择的告警通知配置已全部启用,请重新选择!'
        }
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认启用?').then(() => {
        rbAlertNotifyConfigFactory.openAlertNotifyConfig(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '启用成功!',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('启用失败!')
          }
        })
      })
    },
    copy () {
      let req = {}
      let boolean = true
      let message = ''
      if (this.multipleSelection.length < 1) {
        boolean = false
        message = '请先选择告警通知配置!'
      } else if (this.multipleSelection.length > 1) {
        boolean = false
        message = '告警通知配置不能多选,请重新选择!'
      } else if (this.multipleSelection[0].isOpen === '启用') {
        boolean = false
        message = '告警通知配置处于启用状态,请先关闭!'
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      req.uuid = this.multipleSelection[0].uuid
      this.$confirm('确认拷贝?').then(() => {
        rbAlertNotifyConfigFactory.copyAlertNotifyConfig(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '拷贝成功!',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('拷贝失败!')
          }
        })
      })
    },
    close () {
      let req = []
      let boolean = true
      let message = ''
      let data = []
      if (this.multipleSelection.length < 1) {
        boolean = false
        message = '请先选择告警通知配置!'
      } else {
        this.multipleSelection.forEach((item) => {
          if (item.isOpen === '关闭') {
            data.push(item)
          } else {
            req.push(item.uuid)
          }
        })
        if (data.length === this.multipleSelection.length) {
          boolean = false
          message = '选择的告警通知配置已全部关闭,请重新选择!'
        }
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认关闭?').then(() => {
        rbAlertNotifyConfigFactory.closeAlertNotifyConfig(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '关闭成功!',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('关闭失败!')
          }
        })
      })
    },
    openAlertNotifyConfigRule () {
      rbAlertNotifyConfigFactory.getAlertNotifyConfigRule().then((res) => {
        this.ruleData = res
        this.sendRule = res.send
        this.resendRule = res.resend
      })
      this.alertNotifyConfigRuleDialog = true
    },
    ruleSubmit () {
      let boolean = true
      let message = ''
      if (!this.sendRule || !this.resendRule) {
        boolean = false
        message = '规则不能为空!'
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let req = {
        'send': this.sendRule,
        'resend': this.resendRule
      }
      this.$confirm('确认更新?').then(() => {
        rbAlertNotifyConfigFactory.updateAlertNotifyConfigRule(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '更新成功!',
              type: 'success'
            })
            this.search()
          } else {
            this.$message.error('更新失败!')
          }
        })
      })
      this.ruleCancel()
    },
    ruleCancel () {
      this.alertNotifyConfigRuleDialog = false
      this.sendRule = ''
      this.resendRule = ''
    }
  },
  mounted () {
    this.search()
    this.initFilter()
    this.getPermissions()
  }
}
</script>

<style lang="scss" scoped>
</style>
