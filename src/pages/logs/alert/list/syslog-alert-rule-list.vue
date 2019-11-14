<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="规则名称">
        <el-input v-model="rule_name"></el-input>
      </el-form-item>
      <el-form-item label="资源池">
        <YwSelectResource :pool="pool"
                          @changePool="changePool"
                          @cleanPool="cleanPool"></YwSelectResource>
      </el-form-item>
      <el-form-item label="设备IP">
        <el-input v-model="ip"></el-input>
      </el-form-item>
      <el-form-item label="运行状态">
        <el-select v-model="run_status"
                   placeholder="请选择"
                   clearable
                   filterable>
          <el-option value="0" label="停用"> </el-option>
          <el-option value="1" label="启用"> </el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="searchData">查询</el-button>
        <el-button size="small"
                   @click="reset">重置</el-button>
      </section>
    </el-form>
    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-plus"
                   @click="createLogAlertRuleDialog=true">新增</el-button>
        <!--<el-button class="btn-icons-wrap"-->
                   <!--type="text"-->
                   <!--icon="el-icon-delete"-->
                   <!--@click="clear()">删除</el-button>-->
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="fa fa-unlock-alt"
                   @click="open()">启用</el-button>
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="fa fa-lock"
                   @click="close()">停用</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table border
                  class="yw-el-table"
                  height="calc(100vh - 270px)"
                  :data="SysLogAlertRules"
                  style="cursor: pointer;"
                  stripe
                  tooltip-effect="dark"
                  v-loading="loading"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="dblHandleCurrentChange($event)">
          <el-table-column type="selection" width="40px"></el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           sortable></el-table-column>
          <el-table-column prop="idcType"
                           label="资源池"
                           :show-overflow-tooltip="true"
                           sortable> </el-table-column>
          <el-table-column prop="ip"
                           label="设备IP"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="param"
                           label="关键字"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="filterTime"
                           label="时间过滤"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="runStatus"
                           label="运行状态"
                           sortable
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="creator"
                           label="创建人"
                           :show-overflow-tooltip="true"
                           sortable></el-table-column>
          <el-table-column prop="createTime"
                           label="创建时间"
                           :show-overflow-tooltip="true"
                           sortable>
          </el-table-column>
          <el-table-column prop="alertCount"
                           label="告警总数"
                           :show-overflow-tooltip="true"
                           sortable>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text"
                           title="编辑"
                           icon="el-icon-edit"
                           @click="update(scope.row)"
                           :disabled="checkPermission(scope.row.userName)"></el-button>
                <el-button type="text"
                           title="删除"
                           icon="el-icon-delete"
                           @click="clear(scope.row)"
                           :disabled="checkPermission(scope.row.userName)"></el-button>
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
    <el-dialog class="yw-dialog"
               :visible.sync="createLogAlertRuleDialog"
               title="创建日志告警规则"
               width="446px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <sysLogAlertRule ref="sysLogAlertRule"
                       v-if="createLogAlertRuleDialog"
                       :type="'add'"></sysLogAlertRule>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="addSubmit()">提交</el-button>
        <el-button size="small"
                   @click="addCancel()">取消</el-button>
      </section>
    </el-dialog>
    <el-dialog class="yw-dialog"
               :visible.sync="detailLogAlertRuleDialog"
               title="日志告警规则详情"
               width="446px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <sysLogAlertRule ref="sysLogAlertRule"
                       v-if="detailLogAlertRuleDialog"
                       :type="'detail'"
                       :logAlertRuleDetailData="logAlertRuleDetailData"></sysLogAlertRule>
    </el-dialog>
    <el-dialog class="yw-dialog"
               :visible.sync="updateLogAlertRuleDialog"
               title="修改日志告警规则"
               width="446px"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <sysLogAlertRule ref="sysLogAlertRule"
                       v-if="updateLogAlertRuleDialog"
                       :type="'update'"
                       :logAlertRuleDetailData="logAlertRuleDetailData"></sysLogAlertRule>
      <section class="btn-wrap">
        <el-button type="primary"
                   size="small"
                   @click="updateSubmit()">提交</el-button>
        <el-button @click="updateLogAlertRuleDialog = false">取消</el-button>
      </section>
    </el-dialog>
  </div>
</template>
<script>
import QueryObject from 'src/utils/queryObject.js'
import LogServiceFactory from 'src/services/sys/log-services.js'
export default {
  mixins: [QueryObject],
  components: {
    YwSelectResource: () => import('src/components/common/yw-select-resource.vue'),
    sysLogAlertRule: () => import('src/pages/logs/alert/add/syslog-alert-rule.vue')
  },
  props: [
  ],
  data () {
    return {
      multipleSelection: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      rule_name: '',
      ip: '',
      run_status: '',
      SysLogAlertRules: [],
      loading: false,
      createLogAlertRuleDialog: false,
      updateLogAlertRuleDialog: false,
      detailLogAlertRuleDialog: false,
      logAlertRuleDetailData: {},
      loading: false
    }
  },
  mounted: function () {
    this.init_()
  },
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init_ () {
      this.searchData()
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      } else {
        this.timer = setInterval(() => {
        this.searchData()
        }, 60000)
      }
    },
    // 1 element相关方法 多选框
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.searchData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.searchData()
    },
    getRequest () {
      let obj = {}
      obj.name = this.rule_name
      obj.ip = this.ip
      obj.runStatus = this.run_status
      obj.idcType = this.pool
      obj.pageNo = this.currentPage
      obj.pageSize = this.pageSize
      return obj
    },
    searchData () {
//      this.loading = true
      LogServiceFactory.getLogAlertRuleList(this.getRequest()).then((res) => {
        this.total = res.count
        res.result.forEach((item) => {
          item.runStatus = item.runStatus === '0' ? '停用' : '启用'
          item.filterTime = item.filterTime ? '最近' + item.filterTime + '分钟' : ''
          if (item.param) {
            let keys = item.param.split(',')
            let param = []
            for (let i = 0; i < keys.length; i++) {
              param.push('关键字' + (i+1) + ':' + keys[i])
            }
            item.param = param.toString()
          }
        })
        this.SysLogAlertRules = res.result
//        this.loading = false
      })
    },
    reset () {
      this.rule_name = ''
      this.ip = ''
      this.run_status = ''
      this.pool = ''
    },
    updateLogAlertRule (data) {
      LogServiceFactory.updateLogAlertRule(data).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
          this.searchData()
        } else {
          this.$message.error('更新失败!')
        }
        this.updateLogAlertRuleDialog = false
      }).catch(() => {
        this.$message.error('更新失败!')
        this.updateLogAlertRuleDialog = false
      })
    },
    validateAddRequest () {
      let logAlertRuleData = this.$refs.sysLogAlertRule.logAlertRuleData
      let obj = {}
      obj.logAlertRuleData = logAlertRuleData
      obj.flag = true
      if (!logAlertRuleData.name) {
        obj.flag = false
        obj.msg = '请输入日志告警规则名称!'
        return obj
      } else if (!logAlertRuleData.alertLevel) {
        obj.flag = false
        obj.msg = '请选择告警等级!'
        return obj
      } else {
        return obj
      }
    },
    getLogAlertRuleRequest (addForm) {
      let obj = {
        'uuid': addForm.uuid,
        'name': addForm.name,
        'description': addForm.description,
        'runStatus': addForm.runStatus ? '1' : '0',
        'idcType': addForm.idcType,
        'ip': addForm.deviceIp,
        'param': addForm.key ? addForm.key.toString() : '',
        'filterTime': addForm.filterDateValue,
        'alertLevel': addForm.alertLevel
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
      LogServiceFactory.createLogAlertRule(this.getLogAlertRuleRequest(obj.logAlertRuleData)).then((res) => {
        this.createLogAlertRuleDialog = false
        if (res.status === 'success') {
          this.$message({
            message: '创建成功!',
            type: 'success'
          })
          this.searchData()
        } else if (res.status === 'error') {
          this.$message.error(res.result)
        } else {
          this.$message.error('创建失败!')
        }
      }).catch(() => {
        this.$message.error('创建失败!')
        this.createLogAlertRuleDialog = false
      })
    },
    addCancel () {
      this.createLogAlertRuleDialog = false
      this.$refs.sysLogAlertRule.resetForm()
    },
    clear (obj) {
      let req = []
      let boolean = true
      let message = ''
//      if (this.multipleSelection.length < 1) {
//        boolean = false
//        message = '请先重新选择日志告警规则!'
//      } else {
//        this.multipleSelection.forEach((item) => {
//          if (item.runStatus === '启用') {
//            boolean = false
//            message = '日志告警规则没有全部关闭,请重新选择!'
//          } else {
//            req.push(item.uuid)
//          }
//        })
//      }
      if (obj.runStatus === '启用') {
        boolean = false
        message = '日志告警规则没有关闭,请重新选择!'
      } else {
        req.push(obj.uuid)
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认删除?').then(() => {
        LogServiceFactory.deleteLogAlertRule(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
            this.searchData()
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
        message = '请先重新选择日志告警规则!'
      } else {
        this.multipleSelection.forEach((item) => {
          if (item.runStatus === '启用') {
            data.push(item)
          } else {
            req.push(item.uuid)
          }
        })
        if (data.length === this.multipleSelection.length) {
          boolean = false
          message = '选择的日志告警规则已全部启用,请重新选择!'
        }
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认启用?').then(() => {
        LogServiceFactory.openLogAlertRule(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '启用成功!',
              type: 'success'
            })
            this.searchData()
          } else {
            this.$message.error('启用失败!')
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
        message = '请先重新选择日志告警规则!'
      } else {
        this.multipleSelection.forEach((item) => {
          if (item.runStatus === '停用') {
            data.push(item)
          } else {
            req.push(item.uuid)
          }
        })
        if (data.length === this.multipleSelection.length) {
          boolean = false
          message = '选择的日志告警规则已全部关闭,请重新选择!'
        }
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确认关闭?').then(() => {
        LogServiceFactory.closeLogAlertRule(req).then((res) => {
          if (res === 'success') {
            this.$message({
              message: '关闭成功!',
              type: 'success'
            })
            this.searchData()
          } else {
            this.$message.error('关闭失败!')
          }
        })
      })
    },
    getLogAlertRuleDetail (uuid) {
      LogServiceFactory.getLogAlertRuleDetail(uuid).then((res) => {
        this.logAlertRuleDetailData = res
      })
    },
    dblHandleCurrentChange (obj) {
      this.getLogAlertRuleDetail(obj.uuid)
      this.detailLogAlertRuleDialog = true
    },
    update (obj) {
      let boolean = true
      let message = ''
      if (obj.runStatus === '启用') {
        boolean = false
        message = '日志告警规则处于启用状态,请先关闭!'
      }
      if (!boolean) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.getLogAlertRuleDetail(obj.uuid)
      this.updateLogAlertRuleDialog = true
    },
    updateSubmit () {
      let obj = this.validateAddRequest()
      if (!obj.flag) {
        this.$alert(obj.msg, '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      LogServiceFactory.updateLogAlertRule(this.getLogAlertRuleRequest(obj.logAlertRuleData)).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
          this.searchData()
        } else {
          this.$message.error('更新失败!')
        }
        this.updateLogAlertRuleDialog = false
      }).catch(() => {
        this.$message.error('更新失败!')
        this.updateLogAlertRuleDialog = false
      })
    },
    checkPermission (creator) {
      let userName = sessionStorage.getItem('username')
      let namespace = sessionStorage.getItem('namespace')
      if (userName === creator || userName === namespace) {
        return false
      }
      return true
    },
  }
}
</script>
<style scoped lang="scss">
</style>
