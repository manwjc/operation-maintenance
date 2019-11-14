<template>
  <!-- 资源：各资源池设备量分布 -->
  <div class="content-chart"
      v-if = 'poolFlag'
       style="width:100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{poolName}}{{poolThreeName}}{{chartData.name}}</span>
    </section>

    <!-- 多图表 -->
    <section class="chart-section">
       <div class="chart-box-wrap"
          style="width:40%;float:left"
           >
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
            poolFlag: false,
            poolThreeName: '',
            poolName: '',
            pieList: [],
            pieTooltip: '',
            projectData: '',
            tranentName: '',
            deviceClass: ['安全设备', '网络设备', '存储设备'],
            deviceType: ['物理机', '虚拟机'],
            chartData: {
                name: '工期分布',
                chartList: [{ id: '002_2', resourceOption: 'ring-option', chartDatas: '' }]
            },
            chartData1: {
                name: '',
                chartList: [{ id: '001_1', resourceOption: 'Zbar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        bbtnFalg: function() {
            Bus.$on('poolFlagThree', (newV1, newV2, newV3) => {   // 这里最好用箭头函数，不然this指向有问题
                this.poolFlag = newV1
                this.poolThreeName = newV2
                this.poolName = newV3
                this.getCountByIdcPro()
                this.getCountByIdcDevPro()
            })
        },
    // 获得数据
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        getDatas1() {
            this.chartData1.chartList.chartDatas = []
        },

        getCountByIdcDevPro() {
            let data = {
                projectName: this.tranentName,
                idcType: this.poolName,
                deviceType: this.poolThreeName
            }
            iframe.getCountByIdcDevPro(data).then((res) => {
                this.podList = []
                this.podData = []
                res.forEach(item => {
                    this.podList.push(item.pod_name)
                    this.podData.push(item.number)
                })
                this.drawCharts1()
            })
        },
        getCountByIdcPro() {
            let data = {
                idcType: this.poolName,
                deviceType: this.poolThreeName
            }
            iframe.getCountByIdcPro(data).then((res) => {
                this.projectData = []
                res.forEach(item => {
                    for (let key in item) {
                        if (key !== 'device_type') {
                            this.projectData.push({value: item[key], name: key === '' ? '未知' : key})
                        }
                    }
                })

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

                    option.title.text = []
                    option.title.subtext = []
                    option.series[0].data = _this.projectData
                    // option.series[0].label.labelLine.show = true
                    // option.series[0].label.normal.show = true
                    // option.series[0].emphasis.label.show = true
                    option.tooltip.formatter = '{b} <br/>设备数: {c} ({d}%)'
                    myChart.setOption(option, true)
          // resize自适应
                    _this.setResizeFun(myChart)
                    myChart.on('click', function(params) {
                        _this.tranentName = params.name
                        _this.getCountByIdcDevPro()
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
                    option.xAxis.data = _this.podList
                    option.series[0].data = _this.podData
                    option.yAxis.name = _this.poolName + _this.tranentName + 'POD池分布'
                    myChart.setOption(option, true)
          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        _this.$router.push({
                            path: '/resource/iframe/list',
                            query: {
                                parentParams: {
                                    deviceProject: _this.tranentName,
                                    pod: params.name,
                                    deviceType: _this.deviceType.indexOf(_this.poolThreeName) > -1 ? _this.poolThreeName : undefined,
                                    deviceClass: _this.deviceClass.indexOf(_this.poolThreeName) > -1 ? _this.poolThreeName : undefined,
                                    idcType: _this.poolName
                                }
                            }
                        })
                    })
                })
            })
        }
    },
    mounted() {
        this.bbtnFalg()
        this.getDatas()
        this.getDatas1()
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";

</style>

