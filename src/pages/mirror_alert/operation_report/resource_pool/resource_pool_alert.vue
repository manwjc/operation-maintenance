<template>
  <div class="component-container">
    <div class="dataTime" style="margin-bottom: 10px;">
      <el-row>
        <el-col :span="12">
          资源池：<el-select v-model="active" placeholder="请选择" class="input-tem-name1" clearable filterable style="width: 200px">
          <el-option   label="启用" value="1"></el-option>
          <el-option   label="禁用" value="0"></el-option>
        </el-select>
        </el-col>
        <el-col :span="12">
          归属月份：<el-select v-model="active" placeholder="请选择" class="input-tem-name1" clearable filterable style="width: 200px">
          <el-option   label="启用" value="1"></el-option>
          <el-option   label="禁用" value="0"></el-option>
        </el-select>
        </el-col>
      </el-row>
    </div>
    <el-tabs type="card">
      <el-tab-pane label="告警数量统计">
        <el-table
          :data="tableData"
          border
          style="width: 100%;margin-top:15px">
          <el-table-column
            prop="receiver"
            label="资源池名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mail_server"
            label="告警总数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="receive_port"
            label="重大告警数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="active"
            label="重要告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="次要告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="低告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="strategy_num"
            label="提醒告警数量"
            align="center"
            >
          </el-table-column>
        </el-table>
        <el-row :gutter="20" >
          <el-col :span="12" style="float: right">
            <el-pagination style="margin-bottom: 10px;"
                           class="pull-right pagination-margin"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="pageSizes"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="告警分布">
        <el-table
          :data="tableData"
          border
          style="width: 100%;margin-top:15px">
          <el-table-column
            prop="receiver"
            label="资源池名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mail_server"
            label="告警类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="receive_port"
            label="物理服务器告警数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="active"
            label="物理防火墙告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="物理路由器告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="strategy_num"
            label="物理交换机告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="period"
            label="云存储设备告警数量"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="region"
            label="SDN控制器告警数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="region"
            label="磁盘阵列告警数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="region"
            label="磁带库告警数量"
            align="center">
          </el-table-column>
        </el-table>
        <el-row :gutter="20" >
          <el-col :span="12" style="float: right">
            <el-pagination style="margin-bottom: 10px;"
                           class="pull-right pagination-margin"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-sizes="pageSizes"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>


    </div>
</template>

<script>
  import rbEmailConfigServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
  export default {
    data () {
      return {
        detailFlag: false,
        editFlag: false,
        edit: false,
        active: '',
        form: {},
        mail_server: '',
        receiver: '',
        tableData: [],
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [30, 50, 100], // 每页多少行数组
        total: 0 // 总共多少行数据,
      }
    },
    mounted () {
      // this.search()
    },
    methods: {
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
        let page = {
          page_no: this.currentPage,
          page_size: this.pageSize,
          receiver: this.receiver,
          mail_server: this.mail_server,
          active: this.active
        }
        if (!this.active) {
          page.active = '-1'
        }
        rbEmailConfigServicesFactory.getList(page).then((res) => {
          this.tableData = res.result
          this.total = res.count
        }).catch(() => {
          this.$message.error('查询失败')
        })
      },
      gotoScene (receiver, mailServer) {
        this.$router.push({path: '/mirror_alert/emailInfo_receive/receiver-config/list/', query: {receiver: receiver}})
      },
      detail (id) {
        this.$router.push({path: '/mirror_alert/filter/scene/add/', query: {sceneId: id, detail: 'detail'}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-container {
    header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .head {
        width:100%;
        text-align:left;
        .task-name {
          display: inline-block;
          margin-left: 2.7%;
        }
        .head-type {
          margin-left: 2.9%;
          display: inline-block;
        }
        .input-tem-name1 {
          width: 8.7%;
          min-width:102px;
          margin-left: 1%;
        }
        .list-sel {
          width: 8.7%;
          min-width:102px;
          margin-left: 1%;
          display: inline-block;
        }
      }
      .dataTime {
        width:100%;
        text-align:left;
        display: block;
        .task-name {
          display: inline-block;
          margin-left: 2.7%;
          width:70px;
        }
        .input-tem-name1 {
          width: 10%;
          min-width:150px;
          margin-left: 1%;
        }
        div {
          display: inline-block;
        }
        .time-range {
          width: 36%;
          min-width: 403px;
          margin-left: 1%;
          height: 34px;
          line-height: 32px;
          padding: 0 15px;
        }
        .creat-time {
          margin-left: 2.9%;
        }
      }
    }
    .body-container {
      border: 2px solid #f0f0f0;
      margin-top: 10px;
      padding: 10px 5px;
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td:nth-child(1) {
        background: #fff
      }

      /deep/ .el-table .el-table__body-wrapper .warning-tip td:nth-child(2){
        background: #f0f9eb;
        border-bottom: 1px solid #f0f9eb;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-di td:nth-child(2){
        background: oldlace;
        border-bottom: 1px solid oldlace;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-zhong td:nth-child(2){
        background: #FFD700;
        border-bottom: 1px solid #FFD700;      }
      /deep/ .el-table .el-table__body-wrapper .warning-gao td:nth-child(2){
        background: #E6A23C;
        border-bottom: 1px solid #E6A23C;
      }
      /deep/ .el-table .el-table__body-wrapper .warning-max td:nth-child(2){
        background: #F56C6C;
        border-bottom: 1px solid #F56C6C;
      }
      .el-button {
        height: 30px;
        width: 105px;
        padding: 8px 15px;
        margin-left: 20px;
      }
      .el-button:nth-child(1) {
        margin-left: 0;
      }
      .block {
        margin-top: 30px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .dialog {
      /deep/ .el-dialog {
        min-width:670px;
      }
      .col {
        text-align:center;
      }
    }
    .alertNotice {
      /deep/ .el-dialog {
        min-width:540px;
      }
    }
  }
  .cursor{cursor:pointer;}
</style>
