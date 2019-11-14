<template>
  <!-- 资源：各资源池设备量分布 -->
  <div class="content-chart"
      v-if = 'poolTwo'
       style="width:100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{poolTwoName}}{{chartData.name}}</span>
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
        <!-- <div class="chart-box-item"
             v-for="(subItem,subIndex) in chartData1.chartList"
             :key="subIndex"
             :id="subItem.id"></div> -->
          <div ref="bar" id="eqAnColumn0" style="width:100%;height:100%;"></div>
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
            poolTwo: false,
            poolThree: true,
            poolTwoName: '',
            pieList: [],
            pieTooltip: '',
            nameList: {
                phyNumber: '物理机',
                vmNumber: '虚拟机',
                networkNumber: '网络设备',
                storageNumber: '存储设备',
                safeNumber: '安全设备'
            },
            columnChart: {},
            xList: [],
            legendList: [],
            seriesList: [],
            sendAnnular0: true,
            NameList: [],
            Device_type: [],
            deviceClass: ['安全设备', '网络设备', '存储设备'],
            deviceType: ['物理机', '虚拟机'],
            colors: [
            ['#5B94FF', '#305BFF'],
            ['#1DDCEE', '#0DA8FF'],
            ['#FFDF61', '#FFBC07'],
            ['#F8475C', '#DD0F2C'],
            ['#FF862D', '#FF6600'],
            ['#3CFFB3', '#18DAAA'],
            ['#4FFF57', '#31D550'],
            ['#DFFF70', '#AFF800'],
            ['#FFE823', '#F4C22B'],
            ['#607FF1', '#1C56D9']
            ], // 配置颜色
            seriesData: {
                name: '',
                type: 'bar',
                data: null,
                barWidth: 13, // 柱图宽度
                itemStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 1, color: '#305BFF' // 0% 处的颜色
                            }, {
                                offset: 0, color: '#5B94FF' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false, // 开启显示
                            position: '', // 在上方显示
                            textStyle: { // 数值样式
                                color: '#fff',
                                fontSize: 12
                            }
                        }
                    }
                }
            },
            chartData: {
                name: '设备分类分布',
                chartList: [{ id: '002_1', resourceOption: 'pie-option', chartDatas: '' }]
            },
            chartData1: {
                name: '',
                chartList: [{ id: '001_1', resourceOption: 'bar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        bbtnFalg: function() {
            Bus.$on('poolFlag', (newV1, newV2) => {   // 这里最好用箭头函数，不然this指向有问题
                this.poolTwo = newV1
                this.poolTwoName = newV2
                this.getCountByIdcDevCT()
                this.getCountByIdcPro()
            })
        },
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        resetData() {
            this.Port = {
                IdcType: [], // 资源池名字
                NetworkNumber: [], // 网络设备
                PhyNumber: [], // 物理机
                SafeNumber: [], // 安全设备
                StorageNumber: [], // 存储设备
                Total: [], // 总数
                VmNumber: [], // 虚拟机
                data: ['物理服务器', '虚拟服务器', '网络', '安全', '存储']
            }
        },

        getCountByIdcDevCT() {
      // this.$refs['secondColumn'].getCountByIdcPro()
            let data = {
                idcType: this.poolTwoName
            }
            iframe.getCountByIdcDevCT(data).then((res) => {
                this.pieList = []
                res.forEach(item => {
                    for (let key in item) {
                        if (this.nameList[key]) {
                            this.pieList.push({
                                value: item[key],
                                name: this.nameList[key]
                            })
                        }
                    }
                })
                this.drawCharts()
            })
        },
        getCountByIdcPro() {
            let data = {
                idcType: this.poolTwoName
            }
            iframe.getCountByIdcPro(data).then((res) => {
                this.columnChart = {}
                this.xList = []
                this.legendList = []
                res.forEach(item => {
                    for (let key in item) {
                        if (key === '') {
                            key = '未知'
                            item[key] = item['']
                        }
                        if (key === 'device_type') {
                            this.xList.push(item[key])
                        } else {
                            if (this.columnChart[key]) {
                                this.columnChart[key].push(item[key])
                            } else {
                                this.legendList.push(key)
                                this.columnChart[key] = []
                                this.columnChart[key].push(item[key])
                            }
                        }
                    }
                })

                this.seriesList = []
                this.legendList.forEach((item, index) => {
                    let series = JSON.parse(JSON.stringify(this.seriesData))
                    series.name = item
                    series.data = this.columnChart[item]
                    series.itemStyle.normal.color.colorStops[1].color = this.colors[index][0]
                    series.itemStyle.normal.color.colorStops[0].color = this.colors[index][1]
                    this.seriesList.push(
              series
            )
                })
                this.echartsTypeColumn()
            })
        },
    // 绘制饼图表
        drawCharts() {
            this.$nextTick(() => {
                this.chartData.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
          // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [...this.chartData.chartList.chartDatas]
                    option.series[0].data = this.pieList
                    option.tooltip.formatter = '{b} <br/>设备数: {c} ({d}%)'
                    myChart.setOption(option, true)
          // resize自适应
                    this.setResizeFun(myChart)
                })
            })
        },
        echartsTypeColumn() {
            let that = this
            let myChart = echarts.init(document.getElementById('eqAnColumn0'))
            myChart.clear()
            myChart.setOption({
                title: {
                    text: ''
                },
                tooltip: {},
                grid: {
                    top: '50',
                    bottom: '30',
                    right: '30',
                    left: '70'
                },
                legend: {
                    data: that.legendList,
                    icon: 'circle',
                    right: '20',
                    itemHeight: 9, // 改变圆圈大小
                    textStyle: { // 图例文字的样式
                        color: '#666666'
                    },
                    y: '0'
                },
                xAxis: {
                    data: that.xList,
                    axisLabel: {
                        textStyle: { // 改变刻度字体样式
                            color: '#5E6D82'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#E5E8ED',
                            width: 1
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    // name:'设备数',
                    axisLabel: {
                        textStyle: { // 改变刻度字体样式
                            color: '#5E6D82'
                        }
                    },
                    splitLine: {    // 网格线
                        lineStyle: {
                            type: 'dashed'    // 设置网格线类型 dotted：虚线   solid:实线
                        },
                        show: true // 隐藏或显示
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: that.seriesList
            })
            myChart.on('click', function(params) {
                if (that.poolTwoName === '哈尔滨资源池' || that.poolTwoName === '呼和浩特资源池') {
                    Bus.$emit('poolFlagThree', that.poolThree, params.name, that.poolTwoName)
                } else {
                    that.$router.push({
                        path: '/resource/iframe/list',
                        query: {
                            parentParams: {
                                deviceProject: params.seriesName,
                                deviceType: that.deviceType.indexOf(params.name) > -1 ? params.name : undefined,
                                deviceClass: that.deviceClass.indexOf(params.name) > -1 ? params.name : undefined,
                                idcType: that.poolTwoName
                            }
                        }
                    })
                }
            })
        }
    },
    mounted() {
        this.bbtnFalg()
        this.getDatas()
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";

</style>

