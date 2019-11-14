<template>
    <div class="data-box">
      <el-row class="search-box">
        <el-form :model="queryForm" ref="form" :inline="true">
          <el-col :span="6">
            <el-form-item prop="ruleName">
              <el-col :span="7">规则名称</el-col>
              <el-col :span="16">
                <el-input v-model="queryForm.ruleName" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-col :span="5">扫描网段</el-col>
            <el-col :span="19" class="ip-box">
              <el-form-item prop="ip.ip1" :rules="{validator: checkIp}">
                <el-input style="width: 40px" v-model="queryForm.ip.ip1"  clearable></el-input><span style="font-weight: bold">.</span>
              </el-form-item>
              <el-form-item prop="ip.ip2" :rules="{validator: checkIp}">
                <el-input style="width: 40px" v-model="queryForm.ip.ip2" clearable></el-input><span style="font-weight: bold">.</span>
              </el-form-item>
              <el-form-item prop="ip.ip3" :rules="{validator: checkIp}">
                <el-input style="width: 40px" v-model="queryForm.ip.ip3" clearable></el-input><span style="font-weight: bold">.</span>
              </el-form-item>
              <el-form-item prop="ip.ip4" :rules="{validator: checkIp}">
                <el-input style="width: 40px" v-model="queryForm.ip.ip4" clearable></el-input><span style="font-weight: bold"> -</span>
              </el-form-item>
              <el-form-item prop="ip.ip5" :rules="{validator: checkIp}">
                <el-input style="width: 40px" v-model="queryForm.ip.ip5" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="status">
              <el-col :span="10">操作状态</el-col>
              <el-col :span="14">
                <el-select v-model="queryForm.status">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="待处理" value="待处理"></el-option>
                  <el-option label="已维护" value="已维护"></el-option>
                  <el-option label="已绑定" value="已绑定"></el-option>
                  <el-option label="已屏蔽" value="已屏蔽"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="float: right">
            <el-button type="primary" size="mini" @click="getIpList">查询</el-button>
          </el-col>
        </el-form>

      </el-row>
      <el-row class="button-box">
        <el-button size="mini" @click="shieldIp()">屏蔽</el-button>
        <el-button size="mini" @click="exportLogs()">导出</el-button>
      </el-row>
      <el-row>
        <el-table v-loading="tableLoading" :data="tableData" ref="table" stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection"  :selectable="canSelect"></el-table-column>
          <el-table-column label="规则名称" prop="ruleName" show-overflow-tooltip></el-table-column>
          <el-table-column label="发现类型" prop="discoveryType" show-overflow-tooltip></el-table-column>
          <el-table-column label="扫描IP" prop="instanceName" show-overflow-tooltip></el-table-column>
          <el-table-column label="采集周期">
            <template slot-scope="scope">
              {{scope.row.collectCycle}}{{scope.row.cycleUnit}}
            </template>
          </el-table-column>
          <el-table-column label="发现时间" prop="createTime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.updateTime | formatDate}}
            </template>
          </el-table-column>
          <el-table-column label="操作状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === '已绑定'">已绑定</span>
              <span v-else-if="scope.row.status === '已维护'">已维护</span>
              <el-button type="text" v-else-if="scope.row.status === '已屏蔽'" @click="unShield(scope.row)">
                已屏蔽
              </el-button>
              <span v-else-if="scope.row.status === '待处理'">待处理</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-row class="operate-box">
                <el-col :span="6">
                  <el-tooltip content="屏蔽">
                    <i class="iconfont" v-if="scope.row.status !== '待处理'" style="color: #C0C4CC">&#xe827;</i>
                    <i class="iconfont" @click="shieldIp(scope.row)" v-else>&#xe827;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip content="维护">
                    <i class="iconfont" v-if="scope.row.status !== '待处理'" style="color: #C0C4CC">&#xe647;</i>
                    <i class="iconfont" @click="showInstanceDialog(scope.row)" v-else>&#xe647;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip content="绑定">
                    <i class="iconfont" v-if="scope.row.status !== '待处理'" style="color: #C0C4CC">&#xe6a6;</i>
                    <i class="iconfont" @click="showBindDialog(scope.row)" v-else>&#xe6a6;</i>
                  </el-tooltip>
                </el-col>
                <el-col :span="6" style="font-size: 16px">
                  <el-tooltip content="查看">
                    <i class="el-icon-view" @click.stop="showDetailDialog(scope.row)"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align='right'
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="paginationData.currentPage"
                       :page-sizes="paginationData.selectPageSizes"
                       :page-size="paginationData.pageSize"
                       :total="paginationData.total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-row>
      <el-dialog title="选择要绑定的实例" align="center" :visible.sync="showBind" width="400px" @close="resetBindDialog">
        <el-row type="flex" justify="space-around">
          <el-col :span="20">
            <el-select v-loading="instanceLoading" v-model="instanceId" filterable style="width: 100%;">
              <el-option v-for="instance in instances"
                         :key="instance.id"
                         :label="instance.name"
                         :value="instance.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="bindInstance()">确 认</el-button>
            <el-button @click="resetBindDialog()">取 消</el-button>
          </span>
      </el-dialog>
      <data-detail-panel :show="showDetail" :detail="currentLog" @setShow="setShow"></data-detail-panel>
      <data-instance-dialog :type="'discovery'" :moduleId="currentModuleId" :show="showInstance" :detail="currentLog" @setShow="setShow" ></data-instance-dialog>
    </div>
</template>

<script>
  import rbCmdbServiceFactory from 'src/services/cmdb/rb-cmdb-service.factory.js'
  import dataDetailPanel from './dataDetailPanel'
  import dataInstanceDialog from './dataInstanceDialog'

  export default {
    name: 'dataPanel',
    components: {dataInstanceDialog, dataDetailPanel},
    props: ['moduleId'],
    data () {
      return {
        currentModuleId: this.moduleId,
        tableData: [],
        currentPageSelected: [],
        allPageSelected: [],
        instances: [],
        paginationData: {  // 分页数据
          currentPage: 1,
          total: 0,
          pageSize: 30,
          selectPageSizes: [30, 50, 100]
        },
        queryForm: {
          ruleName: '',
          ip: {
            ip1: '',
            ip2: '',
            ip3: '',
            ip4: '',
            ip5: ''
          },
          status: ''
        },
        instanceId: '',
        currentLog: {},
        showBind: false,
        showDetail: false,
        showInstance: false,
        tableLoading: false,
        instanceLoading: false
      }
    },
    watch: {
      moduleId (val) {
        this.currentModuleId = val
        this.$refs['form'].resetFields()
        this.getIpList()
      },
      $route () {
        this.currentModuleId = this.$route.query.moduleId ? this.$route.query.moduleId : this.moduleId
        this.queryForm.ruleName = this.$route.query.rule ? this.$route.query.rule.ruleName : ''
        this.queryForm.ip = this.$route.query.rule ? this.$route.query.rule.ip : {ip1: '', ip2: '', ip3: '', ip4: '', ip5: ''}
        if (this.$route.query.moduleId) {
          this.getIpList()
        }
      }
    },
    mounted () {
      this.currentModuleId = this.$route.query.moduleId ? this.$route.query.moduleId : this.moduleId
      this.queryForm.ruleName = this.$route.query.rule ? this.$route.query.rule.ruleName : ''
      this.queryForm.ip = this.$route.query.rule ? this.$route.query.rule.ip : {ip1: '', ip2: '', ip3: '', ip4: '', ip5: ''}
      if (this.$route.query.moduleId) {
        this.getIpList()
      }
    },
    methods: {
      unShield (row) {
        this.$confirm('确认解除屏蔽？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rbCmdbServiceFactory.updateDiscoveryLog(row.id, {status: '待处理'}).then((data) => {
            if (data.code === 'success') {
              this.$message.success('屏蔽已解开')
              this.getIpList()
            } else {
              this.$message.success('解屏蔽失败')
            }
          })
        })
      },
      setShow (val) {
        switch (val) {
          case 'detail': this.showDetail = false
            break
          case 'instance': this.showInstance = false
            break
        }
      },
      canSelect (row, index) {
        if (row.status === '待处理') {
          return true
        } else {
          return false
        }
      },
      handleSelectionChange (val) {
        this.currentPageSelected = val
      },

      handleSizeChange (val) {
        this.paginationData.pageSize = val
        this.paginationData.currentPage = 1
        this.getIpList()
      },
      handleCurrentChange (val) {
        this.allPageSelected[this.paginationData.currentPage - 1] = this.currentPageSelected
        this.paginationData.currentPage = val
        this.getIpList()
      },
      getInstanceByModuleId () {
        this.instanceLoading = true
        this.instances = []
        rbCmdbServiceFactory.listInstanceByModuleId(this.currentModuleId).then((data) => {
          this.instanceLoading = false
          this.instances = data.dataList
        }).catch((e) => {
          this.instanceLoading = false
        })
      },
      checkIp (rule, value, callback) {
        let reg = /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/
        let reg1 = /^(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5]))))$/
        // if (!value || value.trim() === '') {
        //   return callback(new Error('不能为空'))
        // }
        if (value || value.trim() !== '') {
          if (rule.field === 'ip.ip1' || rule.field === 'ip.ip4' || rule.field === 'ip.ip5') {
            if (!reg.test(value)) {
              return callback(new Error('请输入1~255'))
            }
          } else {
            if (!reg1.test(value)) {
              return callback(new Error('请输入0~255'))
            }
          }
        }
        return callback()
      },
      shieldIp (row) {
        this.$confirm('确认屏蔽IP？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = []
          if (!row) {
            this.allPageSelected.push(this.currentPageSelected)
            this.allPageSelected.forEach(page => {
              page.forEach(item => {
                data.push({id: item.id, instanceName: item.instanceName, ruleId: item.ruleId})
              })
            })
          } else {
            data.push({id: row.id, instanceName: row.instanceName, ruleId: row.ruleId})
          }
          rbCmdbServiceFactory.shieldDiscoveryIp(data).then((data) => {
            if (data.code === 'success') {
              this.$message.success(data.msg)
            } else {
              this.$message.error(data.msg)
            }
            this.getIpList()
          })
        })
      },
      resetBindDialog () {
        this.showBind = false
      },
      showBindDialog (row) {
        this.showBind = true
        this.currentLog = row
        this.getInstanceByModuleId()
      },
      showDetailDialog (row) {
        this.showDetail = true
        this.currentLog = row
      },
      showInstanceDialog (row) {
        this.showInstance = true
        this.currentLog = row
      },
      bindInstance () {
        let data = {
          id: this.currentLog.id,
          instanceName: this.currentLog.instanceName
        }
        rbCmdbServiceFactory.bindInstance(data, this.instanceId).then((data) => {
          if (data.code === 'success') {
            this.$message.success(data.msg)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      exportLogs () {
        let header = [{
          code: 'ruleName',
          name: '规则名称'
        }, {
          code: 'discoveryType',
          name: '发现类型'
        }, {
          code: 'instanceName',
          name: '扫描IP'
        }, {
          code: 'collectCycle',
          name: '采集周期'
        }, {
          code: 'cycleUnit',
          name: '周期单位'
        }, {
          code: 'createTime',
          name: '发现时间'
        }, {
          code: 'updateTime',
          name: '更新时间'
        }, {
          code: 'status',
          name: '操作状态'
        }]
        let data = {
          header: header
        }
        rbCmdbServiceFactory.exportDiscoveryLogs(this.currentModuleId, data).then((res) => {
          let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
          let objectUrl = URL.createObjectURL(blob)
          // window.location.href = objectUrl
          let downLoadElement = document.createElement('a')
          downLoadElement.href = objectUrl
          downLoadElement.download = '新发现数据列表.xlsx'
          document.body.appendChild(downLoadElement)
          downLoadElement.click()
          document.body.removeChild(downLoadElement)
          URL.revokeObjectURL(objectUrl)
        })
      },
      getIpList () {
        this.tableLoading = true
        let queryData = {}
        let arr = Object.keys(this.queryForm.ip)
        let segment = ''
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (arr.length > 0) {
              for (let key in this.queryForm.ip) {
                if (this.queryForm.ip[key] !== '' && key !== 'ip4' && key !== 'ip5') {
                  segment += this.queryForm.ip[key] + '.'
                }
              }
            }
            queryData = {
              ruleName: this.queryForm.ruleName,
              status: this.queryForm.status,
              segment: segment,
              startIp: this.queryForm.ip.ip4,
              endIp: this.queryForm.ip.ip5
            }
            let param = {
              pageSize: this.paginationData.pageSize,
              pageNumber: this.paginationData.currentPage
            }
            let data = {
              queryData: queryData,
              param: param
            }
            this.tableData = []
            rbCmdbServiceFactory.listDiscoveryLogs(this.currentModuleId, data).then((data) => {
              this.tableLoading = false
              this.tableData = data.dataList
              this.paginationData.total = data.total
            }).catch(e => {
              this.tableLoading = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-box {
    .search-box {
      line-height: 30px;
      /deep/ .el-input__inner {
        padding: 0 5px;
      }
      .el-form-item {
        line-height: 30px;
        margin-right: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__content {
          line-height: 30px;
        }
      }
      /deep/ .el-form-item.is-success .el-input__inner{
        border-color: #dcdfe6;
      }
    }
    .button-box {
      .el-button {
        border-radius: 15px;
        color: #409EFF;
        width: 80px;
      }
    }
    .operate-box {
      font-size: 16px;
    }

    /deep/ .el-table td, .el-table th{
      padding: 5px 0;
    }
  }

</style>
