<template>
  <!-- 资源：总览 -->
  <div class="content-chart"
       style="width:49.4%;">
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
      <div class="chart-box-wrap">
        <div class="chart-box-item"
             style="width:24.2%"
             v-for="(item,index) in chartData.chartList"
             :key="index">
          <div class="progress-rank-wrap">
            <div class="progress-rank-header"
                 :class="item.status">
              <span class="progress-rank-title">{{item.name}}</span>
            </div>
            <div class="progress-rank-main">
              <YwProgress :datas="item"></YwProgress>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 多图表 -->
  </div>
</template>

<script>

export default {
  components: {
    YwProgress: () => import('src/components/common/yw-progress.vue'),
  },
  data () {
    return {
      chartData: {
        name: '资源总览',
        filter: [{ name: '物理机', label: '物理机' }, { name: '虚拟机', label: '虚拟机' }],
        activeFilter: '物理机',
        chartList: [{ name: '服务器', list: [], status: 'blue' }, { name: '网络设备', list: [], status: 'green' },
        { name: '存储设备', list: [], status: 'green' }, { name: '安全设备', list: [], status: 'purple' }],
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
      this.chartData.chartList[0].list = [
        { name: '物理机', num: 1200, total: 2500, rate: 90, tip: '物理机包含裸金属和宿主机' },
        { name: '虚拟机', num: 1000, total: 2000, rate: 50 },
      ];
      this.chartData.chartList[1].list = [
        { name: '交换机', num: 1200, total: 2500, rate: 30 },
        { name: '路由器', num: 1000, total: 2000, rate: 30 },
        { name: '负载均衡器', num: 1000, total: 2000, rate: 30 },
      ];
      this.chartData.chartList[2].list = [
        { name: 'SAN', num: 1200, total: 2500, rate: 80 },
        { name: '块存储', num: 1000, total: 2000, rate: 30 },
      ];
      this.chartData.chartList[3].list = [
        { name: 'IPS', num: 1200, total: 2500, rate: 80 },
        { name: '防火墙', num: 1000, total: 2000, rate: 30 },
      ];


    },
  },
  mounted () {
    this.getDatas();
  }

}
</script>

<style lang="scss" scoped>
</style>

