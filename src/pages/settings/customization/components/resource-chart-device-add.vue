<template>
  <!-- 资源：各设备类型新增设备量趋势分布 -->
  <div class="content-chart"
       style="width:60%;height:300px;">
    <section class="chart-title-wrap clearfix">
      <span class="chart-title">{{chartData.name}}</span>

      <!-- <div class="poolTenantAnnularBotton">
        <div @click="annularBotton('p1')">
            <p :class="{activeAnnular:p1}">日</p>
        </div>
        <div @click="annularBotton('p2')">
            <p :class="{activeAnnular:p2}">月</p>
        </div>
      </div> -->
      <div class="chart-filter">
        <el-radio-group class="yw-radio-button-wrap chart-filter-item"
                        v-model="chartData.activeFilter"
                        @change="changeTab">
          <el-radio-button :label="tabItem.label"
                           v-for="(tabItem,tabIndex) in chartData.filter"
                           :key="tabIndex">{{tabItem.label}}</el-radio-button>
        </el-radio-group>
      </div>
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
import ResourceOption from '../utils/resourceOption'
import DrawChart from 'src/utils/drawCharts.js'

import rbHomeService from 'src/services/iframe/rb-home-service.js'

export default {
    mixins: [DrawChart],
    components: {

    },
    data() {
        return {
            tabPosition: 'right',
            p1: false,
            p2: true,
            xAxis: [],
            serverCountList: [],
            networkCountList: [],
            safeCountList: [],
            storageCountList: [],
            chartData: {
                name: '各设备类型新增设备量趋势分布',
                filter: [{ name: '-1', label: '日' }, { name: '0', label: '月' }],
                activeFilter: '日',
                chartList: [{ id: 'line1', resourceOption: 'line-option', chartDatas: '' }]
            }
        }
    },

    methods: {

        changeTab(val) {
            if (val === '日') {
                rbHomeService.countDeviceClassTrendWithDay().then((res) => {
                    this.packageData(res)
                    this.drawCharts('line1')
                })
            } else {
                rbHomeService.countDeviceClassTrendWithMonth().then((res) => {
                    this.packageData(res)
                    this.drawCharts('line1')
                })
            }
        },
    // 获得数据
        getDatas() {
            this.chartData.chartList.chartDatas = []
        },
        // countDeviceClassTrend(flag) {
        //     if (flag === 'p1') {
        //         rbHomeService.countDeviceClassTrendWithDay().then((res) => {
        //             this.packageData(res)
        //             this.drawCharts('line1')
        //         })
        //     } else {
        //         rbHomeService.countDeviceClassTrendWithMonth().then((res) => {
        //             this.packageData(res)
        //             this.drawCharts('line1')
        //         })
        //     }
        // },
        // 封装数据
        packageData(data) {
            var xAxis = []
            var safeNumber = []
            var networkNumber = []
            var storageNumber = []
            var serverNumber = []
            for (var i = 0; i < data.length; i++) {
                xAxis.push(data[i].currentDate)
                safeNumber.push(data[i].safeNumber)
                networkNumber.push(data[i].networkNumber)
                storageNumber.push(data[i].storageNumber)
                serverNumber.push(data[i].serverNumber)
            }
            this.xAxis = xAxis
            this.safeCountList = safeNumber
            this.networkCountList = networkNumber
            this.storageCountList = storageNumber
            this.serverCountList = serverNumber
        },
        // annularBotton(data) {
        //     this.p1 = false
        //     this.p2 = false
        //     this[data] = true
        //     this.countDeviceClassTrend(data)
        // },
    // 绘制饼图表
        drawCharts(id) {
            console.log('this', this)
            let _this = this
            _this.$nextTick(() => {
                _this.chartData.chartList.forEach((subItem, subIndex) => {
                    let myChart = echarts.init(document.getElementById(subItem.id))
                    myChart.clear()
                    // 数据格式处理
                    let option = { ...ResourceOption[subItem.resourceOption] }
                    let chartDatas = [..._this.chartData.chartList.chartDatas]

                    option.xAxis.data = _this.xAxis
                    option.series[0].data = _this.safeCountList
                    option.series[1].data = _this.networkCountList
                    option.series[2].data = _this.serverCountList
                    option.series[3].data = _this.serverCountList

                    myChart.setOption(option, true)
                    // resize自适应
                    _this.setResizeFun(myChart)
                    
                    myChart.getZr().on('click', function(params) {
                        var monthList = ['0', '31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31']
                        var pointInPixel = [params.offsetX, params.offsetY]
                        if (myChart.containPixel('grid', pointInPixel)) {
                            var xIndex = myChart.convertFromPixel({seriesIndex: 0}, [params.offsetX, params.offsetY])[0]
                            var ds = myChart.getOption().xAxis[0].data[xIndex]
                            var start, end
                            if (_this.p1) {
                                start = ds
                                end = ds
                            } else {
                                var date = ds.split('-')
                                var year = parseInt(date[0])
                                var month = parseInt(date[1])
                                var monthEndDay = monthList[month]
                                if (month === 2) {
                                    if (year % 4 === 0 && year % 100 !== 0) {
                                        monthEndDay = monthEndDay + 1
                                    } else if (year % 4 === 0 && year % 400 === 0) {
                                        monthEndDay = monthEndDay + 1
                                    }
                                }
                                start = ds + '-01'
                                end = ds + '-' + monthEndDay
                            }
                            _this.$router.push({
                                path: '/resource/iframe/list',
                                query: {
                                    parentParams: {
                                        'startInsertTime': start,
                                        'endInsertTime': end
                                    }
                                }
                            })
                        }
                    })
                })
            })
        }

    },

    mounted() {
        this.getDatas()
        // this.countDeviceClassTrend()
        this.changeTab('日')
    },
    beforeDestroy() {

    }
}
</script>

<style lang="scss" scoped>
@import "./scss/chart.scss";
    .poolTenantAnnularBotton {
        float:right;
        line-height:rem(48);
        margin-right:10px;
        div {
            float:left;
            cursor: pointer;
            width:55px;
            height:rem(20);
            line-height:rem(20);
            text-align:center;
            font-size: rem(14);
            p {
                display:inline-block;
                margin-top:14px;
            }
        }
        .activeAnnular {
            border-bottom: 2px solid #028ded;
            color: #028ded;
        }
    }
</style>

