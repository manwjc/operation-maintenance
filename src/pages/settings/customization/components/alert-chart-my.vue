<template>
  <!-- 告警：我的告警 -->
  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <YwAlert :datas="chartData.chartList"></YwAlert>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>

export default {
  components: {
    YwAlert: () => import('src/components/common/yw-alert.vue'),
  },
  data () {
    return {
      chartData: {
        name: '我的告警',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{          name: '活动告警',
          icon: require('src/assets/theme/dark/img/alert-active.png'),
          num: 345678556677,
        },
        {          name: '确认告警',
          icon: require('src/assets/theme/dark/img/alert-confirm.png'),
          num: 150,
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

  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
</style>

