<template>
  <!-- 监控：资源利用率趋势 -->
  <div class="content-chart"
       style="width: 100%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.label}}</el-radio-button>
        </el-radio-group>
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter2"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter2"
                           :key="tabIndex">{{tabItem.label}}</el-radio-button>
        </el-radio-group>
        <treeselect class="yw-treeselect chart-filter-item"
                    v-model="chartData.activeFilter3"
                    :options="chartData.filter3"
                    :multiple="true"
                    :limit="1"
                    @input="changeTab"
                    placeholder="请选择业务系统">
        </treeselect>
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter4"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter4"
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  mixins: [DrawChart],
  components: {
    Treeselect
  },
  data () {
    return {
      chartData: {
        name: '资源利用率趋势',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        filter2: [{ name: 'CPU', label: 'cpu' }, { name: '内存', label: 'memory' }],
        activeFilter2: 'cpu',
        filter3: [],
        activeFilter3: null,
        filter4: [{ name: '日', label: 'day' }, { name: '周', label: 'week' }, { name: '月', label: 'month' }],
        activeFilter4: 'day',
        chartList: [{ id: 'monitor-chart-trend-1', chartOption: 'line-option', chartDatas: '' },
        ],
      }
    }
  },
  methods: {
    //获得查询条件
    getParams () {
      this.$api.queryBizSys().then((res) => {
        this.chartData.filter3 = res;
        this.chartData.activeFilter3 = null;
      })
    },

    //获得数据
    getDatas () {

      let params = {
        'idcType': this.conditionParams.poolActive,
        'startDate': this.conditionParams.dateRange[0],
        'endDate': this.conditionParams.dateRange[1],
        'deviceType': this.chartData.activeFilter,
        'sourceType': this.chartData.activeFilter2,
        'bizSystem': this.chartData.activeFilter3 && this.chartData.activeFilter3.join(','),
        'stateTimeType': this.chartData.activeFilter4,
      };
      this.$api.queryPoolTrend(params).then((res) => {
        this.chartData.chartList[0].chartDatas = res;//对象
        this.drawCharts();
      })

      // this.chartData.chartList[0].chartDatas = [
      //   { date: '2019-09-07', averageValue: '123', maxValue: '789' },
      //   { date: '2019-09-08', averageValue: '345', maxValue: '567' },
      // ];

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
          option.series[0].name = '均值利用率';
          option.series[1].name = '峰值利用率';
          option.legend.data = ['均值利用率', '峰值利用率'];
          option.series[1].lineStyle.color.colorStops = option.selfColors[1];

          if (chartDatas['xAxis'] && chartDatas['xAxis'].length > 0) {
            option.series[0].data = chartDatas['series']['avg'];
            option.series[1].data = chartDatas['series']['max'];
            option.xAxis.data = chartDatas['xAxis'];
          } else {
            option.series[0].data = ['0'];
            option.series[1].data = ['0'];
            option.xAxis.data = ['暂无'];
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
  created () {
    this.getParams();
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

