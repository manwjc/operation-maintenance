<template>
  <!-- 工单统计 -->
  <div class="content-chart"
       style="width: 32.5%;height:300px;">
    <section class="chart-title-wrap  clearfix">
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-select class="chart-filter-item"
                   v-model="chartData.filter1.curSelect"
                   @change="changeKey1(chartData.filter1.curSelect)"
                   style="width:72px;"
                   placeholder="请选择">
          <el-option v-for="item in chartData.filter1.selectOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-select class="chart-filter-item"
                   v-model="chartData.filter.curSelect"
                   @change="changeKey(chartData.filter.curSelect)"
                   style="width:72px;"
                   placeholder="请选择">
          <el-option v-for="item in chartData.filter.selectOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-date-picker class="date-select chart-filter-item"
                        v-model="dates"
                        type="daterange"
                        @change="changeDate(dates)"
                        style="width:174px;"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"></el-date-picker>
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
        id: '005',
        name: '工单统计',
        filterType: ['select', 'date'],
        filter: { curSelect: '0', selectOptions: [{ label: '所有', value: '0' }], date: '' },
        filter1: { curSelect: '1', selectOptions: [{ label: '全部', value: '1' }, { label: '我的', value: '0' }] },
        chartList: [{ id: '005', chartOption: 'barAndlineStatis', chartDatas: {} }]
      },
      dates: []
      // defKey: '0'
    }
  },
  methods: {
    // 查询所有工单类型
    listJson () {
      let pageBean = { 'page': 1, 'pageSize': 100, 'showTotal': true }
      let param = { 'pageBean': pageBean }
      rbBpmServiceFactory.listJson(param).then((res) => {
        let rows = res.rows
        rows.forEach(item => {
          this.chartData.filter.selectOptions.push({ 'label': item.name, 'value': item.defKey })
        })
      })
      console.log(2222, this.chartData.filter.selectOptions)
    },
    // 查询所有工单类型
    listJson2 () {
      let pageBean = { 'page': 1, 'pageSize': 100, 'showTotal': true }
      let param = { 'pageBean': pageBean }
      rbBpmServiceFactory.listJson(param).then((res) => {
        let rows = res.rows
        rows.forEach(item => {
          this.chartData.filter.selectOptions.push({ 'label': item.name, 'value': item.defKey })
        })
      })
      // console.log(2222, this.chartData.filter.selectOptions);
    },
    // 图表查询
    queryCharts () {
      this.$nextTick(() => {
        this.instStatistics()
        // let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        // myChart.clear();
        // myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
      })
    },

    instStatistics (dates) {
      let timeStart
      let timeEnd
      if (dates !== null && this.dates.length > 1) {
        timeStart = this.dates[0]
        timeEnd = this.dates[1]
      } else {
        timeEnd = new Date()
        timeStart = new Date(timeEnd.getTime() - 144 * 60 * 60 * 1000)
      }
      let dateStart = timeStart.getFullYear() + '-' + (timeStart.getMonth() + 1) + '-' + timeStart.getDate()
      let dateEnd = timeEnd.getFullYear() + '-' + (timeEnd.getMonth() + 1) + '-' + timeEnd.getDate()
      let isWhole = this.chartData.filter1.curSelect
      let defKey = this.chartData.filter.curSelect
      rbBpmServiceFactory.instStatistics(defKey, dateStart, dateEnd, isWhole).then((res) => {
        console.log('res', res)
        const dateStrs = []
        const alls = []
        const ends = []
        const overdues = []
        const rateList = []
        const rates = []
        const maxs = []
        const totals = []
        res.forEach((item) => {
          dateStrs.push(item.dateStr)
          alls.push(item.all)
          ends.push(item.end)
          overdues.push(item.overdue)
          if (item.all != 0) {
            rateList.push((item.end / item.all))
          } else {
            rateList.push(0)
          }
          let total = item.all + item.end + item.overdue
          totals.push(total)
        })
        rateList.forEach((item) => {
          let y = item.toString().indexOf('.') + 1
          let count = item.toString().length - y
          if (y > 0 && count > 2) {
            rates.push(Number(item).toFixed(2))
            // rates.push(Number(item*100).toFixed(1)+'%')
          } else {
            rates.push(Number(item))
            // rates.push(Number(item*100)+'%')
          }
        })
        let max = Math.max.apply(null, totals)
        totals.forEach((item) => {
          maxs.push(max)
        })
        let data = { 'dateStrs': dateStrs, 'alls': alls, 'ends': ends, 'overdues': overdues, 'maxs': maxs, 'rates': rates }
        this.chartData.chartList[0].chartDatas = data
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id))
        myChart.clear()
        myChart.setOption(this.getOption(this.chartData.chartList[0]), true)
        // 保存实例
        if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
          this.chartNodeMap[this.chartData.chartList[0].id] = myChart
        }
        let total = item.all + item.end + item.overdue
        totals.push(total)
      })
      rateList.forEach((item) => {
        let y = item.toString().indexOf('.') + 1
        let count = item.toString().length - y
        if (y > 0 && count > 2) {
          rates.push(Number(item).toFixed(2))
          // rates.push(Number(item*100).toFixed(1)+'%')
        } else {
          rates.push(Number(item))
          // rates.push(Number(item*100)+'%')
        }
      })
      let max = Math.max.apply(null, totals)
      totals.forEach((item) => {
        maxs.push(max)
      })
      let data = { 'dateStrs': dateStrs, 'alls': alls, 'ends': ends, 'overdues': overdues, 'maxs': maxs, 'rates': rates }
      this.chartData.chartList[0].chartDatas = data
      let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id))
      myChart.clear()
      myChart.setOption(this.getOption(this.chartData.chartList[0]), true)
      // 保存实例
      if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
        this.chartNodeMap[this.chartData.chartList[0].id] = myChart
      }
    },
    changeKey1 (isWhole) {
      this.instStatistics(this.dates)
    },
    changeKey (defKey) {
      this.instStatistics(this.dates)
    },
    changeTab () {

    },
    changeDate (dates) {
      if (this.dates !== null && this.dates.length > 1) {
        this.instStatistics(this.dates)
      }
    }
  },
  mounted () {
    this.listJson()
    this.queryCharts()
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

