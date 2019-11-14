<template>
  <!-- 告警：最新热点告警 -->
  <div class="content-chart"
       style="width: 24.2%;">
    <section class="chart-title-wrap clearfix">
      <i class="chart-icon icon-rate"></i>
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <YwAlertHot :datas="chartData.chartList"></YwAlertHot>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>

export default {
  components: {
    YwAlertHot: () => import('src/components/common/yw-alert-hot.vue'),
  },
  data () {
    return {
      chartData: {
        name: '最新热点告警',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{
          status: 'red',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
        {
          status: 'orange',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
        {
          status: 'orange',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
        {
          status: 'orange',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
        {
          status: 'orange',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
        {
          status: 'orange',
          statusName: '严重',
          name: '设备电源故障',
          desc: '设备电源故障 IP  国际资源池 1期-POD1 服务器-物理机',
          date: '2019-10-14  20:18'
        },
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

