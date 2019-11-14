<template>
  <!-- 工单趋势 -->
  <div class="content-chart"
       style="width: 32.5%;height:300px;">
    <section class="chart-title-wrap  clearfix">

      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-select class="chart-filter-item"
                   v-model="chartData.filter.curSelect"
                   @change="changeTab(chartData.filter.curSelect)"
                   style="width:72px;"
                   placeholder="请选择">
          <el-option v-for="item in chartData.filter.selectOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker class="chart-filter-item"
                        v-model="dates"
                        type="daterange"
                        @change="search(dates)"
                        style="width:174px;"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
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
import rbBpmServiceFactory from 'src/services/bpm/rb-bpm-services.factory.js'

export default {
  mixins: [DrawChart],
  data () {
    return {
      chartData: {
        id: "003",
        name: '工单趋势',
        filter: { curSelect: '1', selectOptions: [{ label: '全部', value: '1' }, { label: '我的', value: '0' }] },
        filterType: ['date'],
        // filter: { date: '' },
        chartList: [{ id: '003', chartOption: 'lineTrend', chartDatas: {} }],
      },
      dates: []
    }
  },
  methods: {
    //图表查询
    queryCharts () {

      this.$nextTick(() => {
        this.instTrend(this.dates);
        // let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        // myChart.clear();
        // myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
      })
    },
    instTrend (dates) {
      let timeStart;
      let timeEnd;
      if (dates !== null && this.dates.length > 1) {
        timeStart = this.dates[0]
        timeEnd = this.dates[1]
      } else {
        timeEnd = new Date();
        timeStart = new Date(timeEnd.getTime() - 144 * 60 * 60 * 1000);
      }
      let dateStart = timeStart.getFullYear() + '-' + (timeStart.getMonth() + 1) + '-' + timeStart.getDate()
      let dateEnd = timeEnd.getFullYear() + '-' + (timeEnd.getMonth() + 1) + '-' + timeEnd.getDate()
      let isWhole = this.chartData.filter.curSelect
      rbBpmServiceFactory.instTrend(dateStart, dateEnd, isWhole).then((res) => {
        let dateStrs = []
        let alls = []
        let ends = []
        let overdues = []
        res.forEach(item => {
          dateStrs.push(item.dateStr)
          alls.push(item.all)
          ends.push(item.end)
          overdues.push(item.overdue)
        })
        let data = { 'dateStrs': dateStrs, 'alls': alls, 'ends': ends, 'overdues': overdues }
        this.chartData.chartList[0].chartDatas = data;
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        myChart.clear();
        myChart.setOption(this.getOption(this.chartData.chartList[0]), true);

        //保存实例
        if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
          this.chartNodeMap[this.chartData.chartList[0].id] = myChart
        }

      }).catch((e) => {
        //
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        myChart.clear();
        myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
        //保存实例
        if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
          this.chartNodeMap[this.chartData.chartList[0].id] = myChart
        }
      })
    },
    changeTab (value) {
      this.instTrend(this.dates)
    },
    search (dates) {
      if (this.dates !== null && this.dates.length > 1) {
        this.instTrend(this.dates)
      }
    },
  },

  mounted () {
    this.queryCharts();
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

