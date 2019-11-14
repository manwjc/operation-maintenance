<template>
  <!-- 资源：各资源池租户分布 -->
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
            user: true,
            userFlase: false,
            paramsName: '',
            pieList: [],
            IdcType: '',
            Number1List: [],
            Department1List: [],

            chartData: {
                name: '各资源池租户分布',
                chartList: [{ id: 'zPie1', resourceOption: 'pie-option', chartDatas: '' }]
            },
            chartData1: {
                name: '',
                chartList: [{ id: 'zColumn1', resourceOption: 'Zbar-option', chartDatas: '' }]
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
        getCountBizByIdc() {
            iframe.getCountBizByIdc().then((res) => {
                for (let item in res) {
                    this.pieList.push({
                        value: res[item].number,
                        name: res[item].idcType ? res[item].idcType : '未知'
                    })
                }
                this.drawCharts()
            })
        },
        getCountBizByIdcDep1() {
            let data = {
                idcType: this.IdcType
            }
            iframe.getCountBizByIdcDep1(data).then((res) => {
                this.Number1List = []
                this.Department1List = []
                for (let i = 0; i < res.length; i++) {
                    this.Number1List.push(res[i].number)
                    this.Department1List.push(res[i].department1)
                }
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
                    option.tooltip.formatter = '{b} <br/>业务系统数: {c}'
                    myChart.setOption(option, true)

          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        _this.IdcType = params.name
                        _this.paramsName = params.name
                        _this.getCountBizByIdcDep1()

                        Bus.$emit('UserFlase', _this.userFlase)
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
                    option.xAxis.data = _this.Department1List
                    option.series[0].data = _this.Number1List
                    option.yAxis.name = _this.IdcType + '一级租户业务系统分布'
                    option.tooltip.formatter = '{b} <br/>业务系统数: {c}'
                    myChart.setOption(option, true)
          // resize自适应
                    _this.setResizeFun(myChart)

                    myChart.on('click', function(params) {
                        Bus.$emit('User', _this.user, params.name, _this.paramsName)
                    })
                })
            })
        }

    },

    mounted() {
        this.getDatas()
        this.getDatas1()
        this.getCountBizByIdc()
        this.getCountBizByIdcDep1()
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
</style>

