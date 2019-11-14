<template>
  <!-- 工单分布 -->
  <div class="content-chart"
       style="width: 32.5%;height:300px;">
    <section class="chart-title-wrap  clearfix">
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-select class="chart-filter-item"
                   v-model="chartData.filter1.curSelect"
                   @change="changeTab1(chartData.filter1.curSelect)"
                   style="width:72px;"
                   placeholder="请选择">
          <el-option v-for="item in chartData.filter1.selectOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select class="chart-filter-item"
                   v-model="chartData.filter.curSelect"
                   @change="changeTab2(chartData.filter.curSelect)"
                   style="width:72px;"
                   placeholder="请选择">
          <el-option v-for="item in chartData.filter.selectOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
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
      type: 1,
      chartData: {
        id: "002",
        name: '工单分布',
        filterType: ['tab'],
        filter: { curSelect: '1', selectOptions: [{ label: '所有', value: '1' }, { label: '待处理', value: '0' }] },
        filter1: { curSelect: '1', selectOptions: [{ label: '全部', value: '1' }, { label: '我的', value: '0' }] },
        activeFilter: '全部',
        chartList: [{ id: '002', chartOption: 'pieDistribute', chartDatas: [] }],
      }
    }
  },
  methods: {
    //图表查询
    queryCharts () {

      this.$nextTick(() => {
        this.instDistribution();
        // let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        // myChart.clear();
        // myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
      })
    },
    instDistribution () {
      let isWhole = this.chartData.filter1.curSelect
      let type = this.chartData.filter.curSelect
      rbBpmServiceFactory.instDistribution(type, isWhole).then((res) => {
        res.forEach(item => {
          this.chartData.chartList[0].chartDatas.push({ 'value': item.count, 'name': item.procDefName })
        })
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        myChart.clear();
        myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
        //保存echart对象实例
        if (!this.chartNodeMap[this.chartData.chartList[0].id]) {
          this.chartNodeMap[this.chartData.chartList[0].id] = myChart
        }
      }).catch((e) => {
        //请求错误的数据处理
        let myChart = echarts.init(document.getElementById(this.chartData.chartList[0].id));
        myChart.clear();
        myChart.setOption(this.getOption(this.chartData.chartList[0]), true);
      })
    },
    changeTab1 (value) {
      // if (tableName == '全部') {
      //   this.type = 1;
      // } else {
      //   this.type = 0;
      // }
      this.chartData.chartList[0].chartDatas = []
      this.instDistribution();
    },
    changeTab2 (value) {
      this.chartData.chartList[0].chartDatas = []
      this.instDistribution();
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

