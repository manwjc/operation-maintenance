<template>
  <!-- 告警：告警级别 -->
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
        <!-- <el-tabs class="yw-tabs chart-filter-item"
                 v-model="chartData.activeFilter"
                 @tab-click="changeTab">
          <el-tab-pane :label="tabItem.label"
                       :name="tabItem.name"
                       v-for="(tabItem,tabIndex) in chartData.filter"
                       :key="tabIndex">
          </el-tab-pane>
        </el-tabs> -->
      </div>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="progress-rank-wrap">
        <div class="progress-rank-item"
             v-for="(item,index) in chartData.rankList"
             :key="index">
          <el-progress :percentage="item.rate"
                       :stroke-width="10"
                       :color="progressColorMethod(item.level)"></el-progress>
          <p class="progress-text clearfix">
            <span>{{item.level}}</span>
            <span class="process-percentage">{{item.rate+'%'}}</span>
          </p>
        </div>
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
        name: '告警级别',
        filter: [{ name: '日', label: 'day' }, { name: '周', label: 'week' }, { name: '月', label: 'month' }, { name: '季', label: 'season' }, { name: '年', label: 'year' }],
        activeFilter: 'day',
        rankList: [
          { level: '重大', rate: 0 },
          { level: '高', rate: 0 },
          { level: '中', rate: 0 },
          { level: '低', rate: 0 },
        ],
      }
    }
  },
  methods: {
    //获得数据
    getDatas () {
      let params = {
        'idcType': this.conditionParams.poolActive,
        'span': this.chartData.activeFilter,
        // 'span': 'day',
      };
      this.$api.queryAlertLevel(params).then((res) => {
        if (res.summary > 0) {
          this.chartData.rankList[0].rate = (res.serious / res.summary * 100).toFixed(2);
          this.chartData.rankList[1].rate = (res.high / res.summary * 100).toFixed(2);
          this.chartData.rankList[2].rate = (res.medium / res.summary * 100).toFixed(2);
          this.chartData.rankList[3].rate = (res.low / res.summary * 100).toFixed(2);
        }
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

