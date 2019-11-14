<template>
  <!-- 设备告警 -->
  <div class="content-chart"
       style="width: 32.5%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <!-- <el-radio-group class="yw-radio-button-wrap fr"
                      v-if="chartData.filterType && chartData.filterType.indexOf('tab') > -1"
                      v-model="chartData.activeFilter"
                      @change="changeTab">
        <el-radio-button :label="tabItem.name"
                         v-for="(tabItem,tabIndex) in chartData.filter"
                         :key="tabIndex">{{tabItem.name}}</el-radio-button>
      </el-radio-group> -->
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-tabs class="yw-tabs chart-filter-item"
                 v-model="chartData.activeFilter"
                 @tab-click="changeTab">
          <el-tab-pane :label="tabItem.label"
                       :name="tabItem.name"
                       v-for="(tabItem,tabIndex) in chartData.filter"
                       :key="tabIndex">
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
             style="width:100%"
             v-for="(subItem,subIndex) in chartData.chartList"
             :key="subIndex"
             :id="subItem.id"></div>
      </div>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>
import echarts from 'echarts'
import DrawChart from '../utils/drawChart.js'
import rbAlertServicesFactory from 'src/services/alert/rb-alert-services.factory.js'

export default {
  mixins: [DrawChart],
  data () {
    return {
      chartData: {
        id: "001",
        name: '设备告警',
        filterType: ['tab'],
        filter: [{ name: '-1', label: '全部' }, { name: '0', label: '活动告警' }, { name: '1', label: '确认告警' }, { name: '3', label: '解决告警' }],
        activeFilter: '-1',
        chartList: [{ id: '001', chartOption: 'barAlert', chartDatas: '' }],
      }
    }
  },
  methods: {
    //图表查询
    queryCharts (obj) {
      this.$nextTick(() => {
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        myChart.clear();
        myChart.setOption(this.getOption(obj), true);
        //保存echart对象实例
        if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
          this.chartNodeMap[this.chartData.chartList[0].id] = myChart
        }
      })
    },
    changeTab () {
      let code = this.chartData.activeFilter === '-1' ? '0,1' : this.chartData.activeFilter
      this.getAlertSummaryByDeviceClass(code)
    },
    getAlertSummaryByDeviceClass (code) {
      rbAlertServicesFactory.getAlertSummaryByDeviceClass(code).then((res) => {
        this.queryCharts(this.getParams(res))
      }).catch((e) => {
        //请求错误的数据处理
        this.queryCharts(this.getParams({}))
      }).finally((res) => {
        //
      })
    },
    getParams (obj) {
      let res = {}
      res.id = this.chartData.chartList[0].id
      res.chartOption = this.chartData.chartList[0].chartOption
      res.chartDatas = obj
      return res
    },
    deviceAlertStart () {
      this.getAlertSummaryByDeviceClass('0,1')
    }
  },
  mounted () {
    this.deviceAlertStart()
    this.handleChartResize()
  },
  beforeDestroy () {
    this.clearChartResize()
  }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

