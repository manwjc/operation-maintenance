<template>
  <!-- 各一级租户设备分类分布TOP5 -->
  <div class="content-chart"
       style="width:39%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
      <div class="chart-box-wrap">
        <div class="chart-box-item"
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
import ResourceOption from '../utils/resourceOption.js'
import DrawChart from 'src/utils/drawCharts.js'

import rbHomeService from 'src/services/iframe/rb-home-service.js'

export default {
    mixins: [DrawChart],
    components: {

    },
    data() {
        return {
            xAxis: [],
            serverCountList: [],
            networkCountList: [],
            safeCountList: [],
            storageCountList: [],
            chartData: {
                name: '各一级租户设备分类分布TOP5',
                chartList: [{ id: 'trenant', resourceOption: 'trenantBar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        // 各一级租户设备类型分布
        countDeviceClassByDepartment1() {
            rbHomeService.countDeviceClassByDepartment1().then((res) => {
                var xAxis = []
                var safeNumber = []
                var networkNumber = []
                var storageNumber = []
                var serverNumber = []
                for (var i = 0; i < res.length; i++) {
                    xAxis.push(res[i].orgName)
                    safeNumber.push(res[i].safeNumber)
                    networkNumber.push(res[i].networkNumber)
                    storageNumber.push(res[i].storageNumber)
                    serverNumber.push(res[i].serverNumber)
                }
                this.xAxis = xAxis
                this.safeCountList = safeNumber
                this.networkCountList = networkNumber
                this.storageCountList = storageNumber
                this.serverCountList = serverNumber
                this.drawCharts()
            })
        },
    // 绘制饼图表
        drawCharts() {
            let _this = this
            _this.$nextTick(() => {
                _this.chartData.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
          // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [..._this.chartData.chartList.chartDatas]

                    option.xAxis.data = _this.xAxis
                    option.series[0].data = _this.serverCountList
                    option.series[1].data = _this.networkCountList
                    option.series[2].data = _this.safeCountList
                    option.series[3].data = _this.storageCountList

                    myChart.setOption(option, true)

          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {

                    })
                })
            })
        }

    },

    mounted() {
        this.getDatas()
        this.countDeviceClassByDepartment1()
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

