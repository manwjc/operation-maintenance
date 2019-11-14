<template>
  <div class="component-container">
    <div>
      <el-row>
        <el-col :span="12">
          <div >
            <span style="padding-right: 5px;">采集时间范围</span>
            <span>
               <el-date-picker
                 v-model="time_range"
                 type="daterange"
                 range-separator="至"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期"
                 class="time-range"
                 value-format="yyyy-MM-dd">
              </el-date-picker>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div  >
            <span style="padding-right: 5px;">发件时间范围</span>
            <span>
               <el-date-picker
                 v-model="send_time_range"
                 type="daterange"
                 range-separator="至"
                 start-placeholder="开始日期"
                 end-placeholder="结束日期"
                 class="time-range"
                 value-format="yyyy-MM-dd">
              </el-date-picker></span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="12">
          <div >
            <span style="padding-right: 5px;">邮件标题</span>
            <span>
               <el-input v-model="title_include" placeholder="请输入内容" class="input-tem-name1" style="width:375px;" clearable></el-input>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div  >
            <span style="padding-right: 5px;">邮件内容</span>
            <span>
              <el-input v-model="content_include" placeholder="请输入内容" class="input-tem-name1" style="width:375px;" clearable></el-input>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px;">
        <el-col :span="12">
          <div >
            <span style="padding-right: 5px;">告警编号</span>
            <span>
               <el-input v-model="alert_id" placeholder="请输入内容" class="input-tem-name1" style="width:375px;" clearable></el-input>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div >
            <el-button class="tem-search" type="primary" @click="search">查询</el-button>
            <el-button class="tem-search" style="width: auto"  @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

      <el-table
        :data="tableData"
        border
        style="width: 100%;margin-top:15px">
        <el-table-column
          prop="resolve_time"
          label="采集时间"
          align="center">
          <template slot-scope="scope">
            {{getDataStr(scope.row.resolve_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="mail_content"
          label="邮件信息"
          align="center">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6">
                发件人：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.mail_sender}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                邮件标题：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.mail_title}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                发送时间：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.mail_send_time | formatDateStr}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                邮件内容：
              </el-col>
              <el-col :span="18" style="text-align: left" v-html="scope.row.mail_content"></el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="moni_index"
          label="解析信息"
          align="center">
          <template slot-scope="scope">
            <el-row >
              <el-col :span="6">
                设备IP：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.device_ip}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                告警时间：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.resolve_time | formatDateStr}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                告警指标：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.moni_object}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                告警描述：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{scope.row.moni_index}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                告警级别：
              </el-col>
              <el-col :span="18" style="text-align: left">
                {{alert_level_obj[scope.row.alert_level]}}
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          prop="alert_id"
          label="关联告警"
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

    </div>
</template>

<script>
  import moment from 'moment'
  import {alert_level_obj} from 'src/pages/mirror_alert/alert_his/config/options.js'
  import rbEmailReceiverServicesFactory from 'src/services/alert/rb-emailReceiver-services.factory.js'
  import rbMirrorAlertStatus from 'src/pages/mirror_alert/common/rb-mirror-alert-status.vue'
  export default {
    components: {
      rbMirrorAlertStatus
    },
    data () {
      return {
        filter_id: '',
        alert_level_obj: alert_level_obj,
        time_range: [],
        send_time_range: [],
        title_include: '',
        content_include: '',
        alert_id: '',
        tableData: [],
        currentPage: 1, // 当前页
        pageSize: 30, // 分页每页多少行数据
        pageSizes: [30, 50, 100], // 每页多少行数组
        total: 0 // 总共多少行数据
      }
    },
    mounted () {
      this.filter_id = this.$route.query.filter_id
      this.search()
    },
    filters: {
      formatDateStr (timestamp) {
        return timestamp ? moment(timestamp).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    },
    methods: {
      getDataStr (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
      },
      reset () {
        this.time_range = []
        this.send_time_range = []
        this.content_include = ''
        this.title_include = ''
        this.alert_id = ''
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
        let page = {
          page_no: this.currentPage,
          page_size: this.pageSize,
          mail_content: this.content_include,
          mail_title: this.title_include,
          sort_name: 'resolve_time',
          alert_id: this.alert_id,
          filter_id: this.filter_id
        }
        if (this.time_range !== null && this.time_range.length > 1) {
          page.gather_time_range_start = this.time_range[0]
          page.gather_time_range_end = this.time_range[1]
        }
        if (this.send_time_range !== null && this.send_time_range.length > 1) {
          page.send_time_range_start = this.send_time_range[0]
          page.send_time_range_end = this.send_time_range[1]
        }
        rbEmailReceiverServicesFactory.getFilterRecords(page).then((res) => {
          this.tableData = res.result
          this.total = res.count
        }).catch(() => {
          this.$message.error('查询失败')
        })
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
    .my-error-tip {
      color: #ff4949;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
    }
    .data-filter-error {
      top: 37px;
    }
  }
  .cursor{cursor:pointer;}
  .el-row{margin-bottom: 0px;}
</style>
