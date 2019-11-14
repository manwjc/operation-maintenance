<template>
  <!-- 告警：当日告警总览 -->
  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <YwAlertStatus :datas="chartData.chartList"></YwAlertStatus>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>

export default {
  components: {
    YwAlertStatus: () => import('src/components/common/yw-alert-status.vue'),
  },
  data () {
    return {
      chartData: {
        name: '当日告警总览',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{          name: '待确认',
          icon: require('src/assets/theme/dark/img/alert-wait-confirm.png'),
          num: 12234567899344556,
          numList: [
            { status: 'red', num: 3445678223444555 },
            { status: 'orange', num: 2334455677881234 },
            { status: 'yellow', num: 123445555 },
            { status: 'blue', num: 4567777 },
          ]
        },
        {          name: '已确认',
          icon: require('src/assets/theme/dark/img/alert-finish-confirm.png'),
          num: 0,
          numList: [
            { status: 'red', num: '0' },
            { status: 'orange', num: '0' },
            { status: 'yellow', num: '0' },
            { status: 'blue', num: '0' },
          ]
        },
        {          name: '已清除',
          icon: require('src/assets/theme/dark/img/alert-finish-clean.png'),
          num: 0,
          numList: [
            { status: 'red', num: '0' },
            { status: 'orange', num: '0' },
            { status: 'yellow', num: '0' },
            { status: 'blue', num: '0' },
          ]
        },
        {          name: '已解除',
          icon: require('src/assets/theme/dark/img/alert-finish-release.png'),
          num: 0,
          numList: [
            { status: 'red', num: '0' },
            { status: 'orange', num: '0' },
            { status: 'yellow', num: '0' },
            { status: 'blue', num: '0' },
          ]
        }],
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
.chart-section {
  padding: 0;
}
</style>

