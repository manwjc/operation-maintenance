<template>
  <div class="components-container">
    <!-- 监控信息 -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">1</i>监控信息</h1>
      <div class="dashboard-content">
        <el-row>
          <el-col :span="8"><span>设备IP:</span><span style="padding-left:10px;">{{device_ip}}</span></el-col>
          <el-col :span="8"><span>归属代理IP:</span><span style="padding-left:10px;">{{agent_ip}}</span></el-col>
          <el-col :span="8"><span>监控对象:</span><span style="padding-left:10px;">{{monit_obj}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><span>监控指标名称:</span><span style="padding-left:10px;">{{metric_name}}</span></el-col>
          <el-col :span="8"><span>监控指标key:</span><span style="padding-left:10px;">{{metric_key}}</span></el-col>
          <el-col :span="8"><span>监控周期:</span><span style="padding-left:10px;">{{monit_period}}</span></el-col>
        </el-row>
      </div>
    </section>
    <!-- 监控信息 -->

    <!-- 触发器信息 -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">2</i>触发器信息</h1>
      <div class="dashboard-content">
        <el-table class="yw-el-table"
                  :data="triggerData"
                  height="158"
                  style="width: 100%;"
                  stripe
                  tooltip-effect="dark"
                  border>
          <el-table-column v-for="item in trigger_gen"
                           :key="item.prop"
                           :prop="item.prop"
                           :label="item.label"
                           align="center">

          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size="pageSize"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </section>
    <!-- 触发器信息 -->

    <!-- 监控信息 -->
    <section class="dashboard-section">
      <h1 class="dashboard-title"><i class="dashboard-icon">3</i>监控项数据</h1>
      <div class="dashboard-content">
        <el-form class="yw-form"
                 :inline="true">
          <el-form-item label="时间范围">
            <el-date-picker v-model="time_range"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            class="time-range"
                            value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary"
                       size="mini"
                       plain
                       @click="query()">查询</el-button>
          </el-form-item>
        </el-form>
        <div>
          <div class="empty-wrap"
               v-if="processorData.length === 0">暂无数据</div>
          <div v-else
               ref="processorLines"
               :style="canvasWidth"></div>
        </div>
      </div>
    </section>
    <!-- 监控信息 -->
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/theme/macarons.js'
import rbAlertServiceFactory from 'src/services/alert/rb-alert-services.factory.js'
import { alert_level } from 'src/pages/mirror_alert/alert/config/options.js'
import _ from 'underscore'
import moment from 'moment'
import ElForm from "../../../../node_modules/element-ui/packages/form/src/form.vue";
export default {
  components: {ElForm},
  props: ['obj'],
  data () {
    return {
      params: { 'itemId': this.obj.item_id, 'prefix': this.obj.prefix },
      triggerData: [],
      trigger_gen: [{
        label: '触发器名称',
        prop: 'trigger_name'
      }, {
        label: '表达式',
        prop: 'expression'
      }, {
        label: '告警等级',
        prop: 'alert_level'
      }],
      time_range: [new Date(moment().get('year'), moment().get('month'), 1), new Date()],
      currentPage: 1, // 当前页
      pageSize: 50, // 分页每页多少行数据
      pageSizes: [20, 50, 100], // 每页多少行数组
      total: 0, // 总共多少行数据
      canvasWidth: 'width: 100%;height: 400px',
      processorChart: null,
      device_ip: null,
      agent_ip: null,
      monit_obj: null,
      metric_name: null,
      metric_key: null,
      monit_period: null,
      processorOption: {
        title: {
          text: 'Processor load (5 min average per core)'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      processorData: [],
      processorLineConfig: [
        {
          name: '最大值',
          key: 'valueMax',
          color: '#ff0036'
        }, {
          name: '最小值',
          key: 'valueMin',
          color: '#ff7e00'
        }, {
          name: '平均值',
          key: 'valueAvg',
          color: '#38b9ec'
        }
      ]
    }
  },
  mounted: function () {
    this.triggerInit()
  },
  methods: {
    // 分页改变尺寸
    handleSizeChange (val) {
      this.pageSize = val
      this.getTable(this.getParam('getTable'))
    },
    // 分页改变当前页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTable(this.getParam('getTable'))
    },
    getInfo: function (params) {
      let _this = this
      rbAlertServiceFactory.getAlertMonitInfo(params).then((res) => {
        let item = (res && res.result && res.result.length > 0) ? res.result[0] : {}
        _this.device_ip = item.ip ? item.ip : ''
        _this.agent_ip = item.proxyName ? item.proxyName : ''
        _this.monit_obj = item.moniObject ? item.moniObject : ''
        _this.metric_name = item.name ? item.name : ''
        _this.metric_key = item.key ? item.key : ''
        _this.monit_period = item.delay ? item.delay : ''
      })
    },
    getTable: function (params) {
//      _.extend(params, {
//        'pageNum': this.currentPage,
//        'pageSize': this.pageSize
//      })
      rbAlertServiceFactory.getTriggerInfo(params).then((res) => {
        this.total = res.count
        let items = (res && res.result && res.result.length > 0) ? res.result : []
        let _this = this
        this.triggerData = []
        _.each(items, function (item) {
          _this.triggerData.push({
            trigger_name: item.description,
            expression: item.expression,
            alert_level: function () {
              let level = _.findWhere(alert_level, { value: item.priority })
              return level ? level.label : ''
            }()
          })
        })
      })
    },
    getChart: function (params) {
      let _this = this
//      _.extend({
//        'startTime': this.time_range ? moment(this.time_range[0]).unix() : '',
//        'endTime': this.time_range ? moment(this.time_range[1]).unix() : ''
//      }, params)
      rbAlertServiceFactory.getProcessLoad(params).then((res) => {
        if (res && res.length > 0) {
          _this.processorData = _.sortBy(res, 'clock')
          let xAxis = _.chain(_this.processorData).pluck('clock').map(function (num) {
            return moment.unix(num).format('YYYY-MM-DD HH:mm:ss')
          }).value()
          _this.processorOption.xAxis.data = xAxis
          _this.processorOption.series = []
          _.each(_this.processorLineConfig, function (config) {
            let serie = {
              name: config.name,
              type: 'line',
              itemStyle: {
                normal: {
                  color: config.color,
                  lineStyle: {
                    color: config.color
                  }
                }
              },
              data: _.pluck(_this.processorData, config.key)
            }
            _this.processorOption.series.push(serie)
          })
          if (!this.processorChart) {
            this.processorChart = echarts.init(this.$refs['processorLines'], 'macarons')
          }
          _this.processorChart.clear()
          _this.processorChart.setOption(_this.processorOption)
          window.onresize = _this.processorChart.resize
        } else {
          this.processorData = []
        }
      })
    },
    getParam(val) {
      let param = {}
      param.itemId = this.obj.item_id
      param.prefix = this.obj.prefix
      if (val === 'getTable') {
        param.pageNum = this.currentPage
        param.pageSize = this.pageSize
      } else if (val === 'getChart') {
        param.startTime = this.time_range ? moment(this.time_range[0]).unix() : ''
        param.endTime = this.time_range ? moment(this.time_range[1]).unix() : ''
      }
      return param
    },
    triggerInit() {
      if (this.obj.item_id && this.obj.item_id !== 'undefined') {
        // 查询监控信息
        this.getInfo(this.getParam('getInfo'))
        // 查询数据，渲染表格
        this.getTable(this.getParam('getTable'))
        // 查询数据，渲染折线图
        this.getChart(this.getParam('getChart'))
      }
    }
  },
  watch: {
    obj: {
      handler: function () {
        this.triggerInit()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.components-container {
  height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
  .empty-wrap {
    margin-top: 10px;
  }
  .dashboard-section {
    margin-bottom: 10px;
  }
  /deep/ .form-monitor.yw-form {
    .el-form-item {
      margin-right: 18px;
      .el-form-item__label {
        width: 84px;
      }
      .el-form-item__content {
        width: 120px;
      }
    }
  }
}
</style>
