<template>
  <!-- 监控：租户资源利用率分布 -->
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
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter2"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter2"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
        <treeselect class="yw-treeselect chart-filter-item"
                    v-model="chartData.activeFilter3"
                    :options="chartData.filter3"
                    :multiple="true"
                    :auto-load-root-options="false"
                    :limit="1"
                    @input="changeTab"
                    placeholder="请选择业务系统">
        </treeselect>
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
        name: '租户资源利用率分布',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        filter2: [{ name: 'cpu', label: 'CPU' }, { name: '内存', label: 'memory' }],
        activeFilter2: 'cpu',
        filter3: [],
        activeFilter3: null,
        chartList: [{ id: 'monitor-chart-user-1', chartOption: 'bar-option', chartDatas: '' },
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
      this.chartData.activeFilter3 = null;

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
      };
      this.$api.queryUserRate(params).then((res) => {
        this.chartData.chartList[0].chartDatas = res;//对象
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

          option.yAxis[0].name = '分布占比(%)';

          option.series[0] = JSON.parse(JSON.stringify(option.series[0]));
          option.series[1] = JSON.parse(JSON.stringify(option.series[0]));
          option.series[2] = JSON.parse(JSON.stringify(option.series[0]));
          option.series[3] = JSON.parse(JSON.stringify(option.series[0]));

          let legendName = 'CPU峰值';
          option.series[0].name = `${legendName}≥80%`;
          option.series[1].name = `80%>${legendName}≥40%`;
          option.series[2].name = `40%>${legendName}≥15%`;
          option.series[3].name = `${legendName}<15%`;

          option.legend.data = [option.series[0].name, option.series[1].name, option.series[2].name, option.series[3].name];
          option.series[0].itemStyle.color.colorStops = option.blueColors[0];
          option.series[1].itemStyle.color.colorStops = option.blueColors[1];
          option.series[2].itemStyle.color.colorStops = option.blueColors[2];
          option.series[3].itemStyle.color.colorStops = option.blueColors[3];

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
  created () {
    this.getParams();
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

