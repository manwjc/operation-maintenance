<template>
  <div class="components-container yw-dashboard">
    <el-form class="components-condition yw-form"
             :inline="true"
             label-width="60px">
      <el-form-item label="值班月份">
        <el-date-picker v-model="month"
                        type="month"
                        placeholder="选择月"
                        value-format="yyyy-MM"
                        :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form-item label="值班人员">
        <el-select v-model="user"
                   placeholder="请选择"
                   filterable>
          <el-option v-for="item in userList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="search()">查询</el-button>
        <!-- <el-button @click="search()">重置</el-button> -->
      </section>
    </el-form>

    <el-form class="yw-form">
      <div class="table-operate-wrap clearfix">
        <el-button class="btn-icons-wrap"
                   type="text"
                   icon="el-icon-setting"
                   @click="addLogBookConfig=true">值班设置</el-button>
      </div>
      <div class="yw-el-table-wrap">
        <el-table class="yw-el-table"
                  :data="tabledata"
                  stripe
                  tooltip-effect="dark"
                  border
                  height="calc(100vh - 240px)"
                  v-loading="loading">
          <el-table-column prop="date"
                           label="日期"></el-table-column>
          <el-table-column label="白班(09:00-18:00)">
            <template slot-scope="scope">
              <a v-if="scope.row.isB"
                 type="text"
                 @click="getWorkLogDetail(scope.row,1)">查看值班日志</a>
              <a v-else
                 type="text">无值班日志</a>
            </template>
          </el-table-column>
          <el-table-column label="夜班(18:00-09:00)">
            <template slot-scope="scope">
              <a v-if="scope.row.isH"
                 type="text"
                 @click="getWorkLogDetail(scope.row,2)">查看值班日志</a>
              <a v-else
                 type="text">无值班日志</a>
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
    </el-form>

    <!-- dialog -->
    <el-dialog class="yw-dialog"
               :visible.sync="addLogBookConfig"
               width="400px"
               style="height:300px"
               title="值班时间设置"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="50px"
                 :inline="true">
          <el-form-item label="白班">
            <el-time-select v-model="bStartTime"
                            :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }"
                            :clearable="false"
                            @change="change('bStartTime')"
                            placeholder="选择时间"
                            style="width: 110px"></el-time-select> -
            <el-time-select v-model="bEndTime"
                            :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }"
                            :clearable="false"
                            @change="change('bEndTime')"
                            placeholder="选择时间"
                            style="width: 110px"></el-time-select>

          </el-form-item>
          <el-form-item label="夜班">
            <el-time-select v-model="hStartTime"
                            :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }"
                            :clearable="false"
                            @change="change('hStartTime')"
                            placeholder="选择时间"
                            style="width: 110px"></el-time-select> -
            <el-time-select v-model="hEndTime"
                            :picker-options="{ start: '00:00', step: '01:00', end: '23:00' }"
                            :clearable="false"
                            @change="change('hEndTime')"
                            placeholder="选择时间"
                            style="width: 110px"></el-time-select>

          </el-form-item>
        </el-form>
      </section>
      <section class="btn-wrap">
        <el-button type="primary"
                   @click="submit()">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </section>
    </el-dialog>

    <el-dialog class="yw-dialog"
               :visible.sync="workLogDetail"
               width="500px"
               title="详情"
               :close-on-click-modal="false">
      <section class="yw-dialog-main">
        <el-form class="yw-form"
                 label-width="70px"
                 :inline="true">
          <el-form-item label="值班时间">
            <span class="text-inline">{{uuidData.workDate}}</span>
            <span class="text-inline">{{uuidData.workName}}</span>
            <span class="text-inline">{{uuidData.work}}</span>
            <span>{{uuidData.workTime}}</span>
          </el-form-item>
          <el-form-item label="日志内容">
            <div>告警已处理事项</div>
            <div>
              <span>1.告警总数{{uuidData.alertSumCount}}条：</span>
              <span>重大({{uuidData.alertSeriousCount}})条,</span>
              <span>高({{uuidData.alertHighCount}})条,</span>
              <span>中({{uuidData.alertMediumCount}})条,</span>
              <span>低({{uuidData.alertLowCount}})条,</span>
            </div>
            <div><span>2.告警派单：</span><span>告警工单({{uuidData.alertOrderCount}})条</span></div>
            <div><span>3.告警通知：</span><span>告警通知({{uuidData.alertNotifyCount}})条</span></div>
            <div><span>4.告警转派：</span><span>告警转派({{uuidData.alertTransferCount}})条</span></div>
            <div><span>5.告警确认：</span><span>告警确认({{uuidData.alertConfirmCount}})条</span></div>
            <div><span>6.告警清除：</span><span>告警清除({{uuidData.alertClearCount}})条</span></div>
          </el-form-item>
        </el-form>
      </section>

    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import QueryObject from 'src/utils/queryObject.js'
import rbProjectDataServiceFactory from 'src/services/template/rb-template-services.factory.js'
import rbAlertWorkLogFactory from 'src/services/alert/rb-alert-work-log.factory.js'
export default {
  name: '/mirror_alert/logbook',
  mixins: [QueryObject],
  components: {
    YwPagination: () => import('src/components/common/yw-pagination.vue'),
  },
  data () {
    return {
      user: sessionStorage.getItem('username'),
      userList: [],
      month: '',
      tabledata: [],
      addLogBookConfig: false,
      uuid: '',
      bStartTime: '09:00',
      bEndTime: '18:00',
      hStartTime: '18:00',
      hEndTime: '09:00',
      workLogDetail: false,
      uuidData: {},
      loading: true
    }
  },
  mounted () {
    this.getUserList()
    this.getAlertWorkConfig()
    this.search()
  },
  methods: {
    // 用户列表
    getUserList () {
      const namespace = sessionStorage.getItem('namespace')
      let arr = [namespace, {
        order_by: '-createTime',
        page_size: -1
      }]
      rbProjectDataServiceFactory.getUserList(arr).then((res) => {
        res.result.forEach((item) => {
          let obj = {
            'id': item.username,
            'name': item.name
          }
          this.userList.push(obj)
        })
      })
    },
    getAlertWorkConfig () {
      rbAlertWorkLogFactory.getAlertWorkConfig().then((res) => {
        this.uuid = res ? res.uuid : ''
        this.bStartTime = res ? res.dayStartTme : '09:00'
        this.bEndTime = res ? res.dayEndTme : '18:00'
        this.hStartTime = res ? res.nightStartTme : '18:00'
        this.hEndTime = res ? res.nightEndTme : '09:00'
      })
    },
    search () {
      if (!this.month) {
        let y = new Date().getFullYear()
        let m = parseInt(new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
        this.month = y + '-' + m
      }
      let req = {
        'workName': this.user ? this.user : '',
        'workMonth': this.month
      }
      this.loading = true
      rbAlertWorkLogFactory.getWorkLogList(req).then((res) => {
        this.loading = false
        this.tabledata = res
      }).catch(() => {
        this.loading = false
      })
    },
    submit () {
      if (this.bEndTime < this.bStartTime) {
        this.$alert('白班的时间段有误,请重新选择!', {
          confirmButtonText: '确定'
        })
        return
      }
      let obj = {
        'uuid': this.uuid ? this.uuid : '',
        'dayStartTme': this.bStartTime,
        'dayEndTme': this.bEndTime,
        'nightStartTme': this.hStartTime,
        'nightEndTme': this.hEndTime
      }
      rbAlertWorkLogFactory.createdAlertWorkConfig(obj).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '配置成功!',
            type: 'success'
          })
        } else {
          this.$message.error('配置失败!')
        }
      })
      this.addLogBookConfig = false
    },
    cancel () {
      this.addLogBookConfig = false
      this.getAlertWorkConfig()
    },
    getWorkLogDetail (obj, work) {
      let req = {
        'workName': obj.workName,
        'workDate': obj.workDate,
        'workTime': work === 1 ? obj.dayTime : obj.nightTime,
        'work': work
      }
      rbAlertWorkLogFactory.getWorkLogInfo(req).then((res) => {
        this.uuidData = res
        this.uuidData['workDate'] = obj.date
        this.workLogDetail = true
      })
    },
    change (val) {
      if (val === 'bStartTime') {
        this.hEndTime = this.bStartTime
      }
      if (val === 'bEndTime') {
        this.hStartTime = this.bEndTime
      }
      if (val === 'hStartTime') {
        this.bEndTime = this.hStartTime
      }
      if (val === 'hEndTime') {
        this.bStartTime = this.hEndTime
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .components-condition {
  padding-right: 66px;
}
.yw-dialog {
  .yw-form {
    .text-inline {
      margin-right: 15px;
    }
  }
}
</style>
