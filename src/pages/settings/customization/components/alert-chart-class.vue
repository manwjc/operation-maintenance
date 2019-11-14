<template>
  <!-- 告警：设备分类 -->
  <div class="content-chart"
       style="width: 49.5%;height:300px;">
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
        name: '设备分类',
        filter: [{ name: '日', label: 'day' }, { name: '周', label: 'week' }, { name: '月', label: 'month' }, { name: '季', label: 'season' }, { name: '年', label: 'year' }],
        activeFilter: 'day',
        chartList: [{ id: '002', chartOption: 'pie-option', chartDatas: [] }],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {

      let params = {
        'idcType': this.conditionParams.poolActive,
        'span': this.chartData.activeFilter,
      };
      this.$api.queryDeviceClass(params).then((res) => {
        this.chartData.chartList[0].chartDatas = res;
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

          if (chartDatas && chartDatas.length > 0) {
            option.series[0].data = [];
            chartDatas.forEach((item, index) => {
              option.series[0].data.push({
                name: item.deviceType,
                value: item.alertNum
              });
            });
          } else {
            option.series[0].data = [{ name: '暂无', value: '0' }];

          }

          myChart.setOption(option, true);

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

