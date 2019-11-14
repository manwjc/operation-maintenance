<template>
  <!-- 工单：总览 -->
  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
      <!-- <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.name}}</el-radio-button>
        </el-radio-group>
      </div> -->
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap direction-column">
        <div class="chart-box-item"
             style="width:100%;height:40%">
          <YwOrder :datas="chartData.orderList"></YwOrder>
        </div>
        <div class="chart-box-item"
             style="width:100%;"
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
  components: {
    YwOrder: () => import('src/components/common/yw-order.vue'),
  },
  data () {
    return {
      chartData: {
        name: '工单总览',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        orderList: [{
          name: '我的请求',
          icon: require('src/assets/theme/dark/img/order-require.png'),
          num: 150,
          date: 20,
          timeDesc: '逾期'
        }, {
          name: '我的待处理',
          icon: require('src/assets/theme/dark/img/order-wait.png'),
          num: 150,
          date: 20,
          timeDesc: '逾期'
        }],
        chartList: [
          { id: 'order-chart-overview-1', chartOption: 'bar-option', chartDatas: '' }],
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
    },
  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
</style>

