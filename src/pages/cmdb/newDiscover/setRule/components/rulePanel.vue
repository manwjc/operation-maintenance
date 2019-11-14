<template>
    <div class="rule-panel">
      <!--筛选部分-->
      <el-row style="line-height: 30px">
        <el-col :span="8">
          <el-col :span="6">规则名称</el-col>
          <el-col :span="16">
            <el-input v-model="ruleName" style="width: 100%" clearable></el-input>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="6">启用状态</el-col>
          <el-col :span="16" class="disabled-box">
            <!--<el-radio-group v-model="enable">-->
              <!--<el-radio label="是">已启用</el-radio>-->
              <!--<el-radio label="否">未启用</el-radio>-->
            <!--</el-radio-group>-->
            <el-select v-model="enable">
              <el-option label="=全部=" value=""></el-option>
              <el-option label="已启用" value="是"></el-option>
              <el-option label="未启用" value="否"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-button @click="queryRuleData" type="primary" size="mini">查询</el-button>
          <el-button @click="resetQuery" size="mini">重置</el-button>
        </el-col>
      </el-row>
      <!---->
      <el-row class="search-button-box">
        <el-col :span="12">
          <el-button @click="showAddPanel = true" size="mini">新增</el-button>
          <el-button @click="deleteRules" size="mini">删除</el-button>
          <el-button @click="exportRules" size="mini">导出</el-button>
        </el-col>
      </el-row>
      <el-row class="table-box">
        <el-table v-loading="loading" :data="ruleData" ref="ruleTable" stripe @selection-change="handleSelectionChange" @row-click="clickRow">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="规则名称" prop="ruleName" show-overflow-tooltip width="120"></el-table-column>
          <el-table-column label="发现类型" prop="discoveryType" width="80"></el-table-column>
          <el-table-column label="机房位置" prop="room" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="扫描网段" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.startScanIp}} - {{scope.row.endScanIp}}
            </template>
          </el-table-column>
          <el-table-column label="采集周期" prop="collectCycle" width="80">
            <template slot-scope="scope">
              {{scope.row.collectCycle}}{{scope.row.cycleUnit}}
            </template>

          </el-table-column>
          <el-table-column label="启用状态" prop="enable" width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.enable === '是'" type="text" @click="updateRule(scope.row)">启用</el-button>
              <el-button v-else type="text" style="color: #606266" @click="updateRule(scope.row)">关闭</el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="copyRule(scope.row)" type="text">拷贝 &nbsp;|</el-button>
              <el-button @click="jumpToDataManage(scope.row)" type="text">新设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination align='right'
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="paginationData.currentPage"
                     :page-sizes="paginationData.selectPageSizes"
                     :page-size="paginationData.pageSize"
                     :total="paginationData.total"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <el-row class="add-rule-box">
        <el-dialog :visible.sync="showAddPanel" :show-close="false" @close="resetForm">
          <el-form :inline="true" :model="addFormData" ref="addForm" :rules="formRules">
            <el-row class="form-box">
              <el-row>
                <el-col :span="4">规则名称</el-col>
                <el-col :span="20">
                  <el-form-item prop="ruleName">
                    <el-input v-model="addFormData.ruleName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">采集周期</el-col>
                <el-col :span="20">
                  <el-form-item prop="cycle">
                    <el-col :span="5">
                      <el-input-number v-model="addFormData.collectCycle" size="small" controls-position="right" :min="1"></el-input-number>
                    </el-col>
                    <el-col :span="15" style="float: right">
                      <el-radio-group v-model="addFormData.cycleUnit">
                        <el-radio label="分钟">分钟</el-radio>
                        <el-radio label="小时">小时</el-radio>
                        <el-radio label="天">天</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">机房位置</el-col>
                <el-col :span="20">
                  <el-form-item prop="room" required>
                      <el-select v-model="addFormData.room">
                        <el-option v-for="room in rooms"
                                   :key="room.id"
                                   :label="room.name"
                                   :value="room.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="ip-box">
                <el-col :span="4">扫描网段</el-col>
                <el-col :span="20">
                  <el-form-item prop="ip1" :rules="{validator: checkIp, trigger: 'blur'}">
                    <el-input style="width: 40px" v-model="addFormData.ip1"></el-input><span style="font-weight: bold">&nbsp;.</span>
                  </el-form-item>
                  <el-form-item prop="ip2" :rules="{validator: checkIp, trigger: 'blur'}">
                    <el-input style="width: 40px" v-model="addFormData.ip2"></el-input><span style="font-weight: bold">&nbsp;.</span>
                  </el-form-item>
                  <el-form-item prop="ip3" :rules="{validator: checkIp, trigger: 'blur'}">
                    <el-input style="width: 40px" v-model="addFormData.ip3"></el-input><span style="font-weight: bold">&nbsp;.</span>
                  </el-form-item>
                  <el-form-item prop="ip4" :rules="{validator: checkIp, trigger: 'blur'}">
                    <el-input style="width: 40px;" v-model="addFormData.ip4"></el-input><span style="font-weight: bold">&nbsp;——</span>
                  </el-form-item>
                  <el-form-item prop="ip5" :rules="{validator: checkIp, trigger: 'blur'}">
                    <el-input style="width: 40px" v-model="addFormData.ip5"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="scan-type-box">
                <el-col :span="4">扫描类型</el-col>
                <el-col :span="20">
                  <el-row>
                    <el-radio-group v-model="addFormData.discoveryType">
                      <el-radio style="width: 100%;margin-bottom: 20px" label="ICMP Ping">ICMP Ping</el-radio>
                      <el-radio label="SNMP">SNMP</el-radio>
                    </el-radio-group>
                  </el-row>
                  <el-row style="margin-left: 20px">
                    <el-row>
                      <el-col :span="6">OID</el-col>
                      <el-col :span="18">
                        <el-form-item prop="discoveryParam.oid" :rules="{validator: checkParam, trigger: 'blur'}">
                          <el-input :disabled="addFormData.discoveryType === 'ICMP Ping'" v-model="addFormData.discoveryParam.oid"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">共同体名</el-col>
                      <el-col :span="18">
                        <el-form-item prop="discoveryParam.public" :rules="{validator: checkParam, trigger: 'blur'}">
                          <el-input :disabled="addFormData.discoveryType === 'ICMP Ping'" v-model="addFormData.discoveryParam.public"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">端口</el-col>
                      <el-col :span="18">
                        <el-form-item prop="discoveryParam.port" :rules="{validator: checkParam, trigger: 'blur'}">
                          <el-input :disabled="addFormData.discoveryType === 'ICMP Ping'" v-model="addFormData.discoveryParam.port"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveRule()">确 认</el-button>
            <el-button @click="resetForm()">取 消</el-button>
          </span>
        </el-dialog>
      </el-row>
    </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'

  export default {
    name: 'rulePanel',
    props: ['moduleId', 'moduleName'],
    data () {
      return {
        query: {
        },
        enable: '', // 是否启用
        ruleName: '',
        moduleInfo: {}, // 模型信息
        ruleData: [], // 规则数据
        paginationData: {  // 分页数据
          currentPage: 1,
          total: 0,
          pageSize: 30,
          selectPageSizes: [30, 50, 100]
        },
        currentPageSelected: [], // 当前页所选择数据
        allPageSelected: [], // 所有页面选择数据
        showAddPanel: false,
        loading: false,
        type: 'add',
        rooms: [],
        addFormData: {
          ruleName: '',
          collectCycle: 1,
          cycleUnit: '小时',
          discoveryType: 'ICMP Ping',
          discoveryParam: {}
        },
        formRules: {
          ruleName: [
            {required: true, message: '请输入规则名称', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      moduleId (val) {
        this.moduleInfo.moduleId = val
        this.getRuleData()
      },
      moduleName (val) {
        this.moduleInfo.moduleName = val
      }
    },
    mounted () {
      this.getDictValue()
    },
    methods: {
      getDictValue () {
//        rbCmdbServiceFactory.getDictValue({formId: '2bd45148909948d4bda4098ef96d3cc3'}).then((data) => {
//          this.rooms = data.formOptions
//        })
        let obj = {
          'type': 'roomId',
          'pid': ''
        }
        rbProjectDataServiceFactory.getConfigDictByType(obj).then((res) => {
          if (res) {
            this.rooms = res
          }
        })
      },
      jumpToDataManage (row) {
        let ips = []
        ips = row.startScanIp.split('.')
        ips.push(row.endScanIp.split('.')[3])
        let rule = {
          ruleName: row.ruleName,
          ip: {
            ip1: ips[0],
            ip2: ips[1],
            ip3: ips[2],
            ip4: ips[3],
            ip5: ips[4]
          }
        }
        this.$router.push({path: 'dataManage', query: {rule: rule, moduleId: this.moduleInfo.moduleId}})
      },
      copyRule (row) {
        this.showAddPanel = true
        this.addFormData = {
          ruleName: row.ruleName,
          collectCycle: row.collectCycle,
          cycleUnit: row.cycleUnit,
          room: row.room,
          discoveryType: row.discoveryType,
          discoveryParam: row.discoveryParam ? JSON.parse(row.discoveryParam) : {},
          ip1: row.startScanIp.split('.')[0],
          ip2: row.startScanIp.split('.')[1],
          ip3: row.startScanIp.split('.')[2],
          ip4: row.startScanIp.split('.')[3],
          ip5: row.endScanIp.split('.')[3]
        }
        this.type = 'copy'
      },
      clickRow (row) {
        this.$refs.ruleTable.toggleRowSelection(row)
      },
      resetForm () {
        this.showAddPanel = false
        this.type = 'add'
        this.$refs['addForm'].resetFields()
        this.addFormData = {
          ruleName: '',
          collectCycle: 1,
          cycleUnit: '小时',
          discoveryType: 'ICMP Ping',
          discoveryParam: {}
        }
      },
      checkParam (rule, value, callback) {
        if (this.addFormData.discoveryType === 'SNMP') {
          if (!value || value.trim() === '') {
            return callback(new Error('不能为空'))
          }
          if (rule.field === 'discoveryParam.port') {
            let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
            if (!reg.test(value.trim())) {
              return callback(new Error('请输入0~65535'))
            }
          }
        }
        return callback()
      },
      checkIp (rule, value, callback) {
        let reg = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/
        let reg1 = /^(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/
        if (!value || value.trim() === '') {
          return callback(new Error('不能为空'))
        }
        if (rule.field === 'ip1' || rule.field === 'ip4' || rule.field === 'ip5') {
          if (!reg.test(value)) {
            return callback(new Error('请输入1~255'))
          }
        } else {
          if (!reg1.test(value)) {
            return callback(new Error('请输入0~255'))
          }
        }
        return callback()
      },
      getRuleData () {
        this.loading = true
        this.ruleData = []
        let data = {
          moduleId: this.moduleInfo.moduleId,
          params: {
            pageNumber: this.paginationData.currentPage,
            pageSize: this.paginationData.pageSize
          },
          queryData: this.query
        }
        rbCmdbServiceFactory.listRuleByModuleId(data).then((data) => {
          this.loading = false
          this.ruleData = data.dataList
          this.paginationData.total = data.total
        }).catch((e) => {
          this.loading = false
        })
      },
      queryRuleData () {
        this.query['ruleName'] = this.ruleName
        this.query['enable'] = this.enable
        this.getRuleData()
      },
      resetQuery () {
        this.query = {}
        this.ruleName = ''
        this.enable = ''
        this.getRuleData()
      },
      saveRule () {
        this.$confirm('是否确认新增？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$refs['addForm'].validate((valid) => {
            if (valid) {
              let startIp = this.addFormData.ip1 + '.' +
                this.addFormData.ip2 + '.' +
                this.addFormData.ip3 + '.' +
                this.addFormData.ip4

              let endIp = this.addFormData.ip1 + '.' +
                this.addFormData.ip2 + '.' +
                this.addFormData.ip3 + '.' +
                this.addFormData.ip5
              let data = {
                ruleName: this.addFormData.ruleName,
                moduleId: this.moduleInfo.moduleId,
                discoveryType: this.addFormData.discoveryType,
                discoveryParam: this.addFormData.discoveryParam,
                room: this.addFormData.room,
                startScanIp: startIp,
                endScanIp: endIp,
                collectCycle: this.addFormData.collectCycle,
                cycleUnit: this.addFormData.cycleUnit,
                enable: '是',
                createTime: new Date()
              }
              let addData = {
                moduleId: this.moduleInfo.moduleId,
                ruleData: data
              }
              rbCmdbServiceFactory.addDiscoveryRule(addData).then((data) => {
                this.getRuleData()
                this.$message({
                  message: '新增规则成功',
                  type: 'success'
                })
                this.resetForm()
              }).catch(e => {
                this.$message({
                  message: e.data.msg,
                  type: 'error'
                })
              })
            }
          })
        }).catch(() => {
        })
      },
      updateRule (row) {
        this.$confirm(row.enable === '是' ? '确认关闭？' : ' 确认启用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let ruleData = JSON.parse(JSON.stringify(row))
          ruleData.discoveryParam = JSON.parse(row.discoveryParam)
          ruleData.enable = ruleData.enable === '是' ? '否' : '是'
          try {
            let data = {
              moduleId: this.moduleInfo.moduleId,
              ruleId: ruleData.id,
              ruleData: ruleData
            }
            rbCmdbServiceFactory.updateRule(data).then((data) => {
              this.$message({ message: '更新规则成功', type: 'success' })
              this.getRuleData()
            })
          } catch (e) {
            this.$message({ message: '更新规则失败', type: 'error' })
          }
        }).catch(() => {
        })
      },
      deleteRules () {
        this.$confirm('确认是否删除所选择新发现规则', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let ruleIds = []
          this.allPageSelected[this.paginationData.currentPage - 1] = this.currentPageSelected
          this.allPageSelected.forEach(item => {
            item.forEach(curData => {
              ruleIds.push(curData.id)
            })
          })
          try {
            rbCmdbServiceFactory.deleteRule({moduleId: this.moduleInfo.moduleId, ruleIds: ruleIds}).then((data) => {
              this.$message.success('删除成功')
              this.getRuleData()
            })
          } catch (e) {
            this.$message.error('删除失败')
          }
        }).catch(() => {
        })
      },
      exportRules () {
        let headers = [
          {
            code: 'ruleName',
            name: '规则名称'
          }, {
            code: 'discoveryType',
            name: '发现方式'
          }, {
            code: 'discoveryParam',
            name: '发现参数'
          }, {
            code: 'scanIp',
            name: '扫描网段'
          }, {
            code: 'collectCycle',
            name: '采集周期'
          }, {
            code: 'cycleUnit',
            name: '周期单位'
          }, {
            code: 'enable',
            name: '启用状态'
          }, {
            code: 'createTime',
            name: '创建时间'
          }
        ]
        let exportData = {query: {ruleName: this.query.ruleName, enable: this.query.enable}, header: headers}
        rbCmdbServiceFactory.exportRule({exportData: exportData, moduleId: this.moduleInfo.moduleId}).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '新发现规则列表.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      handleSizeChange (val) {
        this.paginationData.pageSize = val
        this.paginationData.currentPage = 1
        this.getRuleData()
      },
      handleCurrentChange (val) {
        this.allPageSelected[this.paginationData.currentPage - 1] = this.currentPageSelected
        this.paginationData.currentPage = val
        this.getRuleData()
      },
      handleSelectionChange (val) {
        this.currentPageSelected = val
      }
    }
  }
</script>

<style lang="scss" scoped>

  .rule-panel {
    .disabled-box {
      /deep/ .el-radio-group {
        line-height: 30px;
      }
    }
    .search-button-box {
      .el-button {
        border-radius: 15px;
        width: 20%;
        color: #409EFF;
      }
    }
    .table-box {
      .el-table {
        height: calc(100vh - 320px);
        border-top: 1px solid #F2F6FC;
      }
      /deep/ .el-table {
        .el-table__body-wrapper {
          max-height: calc(100vh - 370px);
          /*max-height: 200px;*/
          overflow-y: auto !important;
        }
      }
      /deep/ .el-table td, .el-table th{
        padding: 0;
      }

    }
    .add-rule-box {
      /deep/ .el-dialog {
        border-radius: 10px;
        width: 35%;
      }
      /deep/ .el-dialog__header {
        padding: 0;
      }
      .el-form {
        margin: 0 20px;
      }
      .form-box {
        line-height: 30px;
        /deep/ .el-input__inner {
          border-radius: 6px;
        }
        .el-form-item {
          line-height: 30px;
          margin-bottom: 0;
          /deep/ .el-form-item__content {
            line-height: 30px;
          }
        }
        .el-input {
          width: 100%;
        }
        .el-radio-group {
          line-height: 30px;
        }
        .el-input-number {
          width: 100%;
        }
        /deep/ .el-input-number__decrease {
          border: none;
          background: none;
        }
        /deep/ .el-input-number__increase {
          border: none;
          background: none;
        }
        /deep/ .el-input-number.is-controls-right .el-input__inner{
          padding-right: 5px;
          padding-left: 0px;

        }
        /deep/ .el-input-number--small .el-input__inner {
          padding-right: 30px;
        }
        .ip-box {
          /deep/ .el-input__inner {
            padding: 0 5px;
            text-align: center;
          }
          /deep/ .el-form-item {
            margin-right: 0;
          }
        }
        .scan-type-box {
          .el-radio+.el-radio{
            margin-left: 0;
          }
        }
      }
      /deep/ .el-dialog__footer {
        text-align: center;
      }
    }
  }
</style>
