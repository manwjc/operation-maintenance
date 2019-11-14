<template>
  <div>
    <div>
      <el-row :gutter="20" type="flex" justify="space-between">
        <el-col :span="5"><div><span>历史告警记录数:{{total}}</span></div></el-col>
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
      <el-table :data="detailData"
                style="width: 100%;margin-top:15px;"
                height="calc(100vh - 300px)"
                stripe tooltip-effect="dark"
                border
                class="yw-el-table">
        <el-table-column
          v-for="item in detail_his"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          align="center"></el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row.alert_id)"
              type="text"
              size="small">详情</el-button>
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
  import rbAlertKanBanServiceFactory from 'src/services/alert/rb-alert-kanban-services.factory.js'
  import {detail_his} from 'src/pages/mirror_alert/alert/config/options.js'
  import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'
  import {formatDate} from 'src/assets/js/utility/rb-filters.js'
  export default {
    components: {
    },
    props: [
      'obj', 'type'
    ],
    data () {
      return {
        alert_id: '',
        detailData: [],
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
      getRequest (obj) {
        let req = {
          'page_no': this.currentPage,
          'page_size': this.pageSize,
          'sort_name': 'cur_moni_time',
          'order': 'DESC',
          'curMoniTimeFrom': this.cur_moni_time_from,
          'curMoniTimeTo': this.cur_moni_time_to
//          'ip': obj.device_ip,
//          'alert_level': obj.alert_level,
//          'item_id': obj.item_id,
//          'source': obj.source,
//          'moni_object': obj.moni_object
        }
        return req
      },
      init_ () {
        if (this.obj.alert_id) {
          let obj = this.getRequest(this.obj)
          obj.ip = this.obj.device_ip
          obj.alert_level = this.obj.alert_level
          obj.item_id = this.obj.item_id
          obj.source = this.obj.source
          obj.moni_object = this.obj.moni_object
          rbAlertServicesFactory.getAlertHisList(obj).then((res) => {
            this.total = res.count
            let result = []
            if (this.total > 0) {
              res.result.forEach((item) => {
                let o = {}
                o.alert_id = item.alert_id
                o.alert_start_time = formatDate(item.alert_start_time)
                o.cur_moni_time = formatDate(item.cur_moni_time)
                o.alert_operation_type = item.alert_end_time ? '自动清除' : '人工清除'
                o.alert_operation_time = item.alert_end_time ? formatDate(item.alert_end_time) : formatDate(item.clear_time)
                result.push(o)
              })
            }
            this.detailData = result
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
      },
      handleClick (alert_id) {
        this.$router.push({
          path: '/mirror_alert/alert_his/his_detail',
          query: {
            alertId: alert_id,
            detailType: 'alertHis'
          }
        })
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
