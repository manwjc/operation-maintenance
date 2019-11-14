<template>
  <!-- 告警：告警Top10 -->
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
import ChartOption from 'src/utils/chartOption.js'
import DrawChart from 'src/utils/drawCharts.js'

export default {
  mixins: [DrawChart],
  data () {
    return {
      chartData: {
        name: '告警Top10',
        filter: [{ name: 'POD池', label: 'POD池' }, { name: '设备品牌', label: '设备品牌' }, { name: '设备类型', label: '设备类型' }],
        activeFilter: 'POD池',
        chartList: [{ id: 'alert-chart-top10-1', chartOption: 'bar-option', chartDatas: '' },
        ],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {

      // let params = {
      //   'idcType': this.conditionParams.poolActive,
      //   'startDate': this.conditionParams.dateRange[0],
      //   'endDate': this.conditionParams.dateRange[1],
      //   'deviceType': this.chartData.activeFilter,
      //   'sourceType': 'cpu',
      // };
      // this.$api.queryPoolRate(params).then((res) => {
      //   this.chartData.chartList[0].chartDatas = res;//对象
      //   this.drawCharts();
      // })
      this.chartData.chartList[0].chartDatas = [
        { name: '哈池POD1', value: 150 },
        { name: '哈池POD2', value: 120 },
      ]
      this.drawCharts();
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

          option.legend.show = false;
          option.yAxis[0].name = '告警量（个）';

          if (chartDatas && chartDatas.length > 0) {
            option.series[0].data = chartDatas.map((item) => {
              return item.value
            });
            option.xAxis.data = chartDatas.map((item) => {
              return item.name
            });
          } else {
            option.series[0].data = [0];
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
</style>

