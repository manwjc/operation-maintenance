<template>
  <!-- 告警：告警设备相关Top10 -->
  <div class="content-chart"
       style="width: 100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter2"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter2"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
             style="width:33%"
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
        name: '告警设备相关Top10',
        filter: [{ name: '服务器', label: '服务器' }, { name: '防火墙', label: '防火墙' }, { name: '路由器', label: '路由器' }, { name: '交换机', label: '交换机' }],
        activeFilter: '服务器',
        filter2: [{ name: '全部', label: '' }, { name: '严重', label: '5' }, { name: '高', label: '4' }, { name: '中', label: '3' }, { name: '低', label: '2' }],
        activeFilter2: '',
        chartList: [{ id: 'alert-chart-device-1', chartOption: 'bar-option', chartDatas: '' },
        { id: 'alert-chart-device-2', chartOption: 'bar-option', chartDatas: '' },
        { id: 'alert-chart-device-3', chartOption: 'bar-option', chartDatas: '' }],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {
      let params = {
        'idcType': this.conditionParams.poolActive,
        'colName': 'mfrs',
        'deviceType': this.chartData.activeFilter,
        'alertLevel': this.chartData.activeFilter2,
      };

      this.$api.queryAlertDevice(params).then((res) => {
        this.chartData.chartList[0].chartDatas = res;
        this.drawCharts();
      })

      let params2 = {
        'idcType': this.conditionParams.poolActive,
        'colName': 'podName',
        'deviceType': this.chartData.activeFilter,
        'alertLevel': this.chartData.activeFilter2,
      };

      this.$api.queryAlertDevice(params2).then((res) => {
        this.chartData.chartList[1].chartDatas = res;
        this.drawCharts();
      })

      let params3 = {
        'idcType': this.conditionParams.poolActive,
        'colName': 'deviceModel',
        'deviceType': this.chartData.activeFilter,
        'alertLevel': this.chartData.activeFilter2,
      };

      this.$api.queryAlertDevice(params3).then((res) => {
        this.chartData.chartList[2].chartDatas = res;
        this.drawCharts();
      })



    },

    //绘制图表
    drawCharts () {
      this.$nextTick(() => {
        let legendList = ['告警厂家top10', '告警POD池Top10', '告警设备型号Top10'];
        this.chartData.chartList.forEach((subItem, subIndex) => {
          let myChart = echarts.init(document.getElementById(subItem.id));
          myChart.clear();
          //数据格式处理
          let option = JSON.parse(JSON.stringify(ChartOption[subItem.chartOption]));
          let chartDatas = JSON.parse(JSON.stringify(subItem.chartDatas));
          option.series[0].name = legendList[subIndex];
          option.legend.data = [option.series[0].name];

          if (chartDatas && chartDatas.length > 0) {
            option.series[0].data = chartDatas.map((item) => {
              return item.count
            });
            option.xAxis.data = chartDatas.map((item) => {
              return item.colName
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
@import "./scss/chart.scss";
</style>

