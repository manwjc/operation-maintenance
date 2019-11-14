<template>
  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
             style="width:49%"
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
import ChartOption from 'src/utils/chartOption.js'
import DrawChart from 'src/utils/drawCharts.js'

export default {
  mixins: [DrawChart],
  data () {
    return {
      chartData: {
        name: '工单分析',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{ id: 'monitor-chart-pool-1', chartOption: 'bar-option', chartDatas: '' },
        { id: 'monitor-chart-pool-2', chartOption: 'bar-option', chartDatas: '' }],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {

      let params = {
        'idcType': this.conditionParams.poolActive,
        'startDate': this.conditionParams.dateRange[0],
        'endDate': this.conditionParams.dateRange[1],
        'deviceType': this.chartData.activeFilter,
        'sourceType': 'cpu',
      };
      this.$api.queryPoolRate(params).then((res) => {
        this.chartData.chartList[0].chartDatas = res;//对象
        this.drawCharts();
      })

      let params2 = {
        'idcType': this.conditionParams.poolActive,
        'startDate': this.conditionParams.dateRange[0],
        'endDate': this.conditionParams.dateRange[1],
        'deviceType': this.chartData.activeFilter,
        'sourceType': 'memory',
      };
      this.$api.queryPoolRate(params2).then((res) => {
        this.chartData.chartList[1].chartDatas = res;
        this.drawCharts();
      })
    },

    //绘制图表
    drawCharts () {
      this.$nextTick(() => {
        this.chartData.chartList.forEach((subItem, subIndex) => {
          let myChart = echarts.init(document.getElementById(subItem.id));
          myChart.clear();
          //数据格式处理
          let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
          let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));

          option.series[1] = JSON.parse(JSON.stringify(option.series[0]));
          option.series[2] = JSON.parse(JSON.stringify(option.series[0]));
          option.series[3] = JSON.parse(JSON.stringify(option.series[0]));

          option.series[0].name = '≥80%';
          option.series[1].name = '40%～80%';
          option.series[2].name = '15%～40%';
          option.series[3].name = '≤15%';

          option.legend.data = [option.series[0].name, option.series[1].name, option.series[2].name, option.series[3].name];
          option.series[1].itemStyle.color.colorStops = option.selfColors[1];
          option.series[2].itemStyle.color.colorStops = option.selfColors[2];
          option.series[3].itemStyle.color.colorStops = option.selfColors[3];

          if (Object.keys(chartDatas) && Object.keys(chartDatas).length > 0) {
            option.series[0].data = Object.values(chartDatas).map((item) => {
              return item['80']
            });
            option.series[1].data = Object.values(chartDatas).map((item) => {
              return item['40-80']
            });
            option.series[2].data = Object.values(chartDatas).map((item) => {
              return item['15-40']
            });
            option.series[3].data = Object.values(chartDatas).map((item) => {
              return item['15']
            });

            option.xAxis.data = Object.keys(chartDatas);
          } else {
            option.series[0].data = [0];
            option.series[1].data = [0];
            option.series[2].data = [0];
            option.series[3].data = [0];
            option.xAxis.data = ['暂无']
          }


          myChart.setOption(option);

          //resize自适应
          this.setResizeFun(myChart);
        })

      })
    },
    changeTab (val) {
      this.getDatas();
    },
  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

