<template>
  <div class="components-container yw-dashboard" v-loading="loading">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="75px">
      <el-form-item label="管理IP地址">
        <el-input v-model="instanceIp"></el-input>
      </el-form-item>
      <el-form-item label="配置CI名称">
        <el-input v-model="codeFiledName"></el-input>
      </el-form-item>
      <el-form-item label="变更方式">
        <el-select v-model="operaterType"
                   clearable
                   placeholder="请选择">
          <el-option v-for="(item,index) in operaterTypeList"
                     :key="index"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交人">
        <el-input v-model="operator"></el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="startDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择时间"
                        :picker-options="startMonthOption">
        </el-date-picker> -
        <el-date-picker v-model="endDate"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择时间"
                        :picker-options="endMonthOption">
        </el-date-picker>
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
                   icon="el-icon-circle-check"
                   @click="batchAudit">批量通过</el-button>
        <el-button type="text"
                   icon="el-icon-circle-close"
                   @click="batchRefuse">批量驳回</el-button>
        <el-button type="text"
                   icon="el-icon-circle-check"
                   @click="allPass">全量通过</el-button>
        <el-button type="text"
                   icon="el-icon-circle-close"
                   @click="showRefuseDialog">全量驳回</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table :data="tableData" class="yw-el-table" stripe tooltip-effect="dark" border
                  height="calc(100vh - 300px)" @selection-change="handleSelectionChange">
          <el-table-column type="selection" :selectable='checkboxInit' max-width="50"> </el-table-column>
          <el-table-column label="管理IP地址" prop="instance.ip" min-width="100"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <el-button type="text" @click="gotoDetail(scope.row.instance)">
                  {{scope.row.instance.ip}}
                </el-button>
            </template>
          </el-table-column>
          <el-table-column label="资源池" prop="instance.idcType" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="设备类型" prop="instance.deviceType" min-width="100"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="配置CI名称" prop="code.filedName"
                           min-width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="配置项原值" prop="oldValue" min-width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="配置项新值" prop="currValue" min-width="150"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="变更方式" prop="operaterType" min-width="80"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="提交时间" prop="operatorTime" min-width="120"
                           :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.operatorTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="提交人"
                           prop="operator"
                           min-width="80"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="操作" prop="safety_number" width="80" fixed="right">
            <template slot-scope="scope">
              <div class="yw-table-operator">
                <el-button type="text" title="通过" icon="el-icon-circle-check" @click="audit(scope.row)"></el-button>
                <el-button type="text" title="驳回" icon="el-icon-circle-close" @click="refuse(scope.row)"></el-button>
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
               :visible.sync="auditDialog"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               title="配置项审核"
                @close="resetRefForm">
      <section class="yw-dialog-main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="yw-form  is-required" label-width="84px">
          <el-form-item label="审核状态">
            {{this.auditStatusDesc}}
          </el-form-item>
          <el-form-item label="审核描述" prop="auditDesc" v-show="descShow">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入审核描述"
              v-model="ruleForm.auditDesc" />
          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary" @click="refuseType === 'part' ? saveAuditForm() : allRefuse()">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </section>
    </el-dialog>
    <ApprovalDialog
              v-if="processInfo.showProcess"
              :processInfo="processInfo"
              @refresh="search"></ApprovalDialog>
  </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import { formatDate } from 'src/assets/js/utility/rb-filters.js'
export default {
  components: {
    ApprovalDialog: () => import('src/pages/resource/configurationItem/audit/approval-dialog.vue')
  },
  data () {
    return {
      loading: false,
      multipleSelection: [],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [10, 20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      tableData: [],
      auditDialog: false,
      descShow: false,
      auditStatusDesc: '',
      refuseType: '',
      ruleForm: {
        auditStatus: '',
        auditDesc: '',
      },
      rules: {
        auditDesc: [
          { required: true, message: '请填审核描述', trigger: 'blur' }
        ]
      },
      startMonthOption: {
        disabledDate: time => {
          let dateVal = this.endDate
          if (dateVal) {
            return time.getTime() > new Date(dateVal).getTime()
          }
        }
      },
      endMonthOption: {
        disabledDate: time => {
          let dateVal = this.startDate
          if (dateVal) {
            return time.getTime() < new Date(dateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      instanceIp: '',
      codeFiledName: '',
      operaterType: '',
      operator: '',
      operaterTypeList: [
        {
          name: '自动采集'
        },
        {
          name: '手动更新'
        },
        {
          name: '苏研数据'
        }
      ],
      startDate: '',
      endDate: '',
      processInfo: {
        showProcess: false,
        processId: ''
      },
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    gotoDetail (row) {
      this.$router.push({path: '/resource/iframe/detail',query: {name: row.deviceType, instanceId: row.id, moduleId:  row.moduleId, state: 'detail'}})
    },
    checkboxInit (row, index) {
      if (row.approvalStatus !== 0)
        return 0;//不可勾选
      else
        return 1;//可勾选
    },
    // element相关方法 多选框
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
    search () {
      this.loading = true
      let param = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'instanceIp': this.instanceIp,
        'codeFiledName': this.codeFiledName,
        'operaterType': this.operaterType,
        'operator': this.operator,
        'startTime': this.startDate,
        'endTime': this.endDate,
        'type': 'approval'
      }
      this.rbHttp.sendRequest({
        method: 'POST',
        url: `/v1/cmdb/collect/approval/list`,
        timeout: 80000,
        data: param
      }).then((res) => {
        if (res) {
          this.total = res.count
          this.tableData = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    //全量通过
    allPass() {
      this.$confirm('审核通过后将替换配置项值, 确定审核通过吗?').then(() => {
        let data = {
          allUpdateQuery: {
            'instanceIp': this.instanceIp,
            'codeFiledName': this.codeFiledName,
            'operaterType': this.operaterType,
            'operator': this.operator,
            'startTime': this.startDate,
            'endTime': this.endDate,
            'type': 'approval'
          },
          updateStatus: 1
        }
        this.loading = true
        rbCmdbServiceFactory.updateApporval(data).then((res) => {
          this.loading = false
          if (res.flag === 'true') {
            // this.$message.success('审核成功')
            this.processInfo.showProcess = true
            this.processInfo.processId = res.processId
          } else {
            // this.$message.error('审核失败')
          }
        }).finally(() => {
          this.loading = false
        })
      })
    },
    //全量驳回
    showRefuseDialog () {
      this.refuseType = 'all'
      this.auditDialog = true
      this.auditStatusDesc = '驳回'
      this.descShow = true
    },
    resetRefForm () {
      this.$refs['ruleForm'].resetFields()
    },
    allRefuse() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let data = {
            allUpdateQuery: {
              'instanceIp': this.instanceIp,
              'codeFiledName': this.codeFiledName,
              'operaterType': this.operaterType,
              'operator': this.operator,
              'startTime': this.startDate,
              'endTime': this.endDate,
              'type': 'approval'
            },
            updateStatus: 2,
            refuseDesc: this.ruleForm.auditDesc
          }
          this.loading = true
          rbCmdbServiceFactory.updateApporval(data).then((res) => {
            this.loading = false
            if (res.flag === 'true') {
              // this.$message.success('审核成功')
              this.processInfo.showProcess = true
              this.processInfo.processId = res.processId
              this.auditDialog = false
              // this.search()
            } else {
              // this.$message.error('审核失败')
              // this.processInfo.showProcess = true
              // this.processInfo.processId = res.processId
              this.search()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 批量通过
    batchAudit () {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择需要审核的数据')
        return false
      }
      let list = []
      this.multipleSelection.forEach((item) => {
        let tem = item
        tem['approvalStatus'] = '1'
        list.push(tem)
      })
      this.$confirm('审核通过后将替换配置项值, 确定审核通过吗?').then(() => {
         this.loading = true
        this.rbHttp.sendRequest({
          method: 'POST',
          url: `/v1/cmdb/collect/approval/update`,
          data: {partUpdateList: list}
        }).then((res) => {
          this.processInfo.showProcess = true
          this.processInfo.processId = res.processId
        }).finally(() => {
           this.loading = false
        })
      })
    },
    audit (item) {
      this.multipleSelection = []
      this.multipleSelection.push(item)
      this.batchAudit()
    },
    // 批量驳回
    batchRefuse () {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择需要审核的数据')
        return false
      }
      this.auditDialog = true
      this.auditStatusDesc = '驳回'
      this.descShow = true
      this.ruleForm.auditStatus = 2
      this.refuseType = 'part'
    },
    refuse (item) {
      this.multipleSelection = []
      this.multipleSelection.push(item)
      this.batchRefuse()
    },
    saveAuditForm () {
      let list = []
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.multipleSelection.forEach((item) => {
            let tem = item
            tem['approvalStatus'] = '2'
            tem['approvalDescribe'] = this.ruleForm.auditDesc
            list.push(tem)
          })
          this.$confirm('审核驳回后将忽略本次的配置项值, 确定审核驳回吗?').then(() => {
            this.$refs['ruleForm'].validate((valid) => {
              if (valid) {
                this.loading = true
                this.rbHttp.sendRequest({
                  method: 'POST',
                  url: `/v1/cmdb/collect/approval/update`,
                  data: {partUpdateList: list}
                }).then((res) => {
                  this.auditDialog = false
                  this.processInfo.showProcess = true
                  this.processInfo.processId = res.processId
                }).finally(() => {
                  this.loading = false
                })
              }
            })
          })
        }
      })
    },
    cancel () {
      this.auditDialog = false
      this.instanceIp = ''
      this.codeFiledName = ''
      this.operaterType = ''
      this.startDate = ''
      this.endDate = ''
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
