<template>
  <div>
    <div>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :span="5"><div><span>衍生告警记录数:{{total}}</span></div></el-col>
        <el-col :span="15">
          <div>
            <span>告警时间范围:</span>
            <span><el-date-picker v-model="cur_moni_time_from" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></span>
            <span>至</span>
            <span><el-date-picker v-model="cur_moni_time_to" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" size="mini" style="width: 150px"></el-date-picker></span>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-button type="primary"  size="mini" plain @click="search()">查询</el-button>
            <el-button type="primary"  size="mini" plain @click="reset()">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- table -->
    <div class="yw-el-table-wrap">
      <el-table class="yw-el-table"
                :data="result"
                style="width: 100%;margin-top:15px;"
                height="calc(100vh - 300px)"
                stripe
                border tooltip-effect="dark">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="告警归属设备"
                         width="100">
          <template slot-scope="scope">
            <a>{{scope.row.deviceIp}}</a>
          </template>
        </el-table-column>
        <el-table-column label="告警等级"
                         width="80">
          <template slot-scope="scope">
            <rb-mirror-alert-status :mode="'list'"
                                    :status="scope.row.alertLevel"></rb-mirror-alert-status>
          </template>
        </el-table-column>
        <el-table-column label="告警内容"
                         width="300">
          <template slot-scope="scope">
            {{scope.row.moniIndex}}
          </template>
        </el-table-column>
        <el-table-column label="当前告警时间"
                         width="140">
          <template slot-scope="scope">
            {{scope.row.curMoniTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="告警开始时间"
                         width="140">
          <template slot-scope="scope">
            {{scope.row.alertStartTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="告警归属资源池"
                         width="120">
          <template slot-scope="scope">
            {{scope.row.idcType}}
          </template>
        </el-table-column>
        <el-table-column label="告警来源"
                         width="80">
          <template slot-scope="scope">
            {{scope.row.source}}
          </template>
        </el-table-column>
        <el-table-column label="业务系统"
                         width="160">
          <template slot-scope="scope">
            {{scope.row.bizSys}}
          </template>
        </el-table-column>
        <el-table-column label="机房"
                         width="120">
          <template slot-scope="scope">
            {{scope.row.sourceRoom}}
          </template>
        </el-table-column>
        <el-table-column label="告警设备名称"
                         width="100">
          <template slot-scope="scope">
            {{scope.row.hostName}}
          </template>
        </el-table-column>
        <el-table-column label="设备分类"
                         width="100">
          <template slot-scope="scope">
            {{scope.row.deviceClass}}
          </template>
        </el-table-column>
        <el-table-column label="设备类型"
                         width="100">
          <template slot-scope="scope">
            {{scope.row.deviceType}}
          </template>
        </el-table-column>
        <el-table-column label="衍生时间"
                         width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="是否消除"
                         width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.alertType === '1'">未消除</span>
            <span v-else-if="scope.row.alertType === '2'">已消除</span>
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
  </div>
</template>
<script>
  import {detail_his} from 'src/pages/mirror_alert/alert/config/options.js'
  import rbAlertPrimarySecondaryServiceFactory from 'src/services/alert/rb-alert-primary-secondary-service.factory'
  export default {
    components: {
      rbMirrorAlertStatus: () => import('src/pages/mirror_alert/common/rb-mirror-alert-status.vue')
    },
    props: [
      'alertId'
    ],
    data () {
      return {
        alert_id: '',
        result: [],
        detail_his: [],
        currentPage: 1, // 当前页
        pageSize: 50, // 分页每页多少行数据
        pageSizes: [20, 50, 100], // 每页多少行数组
        total: 0, // 总共多少行数据
        cur_moni_time_from: '',
        cur_moni_time_to: ''
      }
    },
    mounted: function () {
      this.start()
    },
    methods: {
      // 分页改变尺寸
      handleSizeChange (val) {
        this.pageSize = val
        this.init_()
      },
      // 分页改变当前页
      handleCurrentChange (val) {
        this.currentPage = val
        this.init_()
      },
      getRequest () {
        let req = {
          'pageNum': this.currentPage,
          'pageSize': this.pageSize,
          'primarySecondaryTimeFrom': this.cur_moni_time_from,
          'primarySecondaryTimeTo': this.cur_moni_time_to
        }
        return req
      },
      init_ () {
        if (this.alertId) {
          let obj = this.getRequest()
          obj.primarySecondaryAlertId = this.alertId
          rbAlertPrimarySecondaryServiceFactory.getprimarySecondaryAlertList(obj).then((res) => {
            this.total = res.count
            this.result = res.result
          })
        }
      },
      start () {
        this.detail_his = detail_his
        this.init_()
      },
      search () {
        this.init_()
      },
      reset () {
        this.cur_moni_time_from = ''
        this.cur_moni_time_to = ''
      }
    },
    watch: {
      obj: {
        handler: function () {
          this.start()
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  /deep/ .el-table {
    overflow: auto;
    .el-table__body-wrapper {
      overflow: auto !important;
    }
  }
</style>
