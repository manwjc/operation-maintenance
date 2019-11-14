<template>
  <!-- 资源：各资源池租户分布 -->
  <div class="content-chart"
        v-if="userBoolean"
       style="width:100%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{titleName}}{{chartData.name}}</span>
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
            userBoolean: false,
            titleName: '',
            idtypeName: '',
            annularName: '',
            bizSystemName: '',
            pieList: [],
            IdcType: '',
            Number1List: [],
            Department1List: [],
            Zu2: [],

            bizSystemList: [],
            numberList: [],

            chartData: {
                name: '二级租户业务系统分布',
                chartList: [{ id: 'zPie2', resourceOption: 'ring-option', chartDatas: '' }]
            },
            chartData1: {
                name: '',
                chartList: [{ id: 'zColumn2', resourceOption: 'Zbar-option', chartDatas: '' }]
            }
        }
    },

    methods: {
        bbtn: function() {
            Bus.$on('User', (newV1, newv2, newv3) => {   // 这里最好用箭头函数，不然this指向有问题
                this.userBoolean = newV1
                this.titleName = newv2
                this.idtypeName = newv3
                this.getCountBizByIdcDep2()
                this.getCountByIdcDep2Biz()
            })
        },
        bbtnFalse: function() {
            Bus.$on('UserFlase', (newV1) => {   // 这里最好用箭头函数，不然this指向有问题
                this.userBoolean = newV1
            })
        },
    // 获得数据
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        getDatas1() {
            this.chartData1.chartList.chartDatas = []
        },
    // 柱状图数据
        getCountByIdcDep2Biz() {
            let data = {
                department2: this.annularName,
                department1: this.titleName,
                idcType: this.idtypeName
            }
            iframe.getCountByIdcDep2Biz(data).then((res) => {
                this.bizSystemList = []
                this.numberList = []
                for (let i = 0; i < res.length; i++) {
                    this.bizSystemList.push(res[i].bizSystem)
                    this.numberList.push(res[i].number)
                }
                this.drawCharts1()
            })
        },
    // 环形图数据
        getCountBizByIdcDep2() {
            let data = {
                department1: this.titleName,
                idcType: this.idtypeName
            }
            iframe.getCountBizByIdcDep2(data).then((res) => {
                let dataList = res.dataList
                this.Zu2 = []
                this.Total = ''
                this.Total = res.total
                for (let item in dataList) {
                    this.Zu2.push({
                        name: dataList[item].department2 ? dataList[item].department2 : '未知',
                        value: dataList[item].number
                    })
                }
                this.drawCharts()
            })
        },
    // 绘制环形图表
        drawCharts() {
            let _this = this
            _this.$nextTick(() => {
                _this.chartData.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
                    // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [..._this.chartData.chartList.chartDatas]
                    option.series[0].data = ''
                    option.title.subtext = ''
                    option.series[0].data = _this.Zu2
                    option.title.subtext = _this.Total
                    option.title.text = _this.titleName
                    // option.series[0].label.labelLine.show = false
                    // option.series[0].label.normal.show = false
                    // option.series[0].emphasis.label.show = false
                    // option.legend.show = true

                    option.tooltip.formatter = '{b} <br/>业务系统数: {c}'

                    myChart.setOption(option, true)

                    // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        _this.annularName = params.name

                        _this.getCountByIdcDep2Biz()
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
          // option.xAxis.data = []
                    option.xAxis.data = _this.bizSystemList.length > 0 ? _this.bizSystemList : '暂无数据'
                    option.series[0].data = _this.numberList
                    option.yAxis.name = _this.annularName + '业务系统设备分布'
                    option.tooltip.formatter = '{b} <br/>设备数: {c}'
                    myChart.setOption(option, true)
          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        _this.bizSystemName = params.name
                        _this.$router.push({
                            path: '/resource/iframe/list',
                            query: {
                                parentParams: {
                                    idcType: _this.idtypeName,
                                    department1: _this.titleName,
                                    department2: _this.annularName,
                                    bizSystem: _this.bizSystemName
                                }
                            }
                        })
                    })
                })
            })
        }

    },

    mounted() {
        this.bbtn()
        this.bbtnFalse()
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

