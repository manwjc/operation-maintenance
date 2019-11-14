<template>
  <!-- 资源：各资源池设备量分布 -->
  <div class="content-chart"
       style="width:100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
       <div class="chart-box-wrap"
          style="width:40%;float:left">
        <div class="chart-box-item"
             v-for="(subItem,subIndex) in chartData.chartList"
             :key="subIndex"
             :id="subItem.id"></div>
      </div>
      <div class="chart-box-wrap"
          style="width:calc(60% - 1px);float:right;border-left: 1px solid #CCCCCC;">
        <div class="chart-box-item"
             v-for="(subItem,subIndex) in chartData1.chartList"
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
import Bus from '../utils/bus.js'

import iframe from 'src/services/iframe/iframe.js'

export default {
    mixins: [DrawChart],
    components: {

    },
    data() {
        return {
            poolOne: true,
            pieList: [],
            pieTooltip: '',
            Port: {
                IdcType: [], // 资源池名字
                NetworkNumber: [], // 网络设备
                PhyNumber: [], // 物理机
                SafeNumber: [], // 安全设备
                StorageNumber: [], // 存储设备
                Total: [], // 总数
                VmNumber: [], // 虚拟机
                data: ['物理服务器', '虚拟服务器', '网络', '安全', '存储']
            },
            chartData: {
                name: '各资源池设备量分布',
                chartList: [{ id: '002x', resourceOption: 'pie-option', chartDatas: '' }]
            },
            chartData1: {
                name: '',
                chartList: [{ id: '001x', resourceOption: 'bar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
    // 获得数据
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        getDatas1() {
            this.chartData1.chartList.chartDatas = []
        },
        getCountByIdcDevCT() {
            iframe.getCountByIdcDevCT().then((res) => {
                res.forEach(item => {
                    this.Port.NetworkNumber.push(item.networkNumber)
                    this.Port.PhyNumber.push(item.phyNumber)
                    this.Port.SafeNumber.push(item.safeNumber)
                    this.Port.StorageNumber.push(item.storageNumber)
                    this.Port.VmNumber.push(item.vmNumber)
                    this.Port.IdcType.push(item.idcType)
                })
                for (let item in res) {
                    this.pieList.push({
                        value: res[item].total,
                        name: res[item].idcType ? res[item].idcType : '未知'
                    })
                }
                this.drawCharts()
                this.drawCharts1()
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
                    option.series[0].data = _this.pieList
                    option.tooltip.formatter = '{b} <br/>设备数: {c} ({d}%)'
                    myChart.setOption(option, true)
          // resize自适应
                    _this.setResizeFun(myChart)
                    myChart.on('click', function(params) {
                        Bus.$emit('poolFlag', _this.poolOne, params.name)
                    })
                })
            })
        },
    // 绘制柱图表
        drawCharts1() {
            let _this = this
            _this.$nextTick(() => {
                _this.chartData1.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
          // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [..._this.chartData1.chartList.chartDatas]
                    option.series[0].data = _this.Port.PhyNumber
                    option.series[1].data = _this.Port.VmNumber
                    option.series[2].data = _this.Port.NetworkNumber
                    option.series[3].data = _this.Port.SafeNumber
                    option.series[4].data = _this.Port.StorageNumber
                    option.xAxis.data = _this.Port.IdcType
                    option.yAxis[0].name = '资源池设备类型分布'
                    option.legend.data = _this.Port.data
                    option.series[0].name = _this.Port.data[0]
                    option.series[1].name = _this.Port.data[1]
                    option.series[2].name = _this.Port.data[2]
                    option.series[3].name = _this.Port.data[3]
                    option.series[4].name = _this.Port.data[4]
                    myChart.setOption(option, true)
          // resize自适应
                    // this.setResizeFun(myChart)
                })
            })
        }
    },
    mounted() {
        this.getDatas()
        this.getDatas1()
        this.getCountByIdcDevCT()
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";

</style>

